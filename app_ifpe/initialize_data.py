import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app_ifpe.settings")
import django
django.setup()

from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User, Group, Permission
from blog.models import Tag, Post


def main():
    User.objects.create_superuser(username='admin', email='', password='qwer1234')

    tags_name = [
        'geral',
        'informatica-basica',
        'redes-de-computadores',
        'matematica-financeira'
    ]

    [Tag.objects.create(name=tag_name) for tag_name in tags_name]


    new_group, created = Group.objects.get_or_create(name='professores')
    ct = ContentType.objects.get_for_model(Post)

    # Now what - Say I want to add 'Can add project' permission to new_group?
    permission_add = Permission.objects.create(codename='can_add_post',
                                           name='Can add post',
                                           content_type=ct)

    permission_change = Permission.objects.create(codename='can_change_post',
                                               name='Can change post',
                                               content_type=ct)

    permission_delete = Permission.objects.create(codename='can_delete_post',
                                               name='Can delete post',
                                               content_type=ct)
    new_group.permissions.add(permission_add)
    new_group.permissions.add(permission_change)
    new_group.permissions.add(permission_delete)



if __name__ == "__main__":
    main()
