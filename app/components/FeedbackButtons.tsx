// app/components/FeedbackButtons.tsx
import { Button, Box } from '@mui/material';

interface Props {
  onFeedback: (yes: boolean) => void;
}

export default function FeedbackButtons({ onFeedback }: Props) {
  return (
    <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
      <Button variant="contained" color="success" onClick={() => onFeedback(true)}>
        Yes – I like this!
      </Button>
      <Button variant="contained" color="error" onClick={() => onFeedback(false)}>
        No – Need adjustments
      </Button>
    </Box>
  );
}