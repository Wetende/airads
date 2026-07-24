import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import AdmissionsMobileList from './AdmissionsMobileList';

const application = {
  id: 12,
  fullName: 'Grace Mwangi',
  preferredProgramme: 'BSc Computer Science',
  preferredCampus: 'Eldoret Campus',
  status: 'accepted',
  statusLabel: 'Accepted',
};

describe('AdmissionsMobileList', () => {
  test('renders compact applicant details and mobile bulk actions', () => {
    const onOpen = vi.fn();
    const onOnboard = vi.fn();
    const onSelectionChange = vi.fn();

    const { rerender } = render(
      <AdmissionsMobileList
        applications={[application]}
        pagination={{ page: 1, perPage: 20, total: 14, totalPages: 1 }}
        selectedIds={[]}
        onOpen={onOpen}
        onOnboard={onOnboard}
        onPageChange={vi.fn()}
        onSelectionChange={onSelectionChange}
      />,
    );

    expect(screen.getByText('14 applicants')).toBeTruthy();
    expect(screen.getByText('GM')).toBeTruthy();
    expect(screen.getByText('BSc Computer Science · Eldoret Campus')).toBeTruthy();
    expect(screen.getByText('Accepted')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Grace Mwangi/ }));
    expect(onOpen).toHaveBeenCalledWith(12);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Grace Mwangi' }));
    expect(onSelectionChange).toHaveBeenCalledWith(12);

    fireEvent.click(screen.getByRole('button', { name: 'Onboard all matching (14)' }));
    expect(onOnboard).toHaveBeenCalledTimes(1);

    rerender(
      <AdmissionsMobileList
        applications={[application]}
        pagination={{ page: 1, perPage: 20, total: 14, totalPages: 1 }}
        selectedIds={[12]}
        onOpen={onOpen}
        onOnboard={onOnboard}
        onPageChange={vi.fn()}
        onSelectionChange={onSelectionChange}
      />,
    );

    expect(screen.getByRole('button', { name: 'Onboard selected (1)' })).toBeTruthy();
  });
});
