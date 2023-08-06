from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView

# Create your views here.
from rest_framework.parsers import JSONParser

class MyView(APIView):
    parser_classes = (JSONParser,)

    def post(self, request, *args, **kwargs):
        print(request.data)
        return Response({"success": True})