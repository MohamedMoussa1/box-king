from django.http import Http404
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from .auth import jwt_required
from .models import Box, Item
from reportlab.pdfgen import canvas
import json, io, qrcode, jwt, datetime

# TODO: Remove csrf exemption
@csrf_exempt
@require_http_methods(['POST'])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        user = authenticate(username=email, password=password)
        if user:
            expiry_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=8)
            payload = {
                'id': user.id,
                'email': user.email,
                'exp': expiry_time
            }
            jwt_token = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')
            response = JsonResponse({'message': 'Login successful'})
            response.set_cookie(
                key='token',
                value=jwt_token,
                httponly=True,
                secure=eval(settings.COOKIE_HTTP_SECURE),
                samesite='Strict',
                max_age=3600 * 8
            )
            return response
        else:
            return JsonResponse({'error_type': 'invalid_credentials', 'message': 'Invalid credentials'}, status=401)
    except Exception as e:
        return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)

# TODO: Remove csrf exemption
@csrf_exempt
@require_http_methods(['POST'])
def logout(request):
    try:
        response = JsonResponse({'message': 'Logout successful'}, status=200)
        response.delete_cookie('token')
        return response
    except Exception as e:
        return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)

# TODO: Remove csrf exemption
@csrf_exempt
@require_http_methods(['POST'])
def user(request):
    try:
        data = json.loads(request.body)
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=email,
            password=password
        )
        return JsonResponse({'user_id': user.id}, status=200)
    except IntegrityError as e:
        return JsonResponse({'error_type': 'integrity_error', 'message': str(e)}, status=400)
    except ValidationError as e:
        return JsonResponse({'error_type': 'validation_error', 'message': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)

# TODO: Remove csrf exemption
@csrf_exempt
@jwt_required
@require_http_methods(['GET', 'POST', 'DELETE', 'PUT'])
def box(request, box_id=None):
    if request.method == 'GET':
        try:
            if box_id:
                box = get_object_or_404(Box, id=box_id, user_id=request.user['id'])
                box_name = box.box_name
                box_description = box.box_description
                item_list = list(box.items.values('id', 'item_name', 'quantity'))
                return JsonResponse({'box_name': box_name, 'box_description': box_description, 'box_items': item_list}, status=200)
            else:
                box_list = list(Box.objects.filter(user_id=request.user['id']).values('id', 'box_name'))
                return JsonResponse({'boxes': box_list}, status=200)
        except Http404 as e:
            return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            box_name = data.get('box_name')
            box_description = data.get('box_description')
            user_id = request.user['id']

            box = Box.objects.create(
                box_name=box_name,
                box_description=box_description,
                user_id=user_id
            )
            return JsonResponse({'box_id': box.id}, status=200)
        except IntegrityError as e:
            return JsonResponse({'error_type': 'integrity_error', 'message': str(e)}, status=400)
        except ValidationError as e:
            return JsonResponse({'error_type': 'validation_error', 'message': str(e)}, status=400)
        except ValueError as e:
            return JsonResponse({'error_type': 'value_error', 'message': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)
    if request.method == 'DELETE':
        try:
            get_object_or_404(Box, id=box_id, user_id=request.user['id']).delete()
            return JsonResponse({'box_id': box_id}, status=200)
        except Http404 as e:
            return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            box_name = data.get('box_name')
            box_description = data.get('box_description')

            updated = Box.objects.filter(id=box_id, user_id=request.user['id']).update(
                box_name=box_name, box_description=box_description
            )
            if updated == 0:
                raise Http404('Box Not Found.')
            return JsonResponse({'box_id': box_id}, status=200)
        except IntegrityError as e:
            return JsonResponse({'error_type': 'integrity_error', 'message': str(e)}, status=400)
        except ValidationError as e:
            return JsonResponse({'error_type': 'validation_error', 'message': str(e)}, status=400)
        except ValueError as e:
            return JsonResponse({'error_type': 'value_error', 'message': str(e)}, status=400)
        except Http404 as e:
            return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)

@jwt_required
@require_http_methods(['GET'])
def generate_qr_code_pdf(request, box_id):
    try:
        box = get_object_or_404(Box, id=box_id, user_id=request.user['id'])
        qr_code = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr_code.add_data(f'{settings.CLIENT_URL}/box/{box_id}')
        qr_code.make(fit=True)
        qr_code_img = qr_code.make_image(fill='black', back_color='white')

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=(500,500))
        p.setFont('Helvetica', 20)
        p.drawString(100, 435, f'Box Name: {box.box_name}')
        p.drawString(100, 415, f'Generated by Box King')
        p.drawInlineImage(qr_code_img, 100, 100, width=300, height=300)
        p.showPage()
        p.save()
        buffer.seek(0)

        pdf_data = buffer.getvalue()
        file_name = f'{box.box_name.replace(" ", "_")}_QR_Code.pdf'
        response = HttpResponse(pdf_data, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{file_name}"'
        return response
    except Http404 as e:
        return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)
    except Exception as e:
        return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)

# TODO: Remove csrf exemption
@csrf_exempt
@jwt_required
@require_http_methods(['POST', 'DELETE', 'PUT'])
def item(request, box_id, item_id=None):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            box = get_object_or_404(Box, id=box_id)
            item_name = data.get('item_name')
            quantity = data.get('quantity')
            
            item = Item.objects.create(
                item_name=item_name,
                quantity=quantity,
                box_id=box_id
            )
            return JsonResponse({'item_id': item.id}, status=200)
        except IntegrityError as e:
            return JsonResponse({'error_type': 'integrity_error', 'message': str(e)}, status=400)
        except ValidationError as e:
            return JsonResponse({'error_type': 'validation_error', 'message': str(e)}, status=400)
        except ValueError as e:
            return JsonResponse({'error_type': 'value_error', 'message': str(e)}, status=400)
        except Http404 as e:
            return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)        
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)
    if request.method == 'DELETE':
        try:
            get_object_or_404(Box, id=box_id, user_id=request.user['id'])
            get_object_or_404(Item, id=item_id, box_id=box_id).delete()
            return JsonResponse({'item_id': item_id}, status=200)
        except Http404 as e:
            return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)    
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            item_name = data.get('item_name')
            quantity = data.get('quantity')
            get_object_or_404(Box, id=box_id, user_id=request.user['id'])
            Item.objects.filter(id=item_id, box_id=box_id).update(item_name=item_name, quantity=quantity)
            return JsonResponse({'item_id': item_id}, status=200)
        except IntegrityError as e:
            return JsonResponse({'error_type': 'integrity_error', 'message': str(e)}, status=400)
        except ValidationError as e:
            return JsonResponse({'error_type': 'validation_error', 'message': str(e)}, status=400)
        except ValueError as e:
            return JsonResponse({'error_type': 'value_error', 'message': str(e)}, status=400)
        except Http404 as e:
            return JsonResponse({'error_type': 'Http_404', 'message': str(e)}, status=404)    
        except Exception as e:
            return JsonResponse({'error_type': 'unexpected_error', 'message': str(e)}, status=500)
