from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

@login_required(login_url='/api-auth/login/')
def home(request):
    return HttpResponse('Welcome! You are logged in.')
