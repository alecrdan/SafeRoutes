from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RouteViewSet

# Create a router for the RouteViewSet
router = DefaultRouter()
router.register(r'routes', RouteViewSet, basename='route')

urlpatterns = [
    path('', include(router.urls)),  # Includes all routes from the router
]
