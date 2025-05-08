from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("user", views.user, name="user"),
    path("box", views.box, name="box"),
    path('box/<int:box_id>', views.box, name='box_detail'),
    path('box/<int:box_id>/qr-code', views.generate_qr_code_pdf, name='generate_qr_code_pdf'),
    path('box/<int:box_id>/item', views.item, name='item'),
    path('box/<int:box_id>/item/<int:item_id>', views.item, name='item_operation'),
]