from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create-user", views.create_user, name="create_user"),
    path("create-box", views.create_box, name="create_box"),
    path('box/<int:box_id>/qr-code', views.generate_qr_code_pdf, name='generate_qr_code_pdf'),
    path('box/<int:box_id>/create-item', views.create_item, name='create_item'),
    path('box/<int:box_id>', views.view_items, name='view_items')
]