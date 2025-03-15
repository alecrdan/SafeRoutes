from django.db import models
from django.conf import settings

class Route(models.Model):
    """Stores user-defined routes with safety ratings, preferences, and JSON API response"""
    
    route_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="routes"
    )
    route_name = models.CharField(max_length=255, help_text="User-defined name for the route")
    
    start_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    start_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    start_address = models.TextField(blank=True, null=True)

    end_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    end_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    end_address = models.TextField(blank=True, null=True)

    distance_km = models.FloatField(help_text="Total route distance in kilometers")
    duration_min = models.FloatField(help_text="Estimated travel time in minutes")
    
    safety_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], help_text="Safety rating (1-5 scale)")
    traffic_conditions = models.CharField(
        max_length=10,
        choices=[("light", "Light"), ("moderate", "Moderate"), ("heavy", "Heavy")],
        default="moderate"
    )
    terrain_type = models.CharField(
        max_length=15,
        choices=[("flat", "Flat"), ("hilly", "Hilly"), ("mountainous", "Mountainous")],
        default="flat"
    )
    
    accident_risk_score = models.PositiveIntegerField(
        help_text="Risk assessment score based on past accident data (0-100)", default=0
    )

    avoid_highways = models.BooleanField(default=False)
    avoid_toll_roads = models.BooleanField(default=False)
    prefer_bike_paths = models.BooleanField(default=False)
    prefer_scenic_routes = models.BooleanField(default=False)

    route_json = models.JSONField(null=True, blank=True, help_text="Stores raw route data from Mapbox or Google Maps API")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.route_name} (User: {self.user.username})"
