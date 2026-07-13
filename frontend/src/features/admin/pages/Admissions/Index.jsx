import { Head, router } from '@inertiajs/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import DashboardLayout from '@/layouts/DashboardLayout';
import DataTable from '@/components/DataTable';
import { formatAmount } from '@/services/commerceApi';
import { ReportToolbar } from '@/features/reports';

const statusColors = {
  new: 'info',
  contacted: 'warning',
  accepted: 'success',
  declined: 'error',
};

const paymentColors = {
  paid: 'success',
  pending: 'warning',
  refunded: 'secondary',
  failed: 'error',
  cancelled: 'default',
  expired: 'default',
  none: 'default',
  unlinked: 'default',
  no_program: 'default',
};

const enrollmentColors = {
  active: 'success',
  completed: 'info',
  withdrawn: 'error',
  suspended: 'warning',
  not_enrolled: 'default',
  unlinked: 'default',
  no_program: 'default',
};

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '—';
}

function sourceLabel(value) {
  return String(value || 'website').replaceAll('_', ' ');
}

export default function AdmissionsIndex({
  applications = [],
  programs = [],
  filters = {},
  pagination = {},
  statusChoices = [],
  sources = [],
  onboardingBatches = [],
}) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [source, setSource] = useState(filters.source || '');
  const [program, setProgram] = useState(filters.program || '');
  const [selectedIds, setSelectedIds] = useState([]);
  const [onboardingMode, setOnboardingMode] = useState(null);
  const [submittingOnboarding, setSubmittingOnboarding] = useState(false);

  const visibleIds = applications.map((application) => application.id);
  const visibleSelectedIds = selectedIds.filter((id) => visibleIds.includes(id));

  const handlePageSelection = (nextVisibleIds) => {
    setSelectedIds((current) => [
      ...current.filter((id) => !visibleIds.includes(id)),
      ...nextVisibleIds,
    ]);
  };

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (source) params.set('source', source);
    if (program) params.set('program', program);

    setSelectedIds([]);
    router.visit(`/admin/admissions/?${params.toString()}`, {
      only: ['applications', 'filters', 'pagination'],
      preserveState: true,
    });
  };

  const handleOnboardingSubmit = () => {
    if (!onboardingMode || (onboardingMode === 'ids' && selectedIds.length === 0)) return;

    const selection = onboardingMode === 'filters'
      ? {
          mode: 'filters',
          filters: {
            search: filters.search || '',
            status: filters.status || '',
            source: filters.source || '',
            program: filters.program || '',
          },
          excludedIds: [],
        }
      : { mode: 'ids', ids: selectedIds };

    setSubmittingOnboarding(true);
    router.post('/admin/admissions/onboarding/preview/', { selection }, {
      onFinish: () => setSubmittingOnboarding(false),
    });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    router.visit(`/admin/admissions/?${params.toString()}`, {
      only: ['applications', 'pagination'],
      preserveState: true,
      preserveScroll: true,
    });
  };

  const columns = [
    {
      id: 'fullName',
      label: 'Applicant',
      render: (row) => (
        <Box>
          <Typography fontWeight={600}>{row.fullName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email || row.phone || 'No contact'}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }} useFlexGap flexWrap="wrap">
            {row.linkedUser ? (
              <Chip
                size="small"
                variant="outlined"
                color="success"
                icon={<AccountCircleIcon fontSize="small" />}
                label="User linked"
              />
            ) : row.matchingUser ? (
              <Chip
                size="small"
                variant="outlined"
                color="warning"
                icon={<AccountCircleIcon fontSize="small" />}
                label="User match"
              />
            ) : null}
          </Stack>
        </Box>
      ),
    },
    {
      id: 'program',
      label: 'Course',
      render: (row) => (
        <Box sx={{ minWidth: 180 }}>
          <Typography variant="body2" fontWeight={500}>
            {row.program?.name || row.preferredProgramme}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.program?.code || row.studyModeLabel}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'preferredCampus',
      label: 'Campus',
      render: (row) => (
        <Box>
          <Typography variant="body2">{row.campus?.name || row.preferredCampus}</Typography>
          <Typography variant="caption" color="text.secondary">
            {sourceLabel(row.source)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Application',
      render: (row) => (
        <Chip
          label={row.statusLabel}
          size="small"
          color={statusColors[row.status] || 'default'}
        />
      ),
    },
    {
      id: 'paymentStatus',
      label: 'Payment',
      render: (row) => (
        <Box>
          <Chip
            label={row.paymentStatus?.label || 'Unknown'}
            size="small"
            color={paymentColors[row.paymentStatus?.state] || 'default'}
            variant={row.paymentStatus?.state === 'paid' ? 'filled' : 'outlined'}
          />
          {row.paymentStatus?.amountMinor != null && (
            <Typography display="block" variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatAmount(row.paymentStatus.amountMinor, row.paymentStatus.currency)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'enrollmentStatus',
      label: 'Enrollment',
      render: (row) => (
        <Chip
          label={row.enrollmentStatus?.label || 'Unknown'}
          size="small"
          color={enrollmentColors[row.enrollmentStatus?.state] || 'default'}
          variant={row.enrollmentStatus?.state === 'active' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const actions = [
    {
      label: 'Review',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (row) => router.visit(`/admin/admissions/${row.id}/`),
    },
  ];

  return (
    <DashboardLayout role="admin" breadcrumbs={[{ label: 'Admissions' }]}>
      <Head title="Admissions" />

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Admissions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Public applications, course-detail leads, payments, and enrollments
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<GroupAddIcon />}
              disabled={selectedIds.length === 0}
              onClick={() => setOnboardingMode('ids')}
            >
              Onboard selected ({selectedIds.length})
            </Button>
            <Button
              variant="outlined"
              startIcon={<GroupAddIcon />}
              disabled={!pagination.total}
              onClick={() => setOnboardingMode('filters')}
            >
              Onboard all matching ({pagination.total || 0})
            </Button>
            <ReportToolbar
              scope="admin"
              reportId="admin.admissions"
              queryParams={{
                search: filters.search,
                status: filters.status,
                source: filters.source,
                program: filters.program,
              }}
            />
            <SchoolIcon color="action" />
          </Stack>
        </Box>

        <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', lg: 'flex-end' }}
            >
              <TextField
                label="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                size="small"
                fullWidth
                sx={{ minWidth: { lg: 260 }, maxWidth: { lg: 360 } }}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                onKeyPress={(event) => event.key === 'Enter' && handleFilter()}
              />
              <FormControl size="small" fullWidth sx={{ minWidth: { lg: 180 }, maxWidth: { lg: 220 } }}>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={(event) => setStatus(event.target.value)}>
                  <MenuItem value="">All Statuses</MenuItem>
                  {statusChoices.map((choice) => (
                    <MenuItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth sx={{ minWidth: { lg: 180 }, maxWidth: { lg: 240 } }}>
                <InputLabel>Source</InputLabel>
                <Select value={source} label="Source" onChange={(event) => setSource(event.target.value)}>
                  <MenuItem value="">All Sources</MenuItem>
                  {sources.map((value) => (
                    <MenuItem key={value} value={value}>
                      {sourceLabel(value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth sx={{ minWidth: { lg: 220 }, maxWidth: { lg: 320 } }}>
                <InputLabel>Course</InputLabel>
                <Select value={program} label="Course" onChange={(event) => setProgram(event.target.value)}>
                  <MenuItem value="">All Courses</MenuItem>
                  {programs.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleFilter}>
                Filter
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {onboardingBatches.length > 0 && (
          <Card variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2}
              >
                <Box>
                  <Typography fontWeight={700}>Recent onboarding batches</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reopen a preview, resume processing, or review completed results.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {onboardingBatches.map((batch) => (
                    <Button
                      key={batch.id}
                      variant="outlined"
                      size="small"
                      onClick={() => router.visit(`/admin/admissions/onboarding/${batch.id}/`)}
                    >
                      #{batch.id} · {batch.statusLabel} · {batch.processedCount}/{batch.totalCount}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <DataTable
            columns={columns}
            rows={applications}
            pagination={pagination}
            onPageChange={handlePageChange}
            actions={actions}
            selectable
            selectedIds={visibleSelectedIds}
            onSelectionChange={handlePageSelection}
            emptyMessage="No admission applications found"
          />
        </motion.div>
      </Stack>

      <Dialog
        open={Boolean(onboardingMode)}
        onClose={() => setOnboardingMode(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Prepare applicant onboarding</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {onboardingMode === 'filters'
              ? `Create a preview for all ${pagination.total || 0} applications matching the applied filters.`
              : `Create a preview for ${selectedIds.length} selected application${selectedIds.length === 1 ? '' : 's'}.`}
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            The preview will show which applicants can be enrolled immediately, which need payment,
            and which require manual review. No accounts or enrollments are created until you confirm it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOnboardingMode(null)} disabled={submittingOnboarding}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleOnboardingSubmit}
            disabled={submittingOnboarding}
          >
            {submittingOnboarding ? 'Preparing…' : 'Create preview'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
