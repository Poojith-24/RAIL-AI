import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Page1Home } from './components/Page1Home';
import { Page2Result } from './components/Page2Result';
import { InfoModal } from './components/InfoModal';
import { fetchPNRPrediction, fetchProviderStatus, fetchSamplePNRs } from './services/api';
import { PredictionResult, ProviderStatus, SamplePNR } from './types';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

function MainApp() {
  const [page, setPage] = useState<1 | 2>(1);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [samplePnrs, setSamplePnrs] = useState<SamplePNR[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [modalType, setModalType] = useState<'about' | 'how-it-works' | null>(null);

  // Initial load
  useEffect(() => {
    fetchProviderStatus()
      .then(setProviderStatus)
      .catch((err) => console.error('Provider status fetch error:', err));

    fetchSamplePNRs()
      .then(setSamplePnrs)
      .catch((err) => console.error('Sample PNR fetch error:', err));
  }, []);

  const handlePredict = async (pnr: string) => {
    setIsLoading(true);
    setSearchError(null);

    try {
      // Simulate realistic analysis time
      const [res] = await Promise.all([
        fetchPNRPrediction(pnr),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);
      setCurrentPrediction(res);
      setPage(2);
    } catch (err: any) {
      setSearchError(err.message || 'Failed to retrieve PNR prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setPage(1);
    setSearchError(null);
  };

  const handleCheckAnother = () => {
    setPage(1);
    setSearchError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      page === 1 ? 'bg-[#0B0E23] text-white' : 'bg-[#F4F6FC] text-slate-900'
    }`}>
      {/* Top Header */}
      <Header
        page={page}
        onNavigateHome={() => setPage(1)}
        onOpenAbout={() => setModalType('about')}
        onOpenHowItWorks={() => setModalType('how-it-works')}
        dataSourceMode={providerStatus?.dataSourceMode || 'DEMO'}
      />

      {/* Main View Router: Page 1 (Home/Input) or Page 2 (Prediction Result) */}
      <main className="w-full">
        {page === 1 ? (
          <Page1Home
            onPredict={handlePredict}
            isLoading={isLoading}
            searchError={searchError}
          />
        ) : currentPrediction ? (
          <Page2Result
            prediction={currentPrediction}
            onBack={handleBack}
            onCheckAnother={handleCheckAnother}
          />
        ) : (
          <Page1Home
            onPredict={handlePredict}
            isLoading={isLoading}
            searchError={searchError}
          />
        )}
      </main>

      {/* About & How it Works Modal */}
      <InfoModal
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        type={modalType || 'about'}
      />
    </div>
  );
}
