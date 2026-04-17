/**
 * Admin Create Announcement
 * Form to send announcement to any course's students
 */

import { Head, useForm } from '@inertiajs/react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

import DashboardLayout from '@/layouts/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';

export default function Create({ programs = [] }) {
  const { data, setData, post, processing, errors } = useForm({
    programId: '',
    title: '',
    message: '',
  });

  const breadcrumbs = [
    { label: 'Announcements', href: '/admin/announcements/' },
    { label: 'Create' },
  ];

  const messageText = data.message.replace(/<[^>]*>/g, '').trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/announcements/create/');
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} role="admin">
      <Head title="Create Announcement" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', maxWidth: 800 }}>
          {/* Header */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Create Announcement
            </Typography>
            <Divider sx={{ width: 40, borderBottomWidth: 3, borderColor: 'primary.main', mt: 1 }} />
          </Box>

          <Divider />

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {/* Course Selection */}
            <Typography
              variant="overline"
              sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}
            >
              CHOOSE COURSE
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={data.programId}
                onChange={(e) => setData('programId', e.target.value)}
                displayEmpty
                error={!!errors.programId}
                sx={{ bgcolor: '#f8fafc' }}
              >
                <MenuItem value="" disabled>
                  - Choose Course for Announcement -
                </MenuItem>
                {programs.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.programId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.programId}
                </Typography>
              )}
            </FormControl>

            {/* Title */}
            <Typography
              variant="overline"
              sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}
            >
              ANNOUNCEMENT TITLE
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Schedule Update, Exam Notice..."
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 3, bgcolor: '#f8fafc' }}
            />

            {/* Message */}
            <Typography
              variant="overline"
              sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}
            >
              MESSAGE FOR COURSE STUDENTS
            </Typography>
            <Box sx={{ mb: 1 }}>
              <RichTextEditor
                value={data.message}
                onChange={(value) => setData('message', value)}
                minHeight={180}
                placeholder="Write announcement for students..."
              />
            </Box>
            {errors.message && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                {errors.message}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={processing || !data.programId || !messageText}
              sx={{
                textTransform: 'uppercase',
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              {processing ? 'Creating...' : 'Create Announcement'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </DashboardLayout>
  );
}
