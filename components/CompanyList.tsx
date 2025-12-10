import React, { useEffect, useState } from 'react';
import { Company, DayOfWeek } from '../types';

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  selectedId?: string;
  isOpen: boolean;
  toggleOpen: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Utility to check if company is currently open
const isCompanyOpen = (company: Company): boolean => {
  if (!company.openingHours) return false;

  const now = new Date();
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()];
  
  const hoursString = company.openingHours[currentDay];
  if (!hoursString || hoursString.toLowerCase() === 'chiuso') return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Handle multiple ranges like "09:00-12:00, 15:00-19:00"
  const ranges = hoursString.split(',').map(s => s.trim());

  return ranges.some(range => {
    const [start, end] = range.split('-');
    if (!start || !end) return false;

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const startTotal = startH * 60 + (startM || 0);
    const endTotal = endH * 60 + (endM || 0);

    return currentMinutes >= startTotal && currentMinutes <= endTotal;
  });
};

const CompanyList: React.FC<CompanyListProps> = ({ 
  companies, 
  onSelectCompany, 
  selectedId, 
  isOpen, 
  toggleOpen,
  selectedCategory,
  onSelectCategory
}) => {
  const categories = ['Tutte', 'Cantina', 'Agriturismo', 'Produttore', 'Ristorazione'];
  // Force re-render every minute to update open/close status
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Mobile Backdrop - Closes list when clicking outside */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm transition-opacity"
          onClick={toggleOpen}
        />
      )}

      {/* List Container - Drawer style on Mobile, Sidebar on Desktop */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-80 md:shadow-none md:flex md:flex-col md:z-10
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        
        {/* Header - Visible on Desktop or inside Mobile Drawer */}
        <div className="p-4 bg-terrefvg-dark text-white flex justify-between items-center shadow-md z-20 shrink-0">
          <h1 className="font-bold text-xl tracking-tight">Terre<span className="text-terrefvg-gold">FVG</span></h1>
          {/* Close button for mobile drawer */}
          <button onClick={toggleOpen} className="md:hidden p-1 text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Filter Section */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <label htmlFor="category-select" className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 block">
              Filtra per Categoria
            </label>
            <div className="relative">
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-terrefvg-green focus:ring-1 focus:ring-terrefvg-green transition-colors cursor-pointer text-sm shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto">
          {companies.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-sm">
               Nessuna azienda trovata in questa categoria.
             </div>
          ) : (
            companies.map((company) => {
              const isOpenNow = isCompanyOpen(company);
              return (
                <div 
                  key={company.id}
                  onClick={() => {
                    onSelectCompany(company);
                    if (window.innerWidth < 768) toggleOpen();
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition hover:bg-terrefvg-light ${selectedId === company.id ? 'bg-green-50 border-l-4 border-terrefvg-green' : ''}`}
                >
                  <div className="flex gap-3 relative">
                    {/* Image with Open/Closed Status Indicator */}
                    <div className="relative shrink-0">
                      <img src={company.imageUrl} alt={company.name} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                      <div 
                        title={isOpenNow ? "Aperto adesso" : "Chiuso adesso"}
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${isOpenNow ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{company.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase tracking-wide font-medium">{company.category}</span>
                         <span className={`text-[10px] font-medium ${isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
                           {isOpenNow ? 'Aperto' : 'Chiuso'}
                         </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{company.address}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-200 shrink-0">
            &copy; {new Date().getFullYear()} Rete d'Impresa TerreFVG
        </div>
      </div>
    </>
  );
};

export default CompanyList;