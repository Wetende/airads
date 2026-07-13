import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import AdmissionsOnboarding from './Onboarding';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('@inertiajs/react', () => ({
  Head: () => null,
  Link: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
  router: {
    get: vi.fn(),
    post,
  },
}));

vi.mock('@/layouts/DashboardLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@/components/DataTable', () => ({
  default: ({ rows }) => <div data-testid="results-table">{rows.length} rows</div>,
}));

const batch = {
  id: 42,
  status: 'draft',
  statusLabel: 'Draft',
  totalCount: 2,
  processedCount: 0,
  succeededCount: 0,
  skippedCount: 0,
  failedCount: 0,
  emailFailedCount: 0,
  progressPercent: 0,
  previewCounts: { ready: 2, ready_new_free: 2 },
  isDraft: true,
  isProcessing: false,
  isComplete: false,
  startUrl: '/admin/admissions/onboarding/42/start/',
  processUrl: '/admin/admissions/onboarding/42/process-next/',
  retryEmailsUrl: '/admin/admissions/onboarding/42/retry-emails/',
  resultsCsvUrl: '/admin/admissions/onboarding/42/results.csv',
};

afterEach(() => {
  post.mockReset();
  vi.useRealTimers();
});

describe('Admissions onboarding', () => {
  test('explains password delivery and starts a confirmed preview', () => {
    render(<AdmissionsOnboarding batch={batch} items={[]} pagination={{}} />);

    expect(screen.getByText(/temporary password/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /create accounts and onboard 2/i }));

    expect(post).toHaveBeenCalledWith(
      batch.startUrl,
      {},
      expect.objectContaining({ onFinish: expect.any(Function) }),
    );
  });

  test('processes an active batch through its Inertia endpoint', async () => {
    vi.useFakeTimers();
    render(
      <AdmissionsOnboarding
        batch={{ ...batch, isDraft: false, isProcessing: true, status: 'processing' }}
        items={[]}
        pagination={{}}
      />,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(post).toHaveBeenCalledWith(
      batch.processUrl,
      {},
      expect.objectContaining({
        only: ['batch', 'items', 'pagination', 'flash'],
        preserveState: true,
      }),
    );
  });
});
