from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import permissions
from core.views import ApartmentViewSet
from django.core.mail import send_mail
from searcher.serializers import SearcherApartmentSerializer


class SearcherApartmentViewSet(ApartmentViewSet):
    allowed_methods = ["GET"]
    serializer_class = SearcherApartmentSerializer

    @action(
        detail=True, methods=["post"], permission_classes=permissions.IsAuthenticated
    )
    def send_email(self, request, pk=None):
        room = self.get_object()
        owner_email = room.apartment.owner.email
        subject = "Regarding Room %d" % room.id
        message = (
            "I am interested in the room. Please contact me at this email address: %s"
            % request.user.email
        )
        send_mail(
            subject, message, "from@example.com", [owner_email], fail_silently=False
        )
        return Response({"message": "Email sent"})
