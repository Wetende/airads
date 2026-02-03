import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

/**
 * PublishValidationDialog - Pre-publish validation dialog
 * Shows errors, warnings, and course stats before publishing
 */
export default function PublishValidationDialog({ 
    open, 
    onClose, 
    programId,
    onPublish 
}) {
    const [loading, setLoading] = useState(true);
    const [validation, setValidation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && programId) {
            fetchValidation();
        }
    }, [open, programId]);

    const fetchValidation = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/instructor/programs/${programId}/validate/`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to validate program');
            }
            
            const data = await response.json();
            setValidation(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = () => {
        onPublish?.();
        onClose();
    };

    const renderStats = (details) => {
        if (!details) return null;
        
        return (
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip 
                    icon={<InfoIcon />}
                    label={`${details.lesson_count} Lessons`}
                    variant="outlined"
                    color="primary"
                />
                <Chip 
                    icon={<InfoIcon />}
                    label={`${details.quiz_count} Quizzes`}
                    variant="outlined"
                    color="secondary"
                />
                <Chip 
                    icon={<InfoIcon />}
                    label={`${details.assignment_count} Assignments`}
                    variant="outlined"
                    color="info"
                />
            </Stack>
        );
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
        >
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {validation?.is_valid ? (
                        <CheckIcon color="success" />
                    ) : (
                        <ErrorIcon color="error" />
                    )}
                    <Typography variant="h6">
                        {loading ? 'Validating...' : validation?.is_valid ? 'Ready to Publish' : 'Validation Issues'}
                    </Typography>
                </Stack>
            </DialogTitle>
            
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        {/* Course stats */}
                        {renderStats(validation?.details)}
                        
                        {/* Weight summary for theology mode */}
                        {validation?.details?.mode === 'theology' && (
                            <Alert 
                                severity={validation?.details?.total_assignment_weight === 100 ? 'success' : 'warning'}
                                sx={{ mb: 2 }}
                            >
                                Assignment weights: {validation?.details?.total_assignment_weight}% / 100%
                            </Alert>
                        )}
                        
                        {/* Errors */}
                        {validation?.errors?.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="error" gutterBottom>
                                    Errors (must fix before publishing)
                                </Typography>
                                <List dense>
                                    {validation.errors.map((err, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <ErrorIcon color="error" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={err.node_title ? `${err.node_title}: ${err.message}` : err.message || err}
                                                secondary={err.type ? `Type: ${err.type}` : null}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        
                        {/* Warnings */}
                        {validation?.warnings?.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                                    Warnings (optional to fix)
                                </Typography>
                                <List dense>
                                    {validation.warnings.map((warn, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <WarningIcon color="warning" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={warn.node_title ? `${warn.node_title}: ${warn.message}` : warn.message || warn}
                                                secondary={warn.type ? `Type: ${warn.type}` : null}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        
                        {/* All good */}
                        {validation?.is_valid && validation?.errors?.length === 0 && (
                            <Alert severity="success" icon={<CheckIcon />}>
                                Your course is ready to publish! Students will be able to enroll once published.
                            </Alert>
                        )}
                    </>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handlePublish}
                    disabled={loading || !validation?.is_valid}
                >
                    Publish Course
                </Button>
            </DialogActions>
        </Dialog>
    );
}
