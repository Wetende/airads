import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DOMPurify from "dompurify";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  IconArrowLeft,
  IconUpload,
  IconCheck,
  IconClock,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function View({ assignment, submission, coursePlayer = null }) {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isPastDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const backUrl = coursePlayer?.sessionUrl || "/dashboard/";
  const backLabel = coursePlayer?.sessionUrl ? "Back to Lesson" : "Back";
  const typedResponseMode = assignment.typedResponseMode || "submission_text";
  const assignmentMode = assignment.assignmentMode || "submission_only";
  const allowsSubmission =
    assignmentMode === "mixed" ||
    (assignmentMode === "submission_only" && typedResponseMode === "submission_text");
  const usesShortAnswerPrompt =
    assignmentMode === "submission_only" &&
    typedResponseMode === "short_answer_question";
  const promptHtml = DOMPurify.sanitize(assignment.assessmentPrompt || "");
  const instructionsHtml = DOMPurify.sanitize(assignment.instructions || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (textContent) formData.append('text_content', textContent);
    if (coursePlayer?.enrollmentId) {
      formData.append("enrollment_id", String(coursePlayer.enrollmentId));
    }
    if (coursePlayer?.nodeId) {
      formData.append("node_id", String(coursePlayer.nodeId));
    }

    router.post(`/student/assignment/${assignment.id}/submit/`, formData, {
      forceFormData: true,
      onFinish: () => setSubmitting(false),
    });
  };

  const handleStartPrompt = () => {
    if (!assignment.quizId) return;
    const params = new URLSearchParams();
    if (coursePlayer?.enrollmentId) {
      params.set("enrollment_id", String(coursePlayer.enrollmentId));
    }
    if (coursePlayer?.nodeId) {
      params.set("node_id", String(coursePlayer.nodeId));
    }
    const query = params.toString();
    router.visit(`/student/quiz/${assignment.quizId}/${query ? `?${query}` : ""}`);
  };

  return (
    <>
      <Head title={assignment.title} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Button
              component={Link}
              href={backUrl}
              startIcon={<IconArrowLeft />}
              variant="outlined"
            >
              {backLabel}
            </Button>
            {coursePlayer?.nextNode?.url && (
              <Button component={Link} href={coursePlayer.nextNode.url} variant="contained">
                Continue to Next Lesson
              </Button>
            )}
          </Stack>

          <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {assignment.programName} • Weight: {assignment.weight}%
                </Typography>

                {assignment.dueDate && (
                  <Chip
                    icon={<IconClock size={16} />}
                    label={`Due: ${new Date(assignment.dueDate).toLocaleString()}`}
                    color={isPastDue ? 'error' : 'default'}
                    sx={{ mb: 2 }}
                  />
                )}

                <Typography variant="h6" sx={{ mt: 3 }}>
                  Assignment Question
                </Typography>
                <Box
                  sx={{ color: "text.secondary" }}
                  dangerouslySetInnerHTML={{ __html: promptHtml }}
                />

                <Typography variant="h6" sx={{ mt: 3 }}>
                  Instructions
                </Typography>
                <Box
                  sx={{ color: "text.secondary" }}
                  dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                />

                <Typography variant="h6" sx={{ mt: 3 }}>
                  Materials
                </Typography>
                {(assignment.materials || []).length === 0 ? (
                  <Typography color="text.secondary">No materials attached.</Typography>
                ) : (
                  <Stack spacing={1}>
                    {(assignment.materials || []).map((material, idx) => {
                      const url = material?.url || material?.path;
                      if (!url) return null;
                      return (
                        <Stack key={material?.id || `${url}-${idx}`} direction="row" spacing={2}>
                          <Typography>{material?.name || `Material ${idx + 1}`}</Typography>
                          <Button component="a" href={url} download size="small">Download</Button>
                          <Button component="a" href={url} target="_blank" rel="noopener noreferrer" size="small">Open</Button>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}

                {assignment.allowLateSubmission && assignment.latePenalty > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Late submissions incur a {assignment.latePenalty}% penalty.
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Submission Status */}
              {submission ? (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Submission
                    </Typography>
                    <Stack spacing={1}>
                      <Chip
                        icon={submission.status === 'graded' ? <IconCheck size={14} /> : <IconClock size={14} />}
                        label={submission.status === 'graded' ? 'Graded' : submission.status === 'returned' ? 'Returned' : 'Submitted'}
                        color={submission.status === 'graded' ? 'success' : 'default'}
                      />
                      {submission.isLate && (
                        <Chip
                          icon={<IconAlertTriangle size={14} />}
                          label="Late Submission"
                          color="warning"
                          size="small"
                        />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </Typography>
                      {submission.fileName && (
                        <Typography variant="body2">
                          File: {submission.fileName}
                        </Typography>
                      )}
                      {submission.score !== null && (
                        <Typography variant="h5" color="primary">
                          Score: {submission.score}%
                        </Typography>
                      )}
                      {submission.feedback && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Feedback:</Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {submission.feedback}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ) : null}

              {/* Submit Form */}
              {usesShortAnswerPrompt && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Answer Question
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Answer this assignment using a typed response.
                    </Alert>
                    <Button
                      variant="contained"
                      onClick={handleStartPrompt}
                      disabled={!assignment.quizId}
                    >
                      Answer Question
                    </Button>
                  </CardContent>
                </Card>
              )}

              {allowsSubmission && (!submission || submission.status !== 'graded') && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {submission ? 'Resubmit' : 'Submit Assignment'}
                    </Typography>

                    {isPastDue && !assignment.allowLateSubmission ? (
                      <Alert severity="error">
                        The deadline has passed. Submissions are closed.
                      </Alert>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                          {isPastDue && (
                            <Alert severity="warning" icon={<IconAlertTriangle />}>
                              Submitting late. Penalty: {assignment.latePenalty}%
                            </Alert>
                          )}

                          {(assignment.submissionType === 'file' || assignment.submissionType === 'both') && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                Upload File
                              </Typography>
                              <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept={assignment.allowedFileTypes?.map(t => `.${t}`).join(',')}
                              />
                              {assignment.allowedFileTypes?.length > 0 && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Allowed: {assignment.allowedFileTypes.join(', ')}
                                </Typography>
                              )}
                            </Box>
                          )}

                          {(assignment.submissionType === 'text' || assignment.submissionType === 'both') && (
                            <TextField
                              label="Text Response"
                              value={textContent}
                              onChange={(e) => setTextContent(e.target.value)}
                              multiline
                              rows={6}
                              fullWidth
                            />
                          )}

                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<IconUpload />}
                            disabled={submitting || (!file && !textContent)}
                          >
                            {submitting ? 'Submitting...' : submission ? 'Resubmit' : 'Submit'}
                          </Button>
                        </Stack>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </>
  );
}
