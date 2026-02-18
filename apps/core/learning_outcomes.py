import re

from django.utils.html import strip_tags


BLOCK_BREAK_PATTERN = re.compile(
    r"</(li|p|div|h[1-6]|tr|td|th|blockquote)>|<br\s*/?>",
    flags=re.IGNORECASE,
)


def extract_learning_outcome_items_from_html(raw_html: str) -> list[str]:
    """Derive plain-text items from rich-text learning outcomes HTML."""
    html = str(raw_html or "").strip()
    if not html:
        return []

    text_content = strip_tags(BLOCK_BREAK_PATTERN.sub("\n", html))
    return [line.strip() for line in text_content.splitlines() if line.strip()]
