from push_notifications.api.rest_framework import GCMDeviceSerializer
from rest_framework import serializers

from blog.models import Post, Profile, Tag


class PostSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True)
    author = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Post
        fields = ('title', 'body', 'publishing_date', 'author', 'tags')

class ProfileSerializer(serializers.ModelSerializer):
    # user = serializers.ReadOnlyField(source='user.username')
    device = GCMDeviceSerializer(read_only=True)
    # device_id = serializers.ReadOnlyField(source='device.device_id')
    # registration_id = serializers.ReadOnlyField(source='device.registration_id')


    class Meta:
        model = Profile
        fields = ('tags', 'device')
        # fields = ('tags', 'device', 'device_id', 'registration_id')


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id','name',)