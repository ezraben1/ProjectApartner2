from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .models import Contract, CustomUser, Review, Room, RoomImage, Bill, Apartment
from . import serializers
from rest_framework import permissions
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.filters import OrderingFilter, SearchFilter
from core.filters import RoomFilter
from core.pagination import DefaultPagination
from core.permissions import (
    IsApartmentOwner,
    IsAuthenticated,
    IsOwnerOrReadOnly,
    IsSearcher,
)
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.exceptions import ValidationError


class ApartmentViewSet(ModelViewSet):
    serializer_class = serializers.ApartmentSerializer
    queryset = Apartment.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = [
        "address",
        "description",
        "size",
        "balcony",
        "bbq_allowed",
        "smoking_allowed",
        "allowed_pets",
        "ac",
    ]
    permission_classes_by_action = {
        "create": [permissions.IsAuthenticated, IsApartmentOwner],
        "update": [permissions.IsAuthenticated, IsApartmentOwner],
        "partial_update": [permissions.IsAuthenticated, IsApartmentOwner],
        "destroy": [permissions.IsAuthenticated, IsApartmentOwner],
        "contracts": [permissions.IsAuthenticated, IsApartmentOwner],
        "bills": [permissions.IsAuthenticated, IsApartmentOwner],
        "send_email": [permissions.IsAuthenticated, IsSearcher],
    }

    def get_permissions(self):
        try:
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    @action(detail=True)
    def contracts(self, request, pk=None):
        apartment = self.get_object()
        contracts = Contract.objects.filter(room__apartment=apartment)
        serializer = serializers.ContractSerializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def bills(self, request, pk=None):
        apartment = self.get_object()
        bills = Bill.objects.filter(apartment=apartment)
        serializer = serializers.BillSerializer(bills, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def send_email(self, request, pk=None):
        apartment = self.get_object()
        owner_email = apartment.owner.email
        subject = "Regarding Apartment %d" % apartment.id
        message = (
            "I am interested in the apartment. Please contact me at this email address: %s"
            % request.user.email
        )
        send_mail(
            subject, message, "from@example.com", [owner_email], fail_silently=False
        )
        return Response({"message": "Email sent"})

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == "owner":
            return Apartment.objects.filter(owner=user)
        else:
            return Apartment.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PublicRoomViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.RoomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RoomFilter
    pagination_class = DefaultPagination
    search_fields = ["address", "size"]
    ordering_fields = ["price_per_month"]

    def get_queryset(self):
        return Room.objects.prefetch_related("images").filter(renter=None)


class RoomViewSet(ModelViewSet):
    serializer_class = serializers.RoomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RoomFilter
    pagination_class = DefaultPagination
    search_fields = ["address", "size"]
    ordering_fields = ["price_per_month"]

    def get_permissions(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
            "create_contract",
            "update_contract",
            "delete_contract",
            "sign_contract",
            "contact_owner",
            "room_contracts",
        ]:
            permission_classes = [IsAuthenticated, IsApartmentOwner]
        elif (
            self.action == "sign_contract"
            or self.action == "contact_owner"
            or self.action == "room_contracts"
        ):
            permission_classes = [IsAuthenticated, IsSearcher]
        else:
            permission_classes = [IsAuthenticated, IsApartmentOwner]
        return [permission() for permission in permission_classes]

    @action(
        detail=True,
        url_path="contracts",
        permission_classes=[permissions.IsAuthenticated],
    )
    def room_contracts(self, request, pk=None):
        room = self.get_object()
        contracts = Contract.objects.filter(room=room)
        serializer = serializers.ContractSerializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsApartmentOwner])
    def create_contract(self, request, pk=None):
        room = self.get_object()
        serializer = serializers.ContractSerializer(data=request.data)
        if serializer.is_valid():
            # create a new Contract object
            contract = serializer.save(room=room)

            # redirect the user to the contract detail endpoint
            return redirect(reverse("contract_detail", kwargs={"pk": contract.pk}))
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @create_contract.mapping.put
    def update_contract(self, request, *args, **kwargs):
        contract = get_object_or_404(Contract, pk=kwargs["pk"])
        self.check_object_permissions(request, contract)
        serializer = serializers.ContractSerializer(
            contract, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @create_contract.mapping.delete
    def delete_contract(self, request, *args, **kwargs):
        contract = get_object_or_404(Contract, pk=kwargs["pk"])
        self.check_object_permissions(request, contract)
        contract.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="contact-owner")
    def contact_owner(self, request, pk=None):
        room = self.get_object()
        owner = room.apartment.owner
        subject = f"Inquiry about {room.address}"
        message = f"Hi {owner.first_name},\n\nI am interested in renting your room at {room.address}. Please let me know if it's still available and if I can come by for a visit.\n\nThanks,\n{request.user.first_name}"
        send_mail(subject, message, [owner.email])
        return Response({"message": "Email sent to owner."})

    @action(detail=True, methods=["post"])
    def sign_contract(self, request, pk=None):
        room = self.get_object()
        data = request.data.copy()
        data["room"] = room.pk
        data["tenant"] = request.user.pk
        serializer = serializers.ContractSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.user_type == "owner":
                return Room.objects.filter(apartment__owner=self.request.user)
            elif user.user_type == "searcher":
                return Room.objects.prefetch_related("images").all()
        return Room.objects.prefetch_related("images").filter(is_available=True)


class RoomImageViewSet(ModelViewSet):
    serializer_class = serializers.RoomImageSerializer

    def get_serializer_context(self):
        return {"room_id": self.kwargs["room_pk"]}

    def get_queryset(self):
        return RoomImage.objects.filter(room_id=self.kwargs["room_pk"])


class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = serializers.CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class ContractViewSet(ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = serializers.ContractSerializer
    permission_classes = [IsAuthenticated, IsApartmentOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == "owner":
            apartments = Apartment.objects.filter(owner=user)
            rooms = Room.objects.filter(apartment__in=apartments)
            contracts = Contract.objects.filter(room__in=rooms)
            return contracts
        else:
            return Contract.objects.none()

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.user_type != "owner":
            return Response(
                {"error": "Only owners can create Contracts."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BillViewSet(ModelViewSet):
    serializer_class = serializers.BillSerializer
    permission_classes = [permissions.IsAuthenticated, IsApartmentOwner]

    def get_queryset(self):
        """
        Return bills for the current user's owned apartments.
        """
        user = self.request.user
        owned_apartments = user.apartments_owned.all()
        return Bill.objects.filter(apartment__in=list(owned_apartments))

    def perform_create(self, serializer):
        """
        Set the created_by field to the current user, and set the apartment owner to the current user.
        """
        serializer.save(
            created_by=self.request.user,
            apartment=serializer.validated_data["apartment_id"].owner,
        )


class ReviewViewSet(ModelViewSet):
    serializer_class = serializers.ReviewSerializer

    def get_queryset(self):
        if "room_pk" in self.kwargs:
            return Review.objects.filter(room_id=self.kwargs["room_pk"])
        else:
            return Review.objects.all()

    def get_serializer_context(self):
        if "room_pk" in self.kwargs:
            return {"room_id": self.kwargs["room_pk"]}
        else:
            return {}
