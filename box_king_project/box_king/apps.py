from django.apps import AppConfig


class BoxKingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'box_king'

    def ready(self):
        import box_king.signals
