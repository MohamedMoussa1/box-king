from django.db import models
from django.contrib.auth.models import User

class Box(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    box_name = models.CharField(max_length=30, blank=False)
    box_description = models.CharField(max_length=200)

class QR_Code(models.Model):
    box = models.OneToOneField(Box, on_delete=models.CASCADE, related_name='qr_code')
    pdf_file = models.FileField(upload_to='qr_codes')

class Item(models.Model):
    box = models.ForeignKey(Box, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(default=1)