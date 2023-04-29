from django_filters.rest_framework import FilterSet
from .models import Room

class RoomFilter(FilterSet):
  class Meta:
    model = Room
    fields = {
      'apartment_id': ['exact'],
      'price_per_month': ['gt', 'lt']
    }