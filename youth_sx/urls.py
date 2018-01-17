"""youth_sx URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from . import view
from api.views import list as apiList
from api.views import upload as apiUpload
from api.views import upload_token as apiUploadToken
from api.views import delete as apiDelete

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'api/list', apiList),
    url(r'api/upload_token', apiUploadToken),
    url(r'api/upload', apiUpload),
    url(r'api/delete', apiDelete),
    url(r'^$', view.index),
]
