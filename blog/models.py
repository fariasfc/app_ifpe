from django.contrib.auth.models import User
from django.db import models

# Create your models here.
from django.db.models.fields.related import ManyToManyField
from taggit.managers import TaggableManager
from taggit.models import Tag

# class AllowedTags(models.Model):
#     name = models.CharField(max_length=255)

class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    # post =


class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.CharField(max_length=20000)
    author = models.ForeignKey(User)
    publishing_date = models.DateTimeField(auto_now_add=True)
    tags = ManyToManyField(Tag)
    slug = models.SlugField()

    def __str__(self):
        return self.title

class Profile(models.Model):
    user = models.ForeignKey(User)
    tags = ManyToManyField(Tag)

    def __str__(self):
        return self.user.username + " tags: " + str([str(tag) for tag in self.tags])