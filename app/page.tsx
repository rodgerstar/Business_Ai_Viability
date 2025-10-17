'use client';

import { useState } from 'react';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Box,
  useMediaQuery,
  Button,
  Modal,
  Typography,
} from '@mui/material';
import InputForm from './components/InputForm';
import AnalysisResult from './components/AnalysisResult';
import FeedbackButtons from './components/FeedbackButtons';
import ChatInterface from './components/ChatInterface';
import { analyzeBusiness, adoptOutcome } from './services/api';
import { AnalyzeResponse, ApiResponse } from './types';

const steps = ['Enter Details', 'View Analysis', 'Feedback & Chat'];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [town, setTown] = useState('');
  const [budget, setBudget] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [section, setSection] = useState('');  // New
  const [building, setBuilding] = useState('');  // New
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comingSoonMessage, setComingSoonMessage] = useState('');
  const [buildingErrorMessage, setBuildingErrorMessage] = useState('');  // New: For building/vacancy
  const [instanceKey, setInstanceKey] = useState('');
  const [liked, setLiked] = useState<boolean | null>(null);  // Fixed: Added missing state declaration
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setComingSoonMessage('');
    setBuildingErrorMessage('');
    try {
      const payload: any = {
        town,
        budget: Number(budget),
        businessType,
      };
      // Add section/building if Ndangani/Slaughter
      if (town.toLowerCase().includes('ndagani') || town.toLowerCase().includes('slaughter')) {
        if (!section || !building) {
          setError('For Ndangani/Slaughter, specify section and building.');
          return;
        }
        payload.section = section;
        payload.building = building;
      }

      const data: AnalyzeResponse = await analyzeBusiness(payload);

      if ('error' in data) {
        if (data.error === 'coming_soon') {
          setComingSoonMessage(data.message || 'Coming soon!');
        } else if (data.error === 'building_not_found') {
          setBuildingErrorMessage(data.message || 'Building not found—describe more?');
        } else {
          setError(data.message || 'Analysis failed');
        }
        return;
      }

      const newInstanceKey = `${town.toLowerCase()}_${businessType.toLowerCase()}_${budget}_${section}_${building}`;
      setInstanceKey(newInstanceKey);
      setResult(data);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (yes: boolean) => {
    setLiked(yes);
    if (result?.outcomeId) {
      try {
        await adoptOutcome(result.outcomeId, yes);
      } catch {
        console.error('Adopt failed');
      }
    }
    setActiveStep(2);
  };

  const handleClose = () => {
    setActiveStep(0);
    setResult(null);
    setLiked(null);
    setInstanceKey('');
    setSection('');  // Reset new fields
    setBuilding('');
  };

  const yesQuick = [
    { label: 'Suppliers', prompt: 'Need suppliers – what type?' },
    { label: 'Painters', prompt: 'Need painters – for what (interior/exterior)?' },
    { label: 'Hire Employees', prompt: 'Need hiring help – what roles?' },
    { label: 'Permits', prompt: 'What permits needed for a salon?' },
    { label: 'Marketing', prompt: 'Low-budget marketing ideas.' },
    { label: 'Vacancy Check', prompt: 'Do I have a confirmed spot in the building?' },  // New: Vacancy probe
  ];

  const noQuick = [
    { label: 'Alternatives', prompt: 'Suggest 2 other businesses for my budget.' },
    { label: 'New Town', prompt: 'Better town for this business?' },
    { label: 'Make It Work', prompt: 'Ways to improve viability here?' },
    { label: 'Mobile Option', prompt: 'Suggest mobile/kiosk if no vacancy.' },  // New
  ];

  const quickQuestions = liked ? yesQuick : noQuick;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <InputForm
          town={town}
          setTown={setTown}
          budget={budget}
          setBudget={setBudget}
          businessType={businessType}
          setBusinessType={setBusinessType}
          section={section}  // New props
          setSection={setSection}
          building={building}
          setBuilding={setBuilding}
          onAnalyze={handleAnalyze}
          loading={loading}
          isNdangani={town.toLowerCase().includes('ndagani') || town.toLowerCase().includes('slaughter')}  // Conditional
        />
      )}

      {/* Coming Soon Modal */}
      <Modal open={!!comingSoonMessage} onClose={() => setComingSoonMessage('')}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h5" gutterBottom>Oops! Coming Soon</Typography>
          <Typography>{comingSoonMessage}</Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => { setComingSoonMessage(''); setActiveStep(0); }}>Back to Home</Button>
          </Box>
        </Box>
      </Modal>

      {/* New: Building Error Modal (e.g., not found or vacancy) */}
      <Modal open={!!buildingErrorMessage} onClose={() => setBuildingErrorMessage('')}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h5" gutterBottom>Location Issue</Typography>
          <Typography>{buildingErrorMessage}</Typography>
          <Typography sx={{ mt: 2 }}>Chat with assistant for alternatives or confirmation.</Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => { setBuildingErrorMessage(''); setActiveStep(0); }}>Back</Button>
          </Box>
        </Box>
      </Modal>

      {activeStep === 1 && result && (
        <>
          <AnalysisResult result={result} />
          <FeedbackButtons onFeedback={handleFeedback} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleClose}>Close & Back to Home</Button>
          </Box>
        </>
      )}

      {activeStep === 2 && result && (
        <>
          <ChatInterface originalResult={result} quickQuestions={quickQuestions} instanceKey={instanceKey} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleClose}>Close Chat & Back to Home</Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </>
      )}
    </Container>
  );
}