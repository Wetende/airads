import logging
import time

from django.conf import settings
from django.db import connection

logger = logging.getLogger("apps.core.performance")


class SlowRequestLoggingMiddleware:
    """
    Emit structured logs for slow requests when performance logging is enabled.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.enabled = getattr(settings, "ENABLE_PERF_LOGGING", False)
        self.slow_request_ms = getattr(settings, "SLOW_REQUEST_MS", 400)

    def __call__(self, request):
        previous_force_debug_cursor = connection.force_debug_cursor
        if self.enabled:
            connection.force_debug_cursor = True
            start_query_count = len(connection.queries)
            start = time.perf_counter()
        else:
            start = None
            start_query_count = 0

        try:
            response = self.get_response(request)
        finally:
            connection.force_debug_cursor = previous_force_debug_cursor

        if not self.enabled or start is None:
            return response

        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        total_queries = len(connection.queries) - start_query_count

        if duration_ms >= self.slow_request_ms:
            logger.warning(
                "slow_request path=%s method=%s status=%s duration_ms=%s query_count=%s",
                request.path,
                request.method,
                getattr(response, "status_code", "unknown"),
                duration_ms,
                total_queries,
            )

        return response
