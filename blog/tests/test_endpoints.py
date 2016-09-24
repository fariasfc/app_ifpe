import json

from django.test.client import Client
from django.test.testcases import TestCase

from blog.models import Post

class EndpointsTestCase(TestCase):
    def test_get_posts_by_tags(self):
        client = Client()
        response = client.post('/blog/get_posts_by_tags/', json.dumps({"tags": ["redes-de-computadores", "informatica-basica"]}),content_type="application/json").content
        print(response)

EndpointsTestCase().test_get_posts_by_tags()