import jwt
from functools import wraps
from django.http import JsonResponse
from django.conf import settings

def jwt_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        token = request.COOKIES.get("token")
        if not token:
            return JsonResponse({'error': 'Authentication token is missing'}, status=401)

        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            request.user = payload
        except jwt.ExpiredSignatureError:
            return JsonResponse({'Error': 'Token has expired.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'Error': 'Invalid token.'}, status=401)
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view