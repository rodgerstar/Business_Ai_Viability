import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { sendFollowUp } from '../services/api';
import { useChatSession } from '../hooks/useChatSession';
import { ApiResponse, QuickQuestion } from '../types';  // Import QuickQuestion

interface Props {
  originalResult: ApiResponse;
  quickQuestions: QuickQuestion[];
  instanceKey?: string;  // New: Optional prop for session key
}

export default function ChatInterface({ originalResult, quickQuestions, instanceKey = 'default' }: Props) {
  const { history, addMessage } = useChatSession(instanceKey);  // Pass instanceKey
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    addMessage('user', text);
    setLoading(true);
    try {
      const aiAnswer = await sendFollowUp({
        originalContext: originalResult,
        userQuestion: text,
        history,
      });
      addMessage('assistant', aiAnswer);
    } catch (e) {
      addMessage('assistant', 'Error – try again.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
        
<Typography variant="h6" sx={{ mb: 2 }}>
  Business Setup Assistant
  <Button variant="text" size="small" onClick={() => window.location.href = '/'} sx={{ ml: 2 }}>Close Chat</Button>
</Typography>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {quickQuestions.map((q, i) => (
          <Button key={i} variant="outlined" size="small" onClick={() => sendMessage(q.prompt)}>
            {q.label}
          </Button>
        ))}
      </Box>

      <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflow: 'auto', mb: 2 }}>
        {history.map((msg, i) => (
          <Box key={i} sx={{ textAlign: msg.role === 'user' ? 'right' : 'left', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                p: 1.5,
                borderRadius: 2,
                backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                maxWidth: '80%',
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        {loading && <Typography>Thinking...</Typography>}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Ask more..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          disabled={loading}
        />
        <Button variant="contained" onClick={() => sendMessage(input)} disabled={loading}>
          Send
        </Button>
      </Box>
    </Box>
  );
}