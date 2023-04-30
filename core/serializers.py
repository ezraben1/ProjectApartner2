from rest_framework import serializers
from .models import (
    ApartmentImage,
    Room,
    Apartment,
    RoomImage,
    Review,
    CustomUser,
    Contract,
    Bill,
)
from django.shortcuts import get_object_or_404
from django.utils import timezone


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
        ]
        read_only_fields = ["created_by", "created_at"]

    def validate(self, data):
        # Validate apartment ownership
        user = self.context["request"].user
        apartment = data["apartment"]
        if apartment.owner != user:
            raise serializers.ValidationError(
                "You are not the owner of this apartment."
            )

        # Validate date is not in the future
        date = data["date"]
        if date > timezone.localdate():
            raise serializers.ValidationError("Date cannot be in the future.")

        return data


class ApartmentImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        apartment_id = self.context["apartment_id"]
        return ApartmentImage.objects.create(
            apartment_id=apartment_id, **validated_data
        )

    class Meta:
        model = RoomImage
        fields = ["id", "image"]


class ApartmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.email")
    rooms = serializers.SerializerMethodField()
    bill_ids = serializers.SerializerMethodField()
    images = ApartmentImageSerializer(many=True, read_only=True)

    def get_rooms(self, obj):
        rooms_queryset = obj.rooms.all()
        context = self.context.copy()
        context["nested"] = True
        return RoomSerializer(rooms_queryset, many=True, context=context).data

    def get_bill_ids(self, obj):
        bills = obj.bills.all()
        return [bill.id for bill in bills]

    class Meta:
        model = Apartment
        fields = [
            "id",
            "owner",
            "address",
            "description",
            "size",
            "bill_ids",
            "rooms",
            "images",
        ]


class ContractSerializer(serializers.ModelSerializer):
    room_id = serializers.IntegerField(source="room.id", read_only=True)
    apartment_id = serializers.PrimaryKeyRelatedField(
        source="room.apartment.id", read_only=True
    )

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


class RoomImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        room_id = self.context["room_id"]
        return RoomImage.objects.create(room_id=room_id, **validated_data)

    class Meta:
        model = RoomImage
        fields = ["id", "image"]


class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    apartment = serializers.PrimaryKeyRelatedField(
        queryset=Apartment.objects.all(), write_only=True
    )
    contract = ContractSerializer(read_only=True)

    def to_representation(self, instance):
        if self.context.get("nested"):
            self.fields.pop("apartment", None)
        return super().to_representation(instance)

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
            "apartment",
            "images",
        ]

    def create(self, validated_data):
        apartment = validated_data.pop("apartment")
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
            "avatar",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
