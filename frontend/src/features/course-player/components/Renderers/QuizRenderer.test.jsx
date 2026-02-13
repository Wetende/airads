import { describe, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import QuizRenderer from './QuizRenderer';
import { evaluateQuizAnswers, normalizeQuestions } from './quizRendererUtils';

vi.mock('@inertiajs/react', () => ({
    router: {
        visit: vi.fn(),
        post: vi.fn(),
    },
}));

describe('QuizRenderer', () => {
    test('renders labels when options are plain strings', () => {
        const html = renderToStaticMarkup(
            <QuizRenderer
                node={{
                    id: 1,
                    title: 'Knowledge Check',
                    properties: {
                        questions: [
                            {
                                id: 101,
                                type: 'mcq',
                                text: 'What does CPU stand for?',
                                options: [
                                    'Computer Processing Unit',
                                    'Central Processing Unit',
                                ],
                                correct: 1,
                                points: 1,
                            },
                        ],
                    },
                }}
                enrollmentId={55}
            />,
        );

        expect(html).toContain('Computer Processing Unit');
        expect(html).toContain('Central Processing Unit');
    });

    test('renders labels when options are object arrays', () => {
        const html = renderToStaticMarkup(
            <QuizRenderer
                node={{
                    id: 2,
                    title: 'Knowledge Check',
                    properties: {
                        questions: [
                            {
                                id: 202,
                                type: 'mcq',
                                text: 'Pick one',
                                options: [
                                    { id: 'a', text: 'Option A' },
                                    { id: 'b', text: 'Option B' },
                                ],
                                correctAnswer: 1,
                                points: 1,
                            },
                        ],
                    },
                }}
                enrollmentId={55}
            />,
        );

        expect(html).toContain('Option A');
        expect(html).toContain('Option B');
    });

    test('scores mixed question types and excludes manual short answer from denominator', () => {
        const normalized = normalizeQuestions([
            {
                id: 'q1',
                type: 'mcq',
                text: 'MCQ',
                options: ['A', 'B', 'C'],
                correct: 1,
                points: 2,
            },
            {
                id: 'q2',
                type: 'mcq_multi',
                text: 'Multi',
                options: ['A', 'B', 'C'],
                correctAnswers: [0, 2],
                points: 2,
            },
            {
                id: 'q3',
                type: 'true_false',
                text: 'True/False',
                options: ['True', 'False'],
                correct: 0,
                points: 1,
            },
            {
                id: 'q4',
                type: 'matching',
                text: 'Match',
                pairs: [
                    { left_text: 'One', right_text: '1' },
                    { left_text: 'Two', right_text: '2' },
                ],
                points: 4,
            },
            {
                id: 'q5',
                type: 'fill_blank',
                text: 'The capital of France is {{blank}} and Spain is {{blank}}.',
                gaps: [
                    { gap_index: 0, accepted_answers: ['Paris'] },
                    { gap_index: 1, accepted_answers: ['Madrid'] },
                ],
                points: 4,
            },
            {
                id: 'q6',
                type: 'ordering',
                text: 'Order',
                items: ['A', 'B', 'C'],
                points: 3,
            },
            {
                id: 'q7',
                type: 'image_matching',
                text: 'Image Match',
                image_pairs: [
                    {
                        question_text: 'Dog',
                        answer_text: 'Bark',
                    },
                    {
                        question_text: 'Cat',
                        answer_text: 'Meow',
                    },
                ],
                points: 4,
            },
            {
                id: 'q8',
                type: 'short_answer',
                text: 'Keyword',
                keywords: ['servant'],
                points: 2,
            },
            {
                id: 'q9',
                type: 'short_answer',
                text: 'Manual',
                keywords: [],
                points: 5,
            },
        ]);

        const byId = Object.fromEntries(normalized.map((q) => [q.id, q]));
        const imageQuestion = byId.q7;
        const leftIds = imageQuestion.left_items.map((item) => item.id);
        const rightIds = imageQuestion.right_items.map((item) => item.id);

        const answers = {
            q1: byId.q1.correctOptionId,
            q2: byId.q2.correctOptionIds,
            q3: byId.q3.correctOptionId,
            q4: { One: '1', Two: 'wrong' },
            q5: { 0: 'Paris', 1: 'wrong' },
            q6: ['C', 'B', 'A'],
            q7: {
                [leftIds[0]]: imageQuestion.correctImageMatchingMap[leftIds[0]],
                [leftIds[1]]: rightIds[0],
            },
            q8: 'Servant leadership',
            q9: 'Needs lecturer review',
        };

        const result = evaluateQuizAnswers(normalized, answers);

        expect(result.pointsEarned).toBe(13);
        expect(result.pointsPossible).toBe(22);
        expect(result.score).toBe(59);
        expect(result.ungradedCount).toBe(1);
    });
});
