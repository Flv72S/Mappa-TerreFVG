import React, { useState, useMemo, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import CompanyList from './components/CompanyList';
import CompanyCard from './components/CompanyCard';
import AIConcierge from './components/AIConcierge';
import { Company } from './types';
import { COMPANIES as STATIC_COMPANIES } from './constants';

const App: React.FC = () => {
  // Main data state
  const [companies, setCompanies] = useState<Company[]>(STATIC_COMPANIES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // UI States
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(window.innerWidth > 768);

  // DYNAMIC DATA FETCHING
  // This effect attempts to load data from a JSON/PHP endpoint on your server.
  // Ideally, your PHP script converts the Excel file into a JSON accessible at '/api/companies.json'
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace this URL with the actual path to your PHP script or JSON file
        // e.g. 'https://mappa.terrefvg.it/api/get_companies.php'
        const response = await fetch('/data/companies.json'); 
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: Company[] = await response.json();
        
        // Basic validation to ensure data structure matches
        if (Array.isArray(data) && data.length > 0 && data[0].id) {
          console.log("Dati caricati con successo dal server remoto");
          setCompanies(data);
        }
      } catch (error) {
        console.warn("Impossibile caricare dati remoti, utilizzo dati statici di fallback.", error);
        // Fallback is already set in initial state (STATIC_COMPANIES), so we just stop loading.
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Handle window resize to auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsListOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter companies based on selected category
  const filteredCompanies = useMemo(() => {
    const sourceData = companies; // Use the dynamic state, not the constant
    if (selectedCategory === 'Tutte') {
      return sourceData;
    }
    return sourceData.filter(c => c.category === selectedCategory);
  }, [selectedCategory, companies]);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleCloseDetail = () => {
    setSelectedCompany(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (selectedCompany && category !== 'Tutte' && selectedCompany.category !== category) {
      setSelectedCompany(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-gray-100 font-sans">
      
      {/* MOBILE HEADER - Modern Navigation Bar */}
      <header className="md:hidden h-14 bg-white shadow-md z-30 flex justify-between items-center px-4 shrink-0 relative">
        <button 
          onClick={() => setIsListOpen(true)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
          aria-label="Apri lista aziende"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <h1 className="font-bold text-lg tracking-tight text-terrefvg-dark absolute left-1/2 transform -translate-x-1/2">
          Terre<span className="text-terrefvg-gold">FVG</span>
        </h1>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="p-2 -mr-2 text-terrefvg-green hover:bg-green-50 rounded-full transition"
            aria-label="Apri Concierge AI"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </button>
        </div>
      </header>

      {/* Sidebar List */}
      <CompanyList 
          companies={filteredCompanies} 
          onSelectCompany={handleSelectCompany}
          selectedId={selectedCompany?.id}
          isOpen={isListOpen}
          toggleOpen={() => setIsListOpen(!isListOpen)}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
      />

      {/* Main Map Area */}
      <div className="flex-1 relative h-full w-full overflow-hidden">
        <MapComponent 
          companies={filteredCompanies} 
          onSelectCompany={handleSelectCompany} 
          selectedCompanyId={selectedCompany?.id}
        />

        {/* Loading Indicator (Optional) */}
        {isLoadingData && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-50 flex items-center gap-2 text-xs font-medium text-gray-500">
             <span className="w-2 h-2 bg-terrefvg-green rounded-full animate-pulse"></span>
             Aggiornamento mappa...
          </div>
        )}

        {/* Company Detail Overlay */}
        {selectedCompany && (
          <CompanyCard 
            company={selectedCompany} 
            onClose={handleCloseDetail} 
          />
        )}

        {/* AI Concierge Overlay */}
        <AIConcierge 
          companies={companies} // Pass the full list to AI context
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          selectedCompany={selectedCompany} 
        />

        {/* Desktop Floating Action Buttons */}
        <div className="hidden md:flex absolute bottom-6 right-4 flex-col gap-3 z-10">
          {!isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-terrefvg-gold hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center group"
              title="Chiedi al Concierge AI"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <span className="absolute right-full mr-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"> Concierge AI</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;