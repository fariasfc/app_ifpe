from django.contrib.auth.models import User
from django.db import models, transaction

# Create your models here.
from django.db.models.fields.related import ManyToManyField
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from push_notifications.models import GCMDevice

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


def default_tags_ids():
    return [t.pk for t in Tag.objects.all()]

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tags = ManyToManyField(Tag, default=default_tags_ids)
    device = models.ForeignKey(GCMDevice, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        tags = self.tags.select_related()
        return self.user.username \
               + " - tags: " + str([str(tag) for tag in tags])

@receiver(post_save, sender=GCMDevice)
def attatch_gcm_device(sender, instance, created, **kwargs):
    if created:
        p = Profile.objects.get(user__exact=instance.user)
        p.device = instance
        p.save()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        p = Profile.objects.create(user=instance)
        p.tags = [t.pk for t in Tag.objects.all()]


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()