from django.http import Http404
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Box, QR_Code
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import FileResponse


def index(request):
    return HttpResponse(f'Boxes available: {Box.objects.all()}')

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

def view_qr_code(request, box_id):
    qr_code = QR_Code.objects.get(box__id=box_id)
    return FileResponse(qr_code.pdf_file, content_type='application/pdf')