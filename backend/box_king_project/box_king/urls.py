from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user", views.user, name="user"),
    path("box", views.box, name="box"),
    path('box/<int:box_id>', views.box, name='box_detail'),
    path('box/<int:box_id>/qr-code', views.generate_qr_code_pdf, name='generate_qr_code_pdf'),
    path('box/<int:box_id>/add-item', views.add_item, name='add_item'),
]