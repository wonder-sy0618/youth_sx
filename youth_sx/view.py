from django.http import HttpResponse

def index(request):
    return HttpResponse("youth_sx server is running")
