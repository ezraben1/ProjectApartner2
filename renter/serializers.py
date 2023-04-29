from rest_framework import serializers

from core.models import Apartment


class RenterApartmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Apartment
        fields = ['id', 'owner', 'address', 'description', 'size']
