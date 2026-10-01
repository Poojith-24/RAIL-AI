import {
  PredictionResult,
  SamplePNR,
  ProviderStatus,
  CentralTrainClassInfo
} from '../types';

export async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || 'unknown content type';
  const responseText = await response.text();
  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch {
    const excerpt = responseText.slice(0, 200);
    throw new Error(
      `Expected a JSON API response, but received HTTP ${response.status} ${response.statusText} (${contentType}): ${excerpt || 'empty response'}`
    );
  }

  if (!contentType.toLowerCase().includes('application/json') &&
      !contentType.toLowerCase().includes('+json')) {
    throw new Error(
      `Expected a JSON API response, but received HTTP ${response.status} ${response.statusText} (${contentType}).`
    );
  }

  if (!response.ok) {
    const apiError = data && typeof data === 'object' && 'error' in data
      ? String(data.error)
      : `API request failed with HTTP ${response.status} ${response.statusText}`;
    throw new Error(apiError);
  }

  return data as T;
}

export async function fetchPNRPrediction(pnr: string, forceDemo = false): Promise<PredictionResult> {
  const res = await fetch('/api/pnr/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pnr, forceDemo })
  });

  return readJsonResponse<PredictionResult>(res);
}

export async function fetchSamplePNRs(): Promise<SamplePNR[]> {
  const res = await fetch('/api/pnr/samples');
  return readJsonResponse<SamplePNR[]>(res);
}

export async function fetchProviderStatus(): Promise<ProviderStatus> {
  const res = await fetch('/api/provider/status');
  return readJsonResponse<ProviderStatus>(res);
}

export async function fetchTrainClasses(
  trainNumber: string,
  trainName = '',
  travelClass = ''
): Promise<CentralTrainClassInfo> {
  const params = new URLSearchParams();
  if (trainName) params.append('trainName', trainName);
  if (travelClass) params.append('class', travelClass);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/trains/${encodeURIComponent(trainNumber)}/classes${query}`);
  return readJsonResponse<CentralTrainClassInfo>(res);
}
