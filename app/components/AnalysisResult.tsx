// app/components/AnalysisResult.tsx
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ApiResponse } from '../types';

interface Props {
  result: ApiResponse;
}

export default function AnalysisResult({ result }: Props) {
  const scoreColor = result.viability_score >= 60 ? 'green' : 'orange';

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color={scoreColor}>
            Viability Score: {result.viability_score}% {result.viability_score >= 60 ? '✅' : '⚠️'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{result.summary}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Reasoning</AccordionSummary>
        <AccordionDetails>
          <ul>
            {result.reasoning.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Recommendations</AccordionSummary>
        <AccordionDetails>
          <ol>
            {result.recommendations.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </AccordionDetails>
      </Accordion>

      {result.alternatives.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Alternatives</AccordionSummary>
          <AccordionDetails>
            <ul>
              {result.alternatives.map((alt, i) => (
                <li key={i}><strong>{alt.business}:</strong> {alt.why}</li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      )}

      {result.security_actions.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Security Mitigations</AccordionSummary>
          <AccordionDetails>
            <ul>
              {result.security_actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      )}

      {result.confidence_note && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Confidence Note</AccordionSummary>
          <AccordionDetails>
            <Typography fontStyle="italic">{result.confidence_note}</Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}