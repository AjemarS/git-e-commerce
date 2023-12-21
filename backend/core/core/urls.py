from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.api.urls")),
]

from django.conf.urls.static import static
from core.settings import MEDIA_URL, MEDIA_ROOT

urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
