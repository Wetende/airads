from django.test import SimpleTestCase

from apps.core.views import _normalize_question_text


class QuizTextNormalizationTests(SimpleTestCase):
    def test_normalize_question_text_decodes_html_entities_and_tags(self):
        self.assertEqual(
            _normalize_question_text(
                "<p>Define&nbsp;what&nbsp;public&nbsp;relations&#39;&nbsp;role&nbsp;is.</p>"
            ),
            "Define what public relations' role is.",
        )
