from django.contrib import admin

# Register your models here.
from django import forms
from push_notifications.models import GCMDevice

from blog.models import Post, Tag, Profile


class PostForm(forms.ModelForm):
    body = forms.CharField(widget=forms.Textarea)
    # publishing_date = forms.CharField(widget = forms.(attrs={'readonly':'readonly'}))
    # author = forms.ChoiceField(widget = forms.TextInput(attrs={'disabled':'true'}))

    class Meta:
        model=Post
        fields = ('title', 'body', 'tags')




class PostAdmin(admin.ModelAdmin):
    # list_display = ('title', 'body', 'author_username')
    #
    # def author_username(self, obj):
    #     return obj.author.username

    def get_queryset(self, request):
        qs = super(PostAdmin, self).get_queryset(request)
        if(request.user.is_superuser):
            return qs
        else:
            return qs.filter(author=request.user)

    def save_model(self, request, obj, form, change):
        obj.author = request.user
        obj.save()
    # fields = ('title','author', 'body', 'publishiing_date')

    form = PostForm
    filter_horizontal = ('tags',)

admin.site.register(Post, PostAdmin)
admin.site.register(Tag)
admin.site.register(Profile)