from django.shortcuts import get_object_or_404
from core import serializers
from core.models import Apartment, Bill, Contract, Room
from core.permissions import IsApartmentOwner
from rest_framework import permissions, status
from core.views import ApartmentViewSet, RoomViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


class OwnerApartmentViewSet(ApartmentViewSet):
    serializer_class = serializers.ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsApartmentOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == "owner":
            return Apartment.objects.filter(owner=user)
        else:
            return Apartment.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

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


class OwnerRoomViewSet(RoomViewSet):
    lookup_field = "apartment_id"

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == "owner":
            return Room.objects.filter(apartment__owner=self.request.user)
        else:
            return Room.objects.none()

    def create(self, request, *args, **kwargs):
        apartment_id = self.kwargs.get("apartment_id")
        mutable_data = request.data.copy()
        mutable_data["apartment_id"] = apartment_id
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
