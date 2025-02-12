from django.http import Http404
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from .auth import jwt_required
from .models import Box, Item
from reportlab.pdfgen import canvas
import json, io, qrcode, jwt, datetime


def index(request):
    if request.method == 'GET':
        return HttpResponse(f'You are on Box King Landing Page')
    else:
        return HttpResponse('Invalid request method.')

# TODO: Remove csrf exemption
@csrf_exempt
def login(request):
    if request.method != 'POST':
        return HttpResponse('Invalid request method.', status=405)
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
        return JsonResponse({'Error': "Invalid credentials"}, status=400)

# TODO: Remove csrf exemption
@csrf_exempt
def logout(request):
    if request.method != 'POST':
        return HttpResponse('Invalid request method.', status=405)
    response = JsonResponse({'message': 'Logout successful'})
    response.delete_cookie('token')

    return response

# TODO: Remove csrf exemption
@csrf_exempt
def user(request):
    if request.method == 'POST':
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
            
            return HttpResponse(f'User {user.first_name} created successfully!')
        except IntegrityError:
            return HttpResponse(f'A user with this email already exists. Would you like to login?', status=400)
        except ValidationError as e:
            return HttpResponse(f'Invalid input: {e.message}', status=400)
    else:
        return HttpResponse('Invalid request method.')

# TODO: Remove csrf exemption
@csrf_exempt
@jwt_required
def box(request, box_id=None):
    if request.method == 'GET':
        if box_id:
            box = get_object_or_404(Box, id=box_id)
            return HttpResponse(f'You are viewing {box.box_name} items {box.items.all()}')
        else:
            box_list = list(Box.objects.filter(user_id=request.user['id']).values('id', 'box_name'))
            return JsonResponse({'boxes': box_list}, status=200)
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            box_name = data.get('box_name')
            box_description = data.get('box_description')
            user_id = data.get('user_id')

            box = Box.objects.create(
                box_name=box_name,
                box_description=box_description,
                user_id=user_id
            )
            return HttpResponse(f'Box {box.box_name} created successfully!')
        except ValidationError as e:
            return HttpResponse(f'Invalid input: {e.message}', status=400)
    else:
        return HttpResponse('Invalid request method.')


def generate_qr_code_pdf(request, box_id):
    box = get_object_or_404(Box, id=box_id)
    qr_code = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr_code.add_data(f'http://127.0.0.1:8000/box-king/box/{box_id}')
    qr_code.make(fit=True)
    qr_code_img = qr_code.make_image(fill='black', back_color='white')

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 750, f'Box Name: {box.box_name}')
    p.drawString(100, 735, f'Generated by Box King')
    p.drawInlineImage(qr_code_img, 100, 500, width=200, height=200)
    p.showPage()
    p.save()

    buffer.seek(0)
    pdf_data = buffer.getvalue()
    file_name = f'{box.box_name.replace(' ', '_')}_QR_Code.pdf'
    response = HttpResponse(pdf_data, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{file_name} QR Code.pdf"'

    return response


# TODO: Remove csrf exemption
@csrf_exempt
def add_item(request, box_id):
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
            return HttpResponse(f'Item {item.item_name} was added to {box.box_name} successfully!')
        except ValidationError as e:
            return HttpResponse(f'Invalid input: {e.message}', status=400)
    else:
        return HttpResponse('Invalid request method.')
