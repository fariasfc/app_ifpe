from django.apps import AppConfig
from django.contrib.auth.models import User

from blog.models import Tag


class BlogConfig(AppConfig):
    name = 'blog'



