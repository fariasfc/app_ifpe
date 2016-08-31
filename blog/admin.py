from django.contrib import admin

# Register your models here.
from django import forms
from blog.models import Post, Tag


class PostForm(forms.ModelForm):
    body = forms.CharField(widget=forms.Textarea)
    # publishing_date = forms.CharField(widget = forms.(attrs={'readonly':'readonly'}))
    author = forms.ChoiceField(widget = forms.TextInput(attrs={'disabled':'true'}))

    class Meta:
        model=Post
        fields = ('title', 'body', 'tags', 'author')




class PostAdmin(admin.ModelAdmin):
    # list_display = ('title', 'body', 'author_username')
    #
    # def author_username(self, obj):
    #     return obj.author.username

    def save_model(self, request, obj, form, change):
        obj.author = request.user
        obj.save()
    # fields = ('title','author', 'body', 'publishiing_date')

    form = PostForm
    filter_horizontal = ('tags',)

admin.site.register(Post, PostAdmin)
admin.site.register(Tag)