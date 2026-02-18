import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import RichTextEditor from '@/components/RichTextEditor';

const RichTextBlockEditor = ({ data, onChange }) => {
    const [html, setHtml] = useState(data.html || '');

    useEffect(() => {
        const timer = setTimeout(() => {
             onChange({ ...data, html });
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [html]);

    return (
        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Content</Typography>
            <RichTextEditor
                value={html}
                onChange={setHtml}
                minHeight={220}
                placeholder="Write lesson content..."
            />
        </Box>
    );
};

export default RichTextBlockEditor;
