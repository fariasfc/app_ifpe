from rest_framework import serializers

from blog.models import Post


class PostSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True)
    author = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Post
        fields = ('title', 'body', 'publishing_date', 'author', 'tags')