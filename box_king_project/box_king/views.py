from django.http import Http404
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import Box, Item
from reportlab.pdfgen import canvas
import json, io, qrcode


def index(request):
    if request.method == 'GET':
        return HttpResponse(f'Boxes available: {Box.objects.all()}')
    else:
        return HttpResponse('Invalid request method.')

# TODO: Remove csrf exemption
@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        # TODO: Exception handling when user already exists
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=email,
            password=password
        )
        
        return HttpResponse(f'User {user.first_name} created successfully!')
    else:
        return HttpResponse('Invalid request method.')

# TODO: Remove csrf exemption
@csrf_exempt
def create_box(request):
    if request.method == 'POST':
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

    response = HttpResponse(pdf_data, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{box.box_name} QR Code.pdf"'

    return response

# TODO: Remove csrf exemption
@csrf_exempt
def create_item(request, box_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        box = get_object_or_404(Box, id=box_id)
        item_name = data.get('item_name')
        quantity = data.get('quantity')
        
        item = Item.objects.create(
            item_name=item_name,
            quantity=quantity,
            box_id=box_id
        )
        return HttpResponse(f'Item {item_name} was added to {box.box_name} successfully!')
    else:
        return HttpResponse('Invalid request method.')

def view_items(request, box_id):
    if request.method == 'GET':
        box = get_object_or_404(Box, id=box_id)
        return HttpResponse(f'You are viewing {box.box_name} items {box.items.all()}')
    else:
        return HttpResponse('Invalid request method.')
