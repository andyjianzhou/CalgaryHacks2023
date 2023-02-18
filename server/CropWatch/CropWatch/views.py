from django.http import HttpResponse
import json
import joblib

def index(request):
    # add the ML model here
    return HttpResponse("Hello, world. You're at the polls index.")