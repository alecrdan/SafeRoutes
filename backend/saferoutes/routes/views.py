from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Route
from .serializers import RouteSerializer

class RouteViewSet(viewsets.ModelViewSet):
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.routes.all()  # Show only user-specific routes

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatically associate the user

    def destroy(self, request, *args, **kwargs):
        """Prevent deletion if the route has high safety ratings"""
        route = self.get_object()
        if route.safety_score and route.safety_score > 4.5:
            return Response({"error": "Cannot delete a highly-rated route."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)