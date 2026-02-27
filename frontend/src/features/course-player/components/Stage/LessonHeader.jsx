import { Box, Typography } from '@mui/material';

const LessonHeader = ({ title }) => {
    return (
        <Box sx={{ mb: 4 }}>
            {/* Lesson Title */}
            <Typography 
                variant="h4" 
                component="h1" 
                fontWeight={700}
                sx={{ lineHeight: 1.3 }}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default LessonHeader;
