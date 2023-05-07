import mimetypes
import os
from django.conf import settings
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from core.permissions import IsAuthenticated, IsRoomRenter
from rest_framework import permissions
from rest_framework.response import Response
from core.serializers import (
    BillSerializer,
    ContractSerializer,
    ReviewSerializer,
    RoomSerializer,
)
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from core.models import Apartment, Bill, Contract, Room
from core.serializers import ApartmentSerializer
from rest_framework.response import Response
from core.serializers import RoomSerializer
from rest_framework.decorators import action
from rest_framework import permissions, status
from django.core.mail import send_mail

from renter.serializers import RenterApartmentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response


class RenterApartmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RenterApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsRoomRenter]

    def get_apartment(self):
        user = self.request.user
        room = Room.objects.filter(renter=user).first()
        apartment = room.apartment if room else None
        return apartment

    def get_queryset(self):
        return Apartment.objects.none()

    def list(self, request, *args, **kwargs):
        apartment = self.get_apartment()
        if apartment:
            serializer = self.get_serializer(apartment)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class RenterRoomViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsRoomRenter]

    def get_queryset(self):
        return Room.objects.filter(renter=self.request.user)

    def retrieve(self, request, pk=None):
        if not pk:
            queryset = self.get_queryset()
            if not queryset:
                return Response(status=status.HTTP_404_NOT_FOUND)
            pk = queryset.first().pk
        instance = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="write-review")
    def write_review(self, request, pk=None):
        room = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save(room=room, user=request.user)
            return Response(
                ReviewSerializer(review).data, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RenterBillViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated, IsRoomRenter]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    def get_queryset(self):
        user = self.request.user
        try:
            room = user.rooms_rented
            apartment = room.apartment
            return Bill.objects.filter(apartment=apartment)
        except Room.DoesNotExist:
            return Bill.objects.none()

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        bill = self.get_object()
        if not bill.is_paid:
            bill.is_paid = True
            bill.save()
            return Response({"status": "success"})
        return Response(
            {"status": "error", "message": "This bill has already been paid."}
        )

    @action(
        detail=False, methods=["get"], url_path=r"my-bills/(?P<bill_id>\d+)/download"
    )
    def download(self, request, bill_id=None):
        bill = get_object_or_404(Bill, id=bill_id)
        file_path = os.path.join(settings.MEDIA_ROOT, str(bill.file))
        if os.path.exists(file_path):
            content_type, encoding = mimetypes.guess_type(file_path)
            content_type = content_type or "application/octet-stream"
            with open(file_path, "rb") as fh:
                response = HttpResponse(fh.read(), content_type=content_type)
                response[
                    "Content-Disposition"
                ] = f"attachment; filename={os.path.basename(file_path)}"
                if encoding:
                    response["Content-Encoding"] = encoding
                return response
        return Response(
            {"message": "File not found."}, status=status.HTTP_404_NOT_FOUND
        )


class RenterContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated, IsRoomRenter]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == "renter":
            room_id = self.kwargs["room_id"]
            contract_id = self.kwargs["pk"]
            try:
                contract = Contract.objects.select_related("room__apartment").get(
                    id=contract_id, room_id=room_id, room__renter=user
                )
            except Contract.DoesNotExist:
                raise Http404
            return Contract.objects.filter(id=contract.id)
        else:
            return Contract.objects.none()
