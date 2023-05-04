from django.urls import path
from rest_framework_nested import routers
from core.views import (
    ApartmentInquiryViewSet,
    ContractViewSet,
    CustomUserViewSet,
    ReviewViewSet,
    RoomImageViewSet,
    RoomViewSet,
)
from searcher.views import SearcherApartmentViewSet

app_name = "searcher"


router = routers.DefaultRouter()
router.register("searcher-search", SearcherApartmentViewSet, basename="search")
router.register("me", CustomUserViewSet, basename="me")

rooms_router = routers.NestedSimpleRouter(router, "searcher-search", lookup="pk")
rooms_router.register("reviews", ReviewViewSet, basename="room-reviews")
rooms_router.register("images", RoomImageViewSet, basename="room-images")


urlpatterns = [
    path(
        "searcher-search/<int:pk>/inquiries/",
        ApartmentInquiryViewSet.as_view({"get": "list", "post": "create"}),
        name="renter-inquiries",
    ),
    path(
        "searcher-search/<int:apartment_id>/room/<int:pk>/",
        RoomViewSet.as_view({"get": "retrieve"}),
        name="room-detail",
    ),
    path(
        "searcher-search/<int:apartment_id>/room/<int:pk>/contact-owner/",
        RoomViewSet.as_view({"post": "contact_owner"}),
        name="room-contact-owner",
    ),
    path(
        "searcher-search/<int:apartment_id>/room/<int:pk>/contracts/",
        RoomViewSet.as_view({"get": "contracts"}),
        name="room-contracts",
    ),
    path(
        "searcher-search/<int:apartment_id>/room/<int:pk>/sign-contract/",
        RoomViewSet.as_view({"post": "sign_contract"}),
        name="room-sign-contract",
    ),
    path(
        "searcher-search/<int:apartment_id>/room/<int:room_id>/contract/<int:pk>/",
        ContractViewSet.as_view({"get": "retrieve"}),
        name="contract-detail",
    ),
] + router.urls
