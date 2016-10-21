from django.contrib.auth.models import User
from django.db import models, transaction

# Create your models here.
from django.db.models.fields.related import ManyToManyField
from django.db.models.signals import post_save, m2m_changed
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

    class Meta:
        ordering=['-publishing_date']

    def __str__(self):
        return "{} - {}".format(self.title, self.tags)


@receiver(m2m_changed, sender=Post.tags.through)
def send_notifications(sender, instance, action, pk_set, **kwargs):
    if action == 'post_add':
        #pk_set has all thhe PKs of the tags added to the Post
        gcm_devices = GCMDevice.objects.filter(user__profile__tags__id__in=pk_set).distinct()
        gcm_devices.send_message(message=instance.body,extra={'title':instance.title, 'author': instance.author.username})
        print("Sent Notification!")
        # GCMDevice.objects.filter(user__profile__tags__in=[Tag.objects.all()[0]])
#         GCMDevice.objects.filter() instance.tags
#         GCMDevice.objects.all().send_message(message="Corpo da mensagem gigante lalala vai aparecer onde testando?",
#                                              extra={'title': 'título'})


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