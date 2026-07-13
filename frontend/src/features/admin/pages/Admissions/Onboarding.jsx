import { Head, Link, router } from '@inertiajs/react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import DashboardLayout from '@/layouts/DashboardLayout';
import DataTable from '@/components/DataTable';

const statusColors = {
  pending: 'default',
  succeeded: 'success',
  skipped: 'warning',
  failed: 'error',
};

const emailColors = {
  not_sent: 'default',
  sent: 'success',
  failed: 'error',
  skipped: 'default',
};

function humanize(value) {
  return String(value || 'pending')
    .replaceAll('_', ' ')
    .replace(/^\w/, (character) => character.toUpperCase());
}

function SummaryCard({ label, value, color = 'text.primary' }) {
  return (
    <Card variant="outlined" sx={{ flex: '1 1 150px' }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={700} color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AdmissionsOnboarding({ batch, items = [], pagination = {} }) {
  const [processingRequest, setProcessingRequest] = useState(false);
  const [starting, setStarting] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!batch.isProcessing || batch.processedCount >= batch.totalCount || processingRequest) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setProcessingRequest(true);
      router.post(batch.processUrl, {}, {
        only: ['batch', 'items', 'pagination', 'flash'],
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          setProcessingRequest(false);
        },
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [batch, processingRequest]);

  const handleStart = () => {
    setStarting(true);
    router.post(batch.startUrl, {}, {
      onFinish: () => setStarting(false),
    });
  };

  const handleRetryEmails = () => {
    setRetrying(true);
    router.post(batch.retryEmailsUrl, {}, {
      preserveScroll: true,
      onFinish: () => setRetrying(false),
    });
  };

  const handlePageChange = (page) => {
    router.get(window.location.pathname, { page }, {
      only: ['items', 'pagination'],
      preserveState: true,
      preserveScroll: true,
    });
  };

  const columns = [
    {
      id: 'applicant',
      label: 'Applicant',
      render: (row) => (
        <Box>
          <Button
            component={Link}
            href={row.applicationUrl}
            variant="text"
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{ px: 0, justifyContent: 'flex-start' }}
          >
            {row.applicant}
          </Button>
          <Typography display="block" variant="caption" color="text.secondary">
            {row.email || 'No email'}
          </Typography>
        </Box>
      ),
    },
    { id: 'program', label: 'Course' },
    {
      id: 'status',
      label: 'Processing',
      render: (row) => (
        <Chip
          size="small"
          label={row.statusLabel}
          color={statusColors[row.status] || 'default'}
        />
      ),
    },
    {
      id: 'outcome',
      label: 'Result',
      render: (row) => (
        <Box>
          <Typography variant="body2">{humanize(row.outcome)}</Typography>
          {row.errorMessage && (
            <Typography variant="caption" color="error.main">
              {row.errorMessage}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'accountState',
      label: 'Account',
      render: (row) => humanize(row.accountState || 'not created'),
    },
    {
      id: 'emailStatus',
      label: 'Email',
      render: (row) => (
        <Chip
          size="small"
          variant="outlined"
          label={row.emailStatusLabel}
          color={emailColors[row.emailStatus] || 'default'}
        />
      ),
    },
  ];

  return (
    <DashboardLayout
      role="admin"
      breadcrumbs={[
        { label: 'Admissions', href: '/admin/admissions/' },
        { label: `Onboarding #${batch.id}` },
      ]}
    >
      <Head title={`Admissions onboarding #${batch.id}`} />

      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
          }}
        >
          <Box>
            <Button
              component={Link}
              href="/admin/admissions/"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 1, px: 0 }}
            >
              Back to admissions
            </Button>
            <Typography variant="h4" fontWeight={700}>
              Applicant onboarding
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Batch #{batch.id} · {batch.statusLabel}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {batch.isComplete && (
              <Button
                component="a"
                href={batch.resultsCsvUrl}
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Export results
              </Button>
            )}
            {batch.emailFailedCount > 0 && (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<EmailIcon />}
                disabled={retrying}
                onClick={handleRetryEmails}
              >
                {retrying ? 'Retrying…' : `Retry ${batch.emailFailedCount} failed emails`}
              </Button>
            )}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <SummaryCard label="Applications" value={batch.totalCount} />
          <SummaryCard label="Processed" value={batch.processedCount} />
          <SummaryCard label="Succeeded" value={batch.succeededCount} color="success.main" />
          <SummaryCard label="Skipped" value={batch.skippedCount} color="warning.main" />
          <SummaryCard label="Failed" value={batch.failedCount} color="error.main" />
        </Stack>

        {batch.isDraft && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Review before creating accounts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eligible free or approval-based courses are enrolled immediately. Paid courses
                    receive a checkout link and are enrolled only after payment succeeds.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {Object.entries(batch.previewCounts || {}).map(([label, count]) => (
                    count > 0 && (
                      <Chip key={label} label={`${humanize(label)}: ${count}`} variant="outlined" />
                    )
                  ))}
                </Stack>
                <Alert severity="info">
                  New students receive one email containing a temporary password, Google sign-in
                  guidance, and a password-reset link. Existing accounts receive access guidance
                  without a new password.
                </Alert>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<GroupAddIcon />}
                    disabled={starting}
                    onClick={handleStart}
                  >
                    {starting ? 'Starting…' : `Create accounts and onboard ${batch.totalCount} applicants`}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {batch.isProcessing && (
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography fontWeight={700}>Onboarding in progress</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {batch.processedCount} / {batch.totalCount}
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={batch.progressPercent} />
                <Typography variant="caption" color="text.secondary">
                  Keep this page open while applicants are processed in safe batches.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        {batch.isComplete && batch.emailFailedCount === 0 && (
          <Alert severity={batch.failedCount > 0 ? 'warning' : 'success'}>
            Onboarding is complete. Review skipped or failed rows below and export the results if needed.
          </Alert>
        )}

        <DataTable
          columns={columns}
          rows={items}
          pagination={pagination}
          onPageChange={handlePageChange}
          emptyMessage="No applicants in this onboarding batch"
        />
      </Stack>
    </DashboardLayout>
  );
}
