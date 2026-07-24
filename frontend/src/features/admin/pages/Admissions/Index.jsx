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
import AdmissionsMobileList from './AdmissionsMobileList';

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

const mobileFilterSx = {
  flex: '0 0 auto',
  '& .MuiOutlinedInput-root': {
    bgcolor: 'background.paper',
    borderRadius: 999,
    fontSize: '0.72rem',
    fontWeight: 600,
    height: 34,
  },
  '& .MuiSelect-select': {
    py: 0.75,
  },
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
  campuses = [],
  onboardingBatches = [],
}) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [campus, setCampus] = useState(filters.campus || '');
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

  const handleSingleSelection = (id) => {
    setSelectedIds((current) => (
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    ));
  };

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (campus) params.set('campus', campus);
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
            campus: filters.campus || '',
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

      <Stack spacing={{ xs: 2, md: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.25rem', md: '2.125rem' }, lineHeight: 1.15 }}
            >
              Admissions
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.72rem', md: '0.875rem' }, mt: { xs: 0.25, md: 0 } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                Public applications, course-detail leads, payments, and enrollments
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                Applications, leads, payments &amp; enrollments
              </Box>
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            useFlexGap
            flexWrap="wrap"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
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
                campus: filters.campus,
                program: filters.program,
              }}
            />
            <SchoolIcon color="action" />
          </Stack>
        </Box>

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applicants..."
            size="small"
            fullWidth
            slotProps={{
              htmlInput: { 'aria-label': 'Search applicants' },
            }}
            onKeyDown={(event) => event.key === 'Enter' && handleFilter()}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                borderRadius: 2,
                fontSize: '0.78rem',
                height: 40,
              },
            }}
          />
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <FormControl size="small" sx={{ ...mobileFilterSx, minWidth: 86 }}>
              <Select
                value={status}
                displayEmpty
                onChange={(event) => setStatus(event.target.value)}
                inputProps={{ 'aria-label': 'Filter by status' }}
                renderValue={(value) => (
                  value
                    ? statusChoices.find((choice) => choice.value === value)?.label || value
                    : 'Status'
                )}
              >
                <MenuItem value="">All statuses</MenuItem>
                {statusChoices.map((choice) => (
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ ...mobileFilterSx, minWidth: 92 }}>
              <Select
                value={campus}
                displayEmpty
                onChange={(event) => setCampus(event.target.value)}
                inputProps={{ 'aria-label': 'Filter by campus' }}
                renderValue={(value) => (
                  value
                    ? campuses.find((item) => String(item.id) === String(value))?.name || value
                    : 'Campus'
                )}
              >
                <MenuItem value="">All campuses</MenuItem>
                {campuses.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ ...mobileFilterSx, minWidth: 88 }}>
              <Select
                value={program}
                displayEmpty
                onChange={(event) => setProgram(event.target.value)}
                inputProps={{ 'aria-label': 'Filter by course' }}
                renderValue={(value) => (
                  value
                    ? programs.find((item) => String(item.id) === String(value))?.name || value
                    : 'Course'
                )}
              >
                <MenuItem value="">All courses</MenuItem>
                {programs.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="text"
              size="small"
              startIcon={<FilterListIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={handleFilter}
              sx={{
                borderRadius: 999,
                fontSize: '0.72rem',
                minHeight: 34,
                minWidth: 74,
                textTransform: 'none',
              }}
            >
              Filter
            </Button>
          </Stack>
        </Box>

        <Card sx={{ display: { xs: 'none', md: 'block' } }}>
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
                <InputLabel>Campus</InputLabel>
                <Select value={campus} label="Campus" onChange={(event) => setCampus(event.target.value)}>
                  <MenuItem value="">All Campuses</MenuItem>
                  {campuses.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
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
          <Card variant="outlined" sx={{ display: { xs: 'none', md: 'block' } }}>
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

        <AdmissionsMobileList
          applications={applications}
          pagination={pagination}
          selectedIds={selectedIds}
          onOpen={(id) => router.visit(`/admin/admissions/${id}/`)}
          onPageChange={handlePageChange}
          onSelectionChange={handleSingleSelection}
          onOnboard={() => setOnboardingMode(selectedIds.length > 0 ? 'ids' : 'filters')}
        />

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
        </Box>
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
