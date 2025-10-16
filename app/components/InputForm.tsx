// app/components/InputForm.tsx
import { TextField, Button, Box, CircularProgress } from '@mui/material';

interface Props {
  town: string; setTown: (v: string) => void;
  budget: string; setBudget: (v: string) => void;
  businessType: string; setBusinessType: (v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export default function InputForm({ town, setTown, budget, setBudget, businessType, setBusinessType, onAnalyze, loading }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Town (e.g., Eldoret)" value={town} onChange={(e) => setTown(e.target.value)} fullWidth />
      <TextField label="Budget (KES)" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} fullWidth />
      <TextField label="Business Type (e.g., Salon)" value={businessType} onChange={(e) => setBusinessType(e.target.value)} fullWidth />
      <Button variant="contained" onClick={onAnalyze} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Analyze'}
      </Button>
    </Box>
  );
}