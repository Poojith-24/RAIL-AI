import {
  PredictionResult,
  SamplePNR,
  ProviderStatus
} from '../types';

export async function fetchPNRPrediction(pnr: string, forceDemo = false): Promise<PredictionResult> {
  const res = await fetch('/api/pnr/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pnr, forceDemo })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch prediction');
  }
  return data;
}

export async function fetchSamplePNRs(): Promise<SamplePNR[]> {
  const res = await fetch('/api/pnr/samples');
  if (!res.ok) throw new Error('Failed to load sample PNRs');
  return res.json();
}

export async function fetchProviderStatus(): Promise<ProviderStatus> {
  const res = await fetch('/api/provider/status');
  if (!res.ok) throw new Error('Failed to fetch provider status');
  return res.json();
}
