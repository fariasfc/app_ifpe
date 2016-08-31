from django.http.response import HttpResponseServerError
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from blog.models import Post
from blog.serializers import PostSerializer
import json
from django.core import serializers

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@csrf_exempt
def post_list(request):
    if request.method == "GET":
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)

        return JSONResponse(serializer.data)
    elif request.method == "POST":
        data = JSONParser.parse(request)
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)

def posts_by_tags(request, tags):
    # Filtrando todos os posts que contem as 'tags' enviadas pelo parametro;
    # distinct() para retirar os posts que contem mais de 1 tag buscada
    posts = Post.objects.filter(tags__name__in=tags.split('+')).distinct()
    serializer = PostSerializer(posts, many=True)

    return JSONResponse(serializer.data)


#Exemlpo de envio de requisição:
#curl -i -X POST -H 'Content-Type: application/json' -d '{"tags": ["noticias", "informatica-basica"]}' http://127.0.0.1:8000/blog/get_posts_by_tags

#@csrf_exempt
def get_posts_by_tags(request):
    if request.method == "POST":
        json_data = json.loads(request.body.decode('utf-8'))

        try:
            tags = json_data['tags']
            posts = Post.objects.filter(tags__name__in=tags).distinct()
            posts = serializers.serialize('json', posts)
            return HttpResponse(posts, content_type="application/json")

        except KeyError:
            HttpResponseServerError("Malformed data!")
        HttpResponse("Got json data!")