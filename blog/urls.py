from django.conf.urls import url
from blog import views

urlpatterns = [
    url(r'^blog/get_posts_by_tags$', views.get_posts_by_tags),
    url(r'^blog/$', views.post_list),
    url(r'^blog/(?P<tags>[\w\+-]+)$', views.posts_by_tags)

    # url(r'^snippets/(?P<pk>[0-9]+)/$', views.snippet_detail),
]