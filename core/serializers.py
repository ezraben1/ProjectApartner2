from rest_framework import serializers
from .models import Room, Apartment, RoomImage, Review, CustomUser, Contract, Bill
from django.shortcuts import get_object_or_404


class ApartmentImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        apartment_id = self.context["apartment_id"]
        return RoomImage.objects.create(apartment_id=apartment_id, **validated_data)

    class Meta:
        model = RoomImage
        fields = ["id", "image"]


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = [
            "id",
            "apartment",
            "bill_type",
            "amount",
            "date",
            "created_by",
            "created_at",
            "document",
        ]
        read_only_fields = ["created_by", "created_at"]

    def validate(self, data):
        user = self.context["request"].user
        apartment = data["apartment"]
        if apartment.owner != user:
            raise serializers.ValidationError(
                "You are not the owner of this apartment."
            )
        return data


class ApartmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.email")
    rooms = serializers.SerializerMethodField()
    bill_ids = serializers.SerializerMethodField()

    def get_rooms(self, obj):
        rooms_queryset = obj.rooms.all()
        return RoomSerializer(rooms_queryset, many=True).data

    def get_bill_ids(self, obj):
        bills = obj.bills.all()
        return [bill.id for bill in bills]

    class Meta:
        model = Apartment
        fields = ["id", "owner", "address", "description", "size", "bill_ids", "rooms"]


class RoomImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        room_id = self.context["room_id"]
        return RoomImage.objects.create(room_id=room_id, **validated_data)

    class Meta:
        model = RoomImage
        fields = ["id", "image"]


class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    apartment_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Room
        fields = [
            "id",
            "description",
            "size",
            "price_per_month",
            "window",
            "images",
            "apartment_id",
            "contract",
            "renter",
        ]

    def create(self, validated_data):
        apartment_id = validated_data.pop("apartment_id")
        apartment = get_object_or_404(Apartment, id=apartment_id)
        room = Room.objects.create(apartment=apartment, **validated_data)
        return room

    def update(self, instance, validated_data):
        renter_id = validated_data.pop("renter_id", None)
        if renter_id is not None:
            renter = get_object_or_404(CustomUser, id=renter_id, user_type="renter")
            instance.renter = renter
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "date", "name", "description"]

    def create(self, validated_data):
        product_id = self.context["product_id"]
        return Review.objects.create(product_id=product_id, **validated_data)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "username",
            "email",
            "password",
            "user_type",
            "first_name",
            "last_name",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ContractSerializer(serializers.ModelSerializer):
    room_id = serializers.IntegerField(source="room.id", read_only=True)
    apartment_id = serializers.IntegerField(source="room.apartment.id", read_only=True)

    class Meta:
        model = Contract
        fields = [
            "id",
            "room_id",
            "apartment_id",
            "start_date",
            "end_date",
            "deposit_amount",
            "rent_amount",
        ]
