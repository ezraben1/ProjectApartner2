from rest_framework.decorators import action
from rest_framework import permissions
from core.filters import RoomFilter
from core.models import Room
from rest_framework import viewsets, permissions
from django.db.models import Q
from core.pagination import DefaultPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from searcher.serializers import SearcherRoomSerializer


from django.db.models import Q


class SearcherRoomViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SearcherRoomSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RoomFilter
    pagination_class = DefaultPagination
    search_fields = [
        "apartment__address",
        "size",
    ]  # Update search_fields to include apartment__address
    ordering_fields = ["price_per_month"]

    def get_queryset(self):
        query = self.request.query_params.get("search")
        if query:
            queryset = Room.objects.filter(
                Q(apartment__address__icontains=query)
                | Q(
                    size__icontains=query
                ),  # Update the filter query to include apartment__address
                renter=None,
            )
        else:
            queryset = Room.objects.filter(renter=None)
        return queryset
