import jwt
from functools import wraps
from django.http import JsonResponse
from django.conf import settings

def jwt_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({'Error': "Authorization header missing or invalid"}, status=400)
        
        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            print(payload)
            request.user = payload
        except jwt.ExpiredSignatureError:
            return JsonResponse({'Error': 'Token has expired.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'Error': 'Invalid token.'}, status=401)
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view