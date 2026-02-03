import { useState } from 'react';
import { Stack, TextField, IconButton, Button, Typography, Box, Alert, Popover } from '@mui/material';
import { IconTrash, IconPlus, IconHelp } from '@tabler/icons-react';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

export default function FillBlankEditor({ text, gaps, onTextChange, onGapsChange }) {
  const [explanationAnchor, setExplanationAnchor] = useState(null);
  const [activeGapIndex, setActiveGapIndex] = useState(null);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    onTextChange(newText);
    
    // Sync gaps count
    const count = (newText.match(/\{\{blank\}\}/g) || []).length;
    let newGaps = [...gaps];
    
    if (count > gaps.length) {
      for (let i = gaps.length; i < count; i++) {
        newGaps.push({ gap_index: i, accepted_answers: [], explanation: '' });
      }
    } else if (count < gaps.length) {
      newGaps = newGaps.slice(0, count);
    }
    onGapsChange(newGaps);
  };

  const updateGapAnswers = (index, valueString) => {
    const answers = valueString.split(',').map(s => s.trim()).filter(s => s);
    const newGaps = [...gaps];
    newGaps[index] = { ...newGaps[index], accepted_answers: answers };
    onGapsChange(newGaps);
  };

  const updateGapExplanation = (index, value) => {
    const newGaps = [...gaps];
    newGaps[index] = { ...newGaps[index], explanation: value };
    onGapsChange(newGaps);
  };

  const handleOpenExplanation = (event, index) => {
    setExplanationAnchor(event.currentTarget);
    setActiveGapIndex(index);
  };

  const handleCloseExplanation = () => {
    setExplanationAnchor(null);
    setActiveGapIndex(null);
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Use <code>{"{{blank}}"}</code> to insert a gap. Example: {"\"Roses are {{blank}}.\""}
      </Alert>
      <TextField
        label="Question Text"
        value={text}
        onChange={handleTextChange}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Gap Answers (Comma separated for variations)
      </Typography>
      <Stack spacing={2}>
        {gaps.map((gap, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              label={`Gap ${index + 1} Answers`}
              placeholder="e.g. Red, red, RED"
              value={gap.accepted_answers.join(', ')}
              onChange={(e) => updateGapAnswers(index, e.target.value)}
              fullWidth
              size="small"
            />
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={(e) => handleOpenExplanation(e, index)}
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                fontSize: '0.7rem',
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                mt: 0.5,
              }}
            >
              Explain
            </Button>
          </Box>
        ))}
      </Stack>

      {/* Explanation Popover */}
      <Popover
        open={Boolean(explanationAnchor)}
        anchorEl={explanationAnchor}
        onClose={handleCloseExplanation}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Answer explanation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Will be shown in "Show answer" section
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleCloseExplanation}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter explanation"
            value={activeGapIndex !== null ? (gaps[activeGapIndex]?.explanation || '') : ''}
            onChange={(e) => {
              if (activeGapIndex !== null) {
                updateGapExplanation(activeGapIndex, e.target.value);
              }
            }}
            multiline
            rows={2}
          />
        </Box>
      </Popover>
    </Box>
  );
}
