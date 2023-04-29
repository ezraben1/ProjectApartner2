from core import serializers
from core.models import Apartment, Bill, Contract, Room
from core.permissions import IsApartmentOwner
from rest_framework import permissions
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
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == "owner":
            return Room.objects.filter(apartment__owner=self.request.user)
        else:
            return Room.objects.none()
