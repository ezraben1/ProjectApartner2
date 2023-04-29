from rest_framework import serializers
from core.models import Apartment
from core.serializers import ApartmentSerializer, RoomSerializer


class SearcherApartmentSerializer(ApartmentSerializer):
    rooms = serializers.SerializerMethodField()
    
    def get_rooms(self, obj):
        rooms_queryset = obj.rooms.filter(renter__isnull=True)
        return RoomSerializer(rooms_queryset, many=True).data
    
    class Meta:
        model = Apartment
        fields = ['id', 'address', 'description', 'size', 'rooms']

