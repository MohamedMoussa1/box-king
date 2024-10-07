from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create-user", views.create_user, name="create_user"),
    path("create-box", views.create_box, name="create_box"),
    path('box/<int:box_id>/qr-code', views.view_qr_code, name='view_qr_code')
]