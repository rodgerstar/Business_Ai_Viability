import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  town: string; setTown: (v: string) => void;
  budget: string; setBudget: (v: string) => void;
  businessType: string; setBusinessType: (v: string) => void;
  section: string; setSection: (v: string) => void;  // New
  building: string; setBuilding: (v: string) => void;  // New
  onAnalyze: () => void;
  loading: boolean;
  isNdangani: boolean;  // New: Conditional render
}

export default function InputForm({ 
  town, setTown, budget, setBudget, businessType, setBusinessType, 
  section, setSection, building, setBuilding, 
  onAnalyze, loading, isNdangani 
}: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Town (e.g., Eldoret or Ndangani Slaughter)" value={town} onChange={(e) => setTown(e.target.value)} fullWidth />
      <TextField label="Budget (KES)" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} fullWidth />
      <TextField label="Business Type (e.g., Salon)" value={businessType} onChange={(e) => setBusinessType(e.target.value)} fullWidth />
      
      {isNdangani && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Ndangani/Slaughter Details (for precise analysis):</Typography>
          <TextField label="Section (e.g., A, B)" value={section} onChange={(e) => setSection(e.target.value)} fullWidth helperText="From market sections like A near Genera Road" />
          <TextField label="Building Name or Description (e.g., Emanuel's)" value={building} onChange={(e) => setBuilding(e.target.value)} fullWidth helperText="Name or describe location for vacancy check" />
        </>
      )}
      
      <Button variant="contained" onClick={onAnalyze} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Analyze'}
      </Button>
    </Box>
  );
}