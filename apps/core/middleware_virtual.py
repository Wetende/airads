from django.conf import settings


class VirtualCampusHostMiddleware:
    """Attach virtual-campus context to requests based on the request host."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(":")[0].lower()
        virtual_hosts = {
            configured_host.lower()
            for configured_host in getattr(settings, "VIRTUAL_CAMPUS_HOSTS", [])
        }
        is_virtual = host in virtual_hosts
        request.is_virtual_campus = is_virtual
        request.site_entry = "virtual" if is_virtual else "main"
        request.default_study_mode = "virtual" if is_virtual else "on_campus"
        return self.get_response(request)
