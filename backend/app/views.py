# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .serializers import FileUploadSerializer, AskQuerySerializer
from rest_framework import status
import time
import pickle
from utils.utils import gen_pkl, get_response


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):

        global vectorstore

        serializer = FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            file = serializer.validated_data['file']        
            pdf_path = f"uploads/{file.name}"

            # saving pdf file
            open(pdf_path, "wb").write(file.read())

            # generating pickle from pdf file
            vectorstore = gen_pkl(pdf_path)

            return Response({'message': 'File uploaded successfully.'})
        else:
            return Response(serializer.errors, status=400)


class AskQueryView(APIView):
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            serializer = AskQuerySerializer(data=request.data)

            if serializer.is_valid():
                query = serializer.validated_data['query']        

                # get query response
                response = get_response(query, vectorstore)

                return Response({'response': response})
            
        except Exception as e:
            if e.args[0] == "name 'vectorstore' is not defined":
                error = "Upload a PDF file before asking a question."
            else:
                error = e.args[0]
            return Response({"error": error}, status=500)
        else:
            return Response(serializer.errors, status=400)