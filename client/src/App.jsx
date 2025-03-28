import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async () => {
    // Validate input
    if (!emailContent.trim()) {
      setError('Please enter the original email content');
      setSnackbarMessage('Please enter the original email content');
      setShowSnackbar(true);
      return;
    }

    setLoading(true);
    setError('');
    setSnackbarMessage('');

    try {
      // Simulate API delay
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      );
      setSnackbarMessage('Reply generated successfully!');
      setShowSnackbar(true);
    } catch (err) {
      setError('Failed to generate reply. Please try again.');
      setSnackbarMessage('Failed to generate reply. Please try again.');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply);
      setSnackbarMessage('Copied to clipboard!');
      setShowSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Main Card */}
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            ✨ Email Reply Generator
          </Typography>
        </Box>

        <Divider
          sx={{
            mb: 4,
            borderColor: '#d1d1d1',
          }}
        />

        {/* Original Email Input */}
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email"
          placeholder="Paste the email you want to reply to here..."
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#90caf9',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#42a5f5',
              },
            },
          }}
        />

        {/* Tone Selector */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel label="Tone (Optional)">Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            onChange={(e) => setTone(e.target.value)}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#90caf9',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#42a5f5',
              },
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>

        {/* Generate Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mb: 4,
            py: 1.5,
            px: 4,
            fontSize: '1rem',
            borderRadius: 3,
            textTransform: 'none',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
        </Button>

        {/* Generated Reply Section */}
        {generatedReply && (
          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              backgroundColor: '#f1f1f1',
            }}
          >
            <Typography variant="h6" gutterBottom>
              📧 Generated Reply
            </Typography>

            {/* Read-Only Generated Reply Box */}
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={generatedReply}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#dcdcdc',
                  },
                },
              }}
            />

            {/* Copy to Clipboard Button */}
            <Button
              variant="outlined"
              onClick={handleCopyToClipboard}
              startIcon={<ContentCopy />}
              sx={{
                mt: 1,
                borderRadius: 2,
                borderColor: '#90caf9',
                color: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  backgroundColor: '#e3f2fd',
                },
              }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Paper>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={error ? 'error' : 'success'}
          sx={{
            width: '100%',
            borderRadius: 2,
          }}
        >
          {error || snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
