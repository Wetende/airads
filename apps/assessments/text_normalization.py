from html import unescape

from django.utils.html import strip_tags


def normalize_assessment_text(value) -> str:
    decoded = unescape(str(value or "")).replace("\xa0", " ")
    return " ".join(strip_tags(decoded).split())


def normalize_assessment_text_list(values) -> list[str]:
    if not isinstance(values, list):
        return []

    normalized = []
    for value in values:
        cleaned = normalize_assessment_text(value)
        if cleaned:
            normalized.append(cleaned)
    return normalized


def normalize_assessment_text_mapping(values) -> dict[str, str]:
    if not isinstance(values, dict):
        return {}

    normalized = {}
    for key, value in values.items():
        cleaned = normalize_assessment_text(value)
        if cleaned:
            normalized[str(key)] = cleaned
    return normalized


def normalize_question_answer_data(question_type: str, answer_data):
    if not isinstance(answer_data, dict):
        return {}

    normalized = dict(answer_data)
    normalized_type = str(question_type or "").strip().lower()

    if normalized_type in {"mcq", "mcq_multi"}:
        normalized["options"] = normalize_assessment_text_list(
            normalized.get("options", [])
        )

    if normalized_type == "short_answer":
        normalized["keywords"] = normalize_assessment_text_list(
            normalized.get("keywords", [])
        )

    if normalized_type == "ordering":
        normalized["items"] = normalize_assessment_text_list(normalized.get("items", []))
        normalized["explanations"] = normalize_assessment_text_mapping(
            normalized.get("explanations", {})
        )

    return normalized
