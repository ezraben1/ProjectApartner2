from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import permissions
from core import serializers
from core.filters import RoomFilter
from core.models import Contract, Room
from rest_framework import viewsets, permissions
from django.db.models import Q
from core.pagination import DefaultPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework import status

from searcher.serializers import SearcherRoomSerializer


from django.db.models import Q


class SearcherRoomViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SearcherRoomSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RoomFilter
    pagination_class = DefaultPagination
    search_fields = [
        "apartment__city",
        "apartment__street",
        "apartment__building_number",
        "apartment__apartment_number",
        "apartment__floor",
    ]

    ordering_fields = ["price_per_month"]

    def get_queryset(self):
        query = self.request.query_params.get("search")
        if query:
            queryset = Room.objects.filter(
                Q(apartment__city__icontains=query)
                | Q(apartment__street__icontains=query)
                | Q(apartment__building_number__icontains=query)
                | Q(apartment__apartment_number__icontains=query)
                | Q(apartment__floor__icontains=query)
                | Q(size__icontains=query),
                renter=None,
            )
        else:
            queryset = Room.objects.filter(renter=None)
        return queryset

    @action(
        detail=True,
        url_path="contracts",
        permission_classes=[permissions.IsAuthenticated],
    )
    def room_contracts(self, request, pk=None):
        room = self.get_object()
        contract = Contract.objects.filter(room=room).first()
        serializer = serializers.ContractSerializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)
