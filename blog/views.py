from django.contrib.auth.decorators import permission_required
from rest_auth import views
from django.http.response import HttpResponseServerError
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets, filters, permissions
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from blog.models import Post, Profile, Tag
from blog.serializers import PostSerializer, ProfileSerializer, TagsSerializer
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

# @csrf_exempt
# def get_posts_by_tags(request):
#     print("entrou")
#     print(request)
#     if request.method == "POST":
#         json_data = json.loads(request.body.decode('utf-8'))
#
#         try:
#             tags = json_data['tags']
#             posts = Post.objects.filter(tags__name__in=tags).distinct()
#             posts = serializers.serialize('json', posts)
#             return HttpResponse(posts, content_type="application/json")
#
#         except KeyError:
#             HttpResponseServerError("Malformed data!")
#         HttpResponse("Got json data!")
@api_view(['POST'])
@csrf_exempt
def get_posts_by_tags(request):
    print("entrou")
    print(request)
    if request.method == "POST":
        json_data = json.loads(request.body.decode('utf-8'))

        try:
            tags = json_data['tags']
            posts = Post.objects.filter(tags__name__in=tags).distinct()
            posts = serializers.serialize('json', posts)
            # return HttpResponse(posts, content_type="application/json")
            return Response(posts, content_type="application/json", status=status.HTTP_200_OK)
        except:
            Response("Malformed data!")
        return Response("Erro!")

class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    lookup_field = 'user__username'

    def get_queryset(self):
        # return super(ProfileViewSet, self).get_queryset()
        queryset = Profile.objects.filter(user__exact=self.request.user)
        return queryset

    # def partial_update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #
    #
    #     serializer = ProfileSerializer(instance, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()

        # print("foi!")


# @permission_required(views.IsAuthenticated)
class PostViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Este ViewSet automaticamente prove 'list' e 'detail'
    '''
    permission_classes = (IsAuthenticated,)

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = (filters.DjangoFilterBackend,)

    #http://127.0.0.1:8888/post/?tags=informatica-basica&tags=redes-de-computadores
    def get_queryset(self):
        tags = self.request.query_params.getlist('tags')
        posts = Post.objects.filter(tags__name__in=tags).distinct()
        return posts

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    # permission_classes = (IsAuthenticated,)

    queryset = Tag.objects.all()
    serializer_class = TagsSerializer
    filter_backends = (filters.DjangoFilterBackend,)



    def get_queryset(self):
        tags = Tag.objects.all()
        return tags