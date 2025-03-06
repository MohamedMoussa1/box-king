from django.db import models
from django.contrib.auth.models import User

class Box(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    box_name = models.CharField(max_length=30, blank=False)
    box_description = models.CharField(max_length=200)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["box_name", "user"], name="unique_box_name_per_user")
        ]
    def __str__(self):
        return f"{self.box_name}"

class Item(models.Model):
    box = models.ForeignKey(Box, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=50, blank=False)
    quantity = models.PositiveIntegerField(default=1)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["item_name", "box"], name="unique_item_name_per_box"),
            models.CheckConstraint(check=~models.Q(item_name=""), name="item_name_cannot_be_empty_string"),
            models.CheckConstraint(check=models.Q(quantity__gt=0), name="quantity_must_be_gt_zero")
        ]
    def __str__(self):
        return f"{self.item_name} (Quantity: {self.quantity})"