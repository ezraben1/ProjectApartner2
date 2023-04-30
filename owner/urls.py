from django.urls import path
from rest_framework_nested import routers
from . import views
from core.views import ApartmentViewSet, ContractViewSet, BillViewSet, RoomViewSet

app_name = "owner"

router = routers.DefaultRouter()
router.register("owner-apartments", views.OwnerApartmentViewSet, basename="apartments")
router.register("owner-rooms", views.OwnerRoomViewSet, basename="rooms")
router.register("owner-contarcts", ContractViewSet, basename="contracts")
router.register("owner-bills", BillViewSet, basename="bills")


urlpatterns = [
    path(
        "apartments/<int:pk>/upload_image/",
        views.ApartmentViewSet.as_view({"patch": "upload_image"}),
        name="apartment-upload-image",
    ),
    path(
        "owner-apartments/<int:apartment_id>/rooms/",
        views.OwnerRoomViewSet.as_view(
            {
                "get": "list",
                "put": "update",
                "delete": "destroy",
                "post": "create",
                "patch": "partial_update",
            }
        ),
        name="rooms",
    ),
    path(
        "owner-apartments/<int:apartment_id>/rooms/",
        views.OwnerRoomViewSet.as_view(
            {
                "get": "list",
                "put": "update",
                "delete": "destroy",
                "post": "create",
                "patch": "partial_update",
            }
        ),
        name="owner-room-detail",
    ),
    path(
        "owner-apartments/<int:apartment_id>/room/<int:pk>/",
        RoomViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "delete": "destroy",
                "post": "create_contract",
                "patch": "partial_update",
            }
        ),
        name="room-detail",
    ),
    path(
        "owner-apartments/<int:apartment_id>/contracts/<int:pk>/",
        ContractViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
                "post": "create",
            }
        ),
        name="contract_detail",
    ),
    path(
        "owner-apartments/<int:apartment_id>/room/<int:room_id>/contracts/",
        ContractViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
        name="contracts",
    ),
    path(
        "owner-apartments/<int:apartment_id>/room/<int:room_id>/contracts/<int:pk>/",
        ContractViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
                "post": "create",
            }
        ),
        name="contract_detail",
    ),
    path(
        "owner-apartments/<int:apartment_id>/bills/<int:pk>/",
        BillViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
                "post": "create",
            }
        ),
        name="bill_detail",
    ),
    path(
        "owner-rooms/<int:room_id>/contracts/<int:pk>/",
        ContractViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
                "post": "create",
            }
        ),
        name="contract_detail",
    ),
    path(
        "owner-rooms/<int:pk>/create_contract/",
        ContractViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
                "post": "create",
            }
        ),
        name="create_contract",
    ),
] + router.urls
