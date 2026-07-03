import { Head, router } from '@inertiajs/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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

import DashboardLayout from '@/layouts/DashboardLayout';
import DataTable from '@/components/DataTable';
import { formatAmount } from '@/services/commerceApi';

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
}) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [source, setSource] = useState(filters.source || '');
  const [program, setProgram] = useState(filters.program || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (source) params.set('source', source);
    if (program) params.set('program', program);

    router.visit(`/admin/admissions/?${params.toString()}`, {
      only: ['applications', 'filters', 'pagination'],
      preserveState: true,
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
          <SchoolIcon color="action" />
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

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <DataTable
            columns={columns}
            rows={applications}
            pagination={pagination}
            onPageChange={handlePageChange}
            actions={actions}
            emptyMessage="No admission applications found"
          />
        </motion.div>
      </Stack>
    </DashboardLayout>
  );
}
