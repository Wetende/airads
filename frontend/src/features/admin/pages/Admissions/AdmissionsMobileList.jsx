import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const statusStyles = {
  new: { backgroundColor: '#EEF3FF', color: '#2454D6' },
  contacted: { backgroundColor: '#FFF2D8', color: '#9A5700' },
  accepted: { backgroundColor: '#E7F8EC', color: '#18763A' },
  declined: { backgroundColor: '#FDE9EE', color: '#C03855' },
};

const applicantInitials = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return '—';
  return `${parts[0][0]}${parts[1]?.[0] || ''}`.toUpperCase();
};

const AdmissionsMobileList = ({
  applications,
  pagination,
  selectedIds,
  onOpen,
  onOnboard,
  onPageChange,
  onSelectionChange,
}) => (
  <Box sx={{ display: { xs: 'block', md: 'none' }, pb: 9 }}>
    <Typography
      sx={{
        color: 'text.secondary',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        mb: 0.75,
        textTransform: 'uppercase',
      }}
    >
      {pagination.total || 0} applicants
    </Typography>

    <Box>
      {applications.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 5, textAlign: 'center' }}>
          No admission applications found
        </Typography>
      ) : (
        applications.map((application, index) => {
          const isSelected = selectedIds.includes(application.id);
          const courseName = application.program?.name || application.preferredProgramme || 'Course pending';
          const campusName = application.campus?.name || application.preferredCampus || 'Campus pending';

          return (
            <Box component="article" key={application.id}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', py: 1 }}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => onSelectionChange(application.id)}
                  size="small"
                  slotProps={{
                    input: { 'aria-label': `Select ${application.fullName}` },
                  }}
                  sx={{
                    p: 0.25,
                    color: 'divider',
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                  }}
                />

                <Box
                  sx={{
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 1.5,
                    color: 'text.secondary',
                    display: 'flex',
                    flex: '0 0 36px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    height: 36,
                    justifyContent: 'center',
                  }}
                >
                  {applicantInitials(application.fullName)}
                </Box>

                <Box
                  component="button"
                  type="button"
                  onClick={() => onOpen(application.id)}
                  sx={{
                    appearance: 'none',
                    background: 'none',
                    border: 0,
                    color: 'inherit',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: 0,
                    p: 0,
                    textAlign: 'left',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {application.fullName}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: '0.68rem',
                      lineHeight: 1.35,
                      mt: 0.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {courseName} · {campusName}
                  </Typography>
                </Box>

                <Chip
                  label={application.statusLabel}
                  size="small"
                  sx={{
                    ...statusStyles[application.status],
                    borderRadius: 1,
                    flexShrink: 0,
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    height: 20,
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              </Stack>
              {index < applications.length - 1 && <Divider sx={{ ml: 6.75 }} />}
            </Box>
          );
        })
      )}
    </Box>

    {pagination.totalPages > 1 && (
      <Pagination
        count={pagination.totalPages}
        page={pagination.page}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        size="small"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
          '& .MuiPaginationItem-root': { fontSize: '0.72rem' },
        }}
      />
    )}

    <Box
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        bottom: 0,
        left: 0,
        mx: -2,
        px: 2,
        py: 1.25,
        position: 'sticky',
        right: 0,
        zIndex: 5,
      }}
    >
      <Button
        variant="contained"
        fullWidth
        startIcon={<GroupAddIcon />}
        disabled={!pagination.total}
        onClick={onOnboard}
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(12, 90, 166, 0.22)',
          minHeight: 44,
          textTransform: 'none',
        }}
      >
        {selectedIds.length > 0
          ? `Onboard selected (${selectedIds.length})`
          : `Onboard all matching (${pagination.total || 0})`}
      </Button>
    </Box>
  </Box>
);

export default AdmissionsMobileList;
