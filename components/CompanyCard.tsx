
import React from 'react';
import { Company, DayOfWeek } from '../types';

interface CompanyCardProps {
  company: Company;
  onClose: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex text-terrefvg-gold">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star} 
          className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-gray-300 fill-current'}`} 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClose }) => {
  const dayLabels: Record<DayOfWeek, string> = {
    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica'
  };

  const daysOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-20 flex flex-col animate-fadeIn md:max-w-md md:h-auto md:top-4 md:left-4 md:rounded-xl md:shadow-2xl md:max-h-[90vh] overflow-hidden">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20"> {/* pb-20 adds space for the sticky button */}
        
        {/* Header Image */}
        <div className="relative h-48 md:h-56 bg-gray-200">
          <img 
            src={company.imageUrl} 
            alt={company.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 transition shadow-sm z-10"
            aria-label="Chiudi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="bg-terrefvg-gold text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                  {company.category}
                </span>
                <h2 className="text-white text-2xl font-bold mt-1 drop-shadow-md leading-tight">{company.name}</h2>
              </div>
              
              {/* Social Icons Overlay */}
              {company.socials && (
                <div className="flex gap-3 mb-1">
                  {company.socials.facebook && (
                    <a href={company.socials.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 transition">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                  )}
                  {company.socials.instagram && (
                    <a href={company.socials.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-pink-400 transition">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 bg-white space-y-6">
          
          {/* Description */}
          <div>
            <h3 className="text-terrefvg-green font-semibold uppercase text-sm tracking-wide mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Chi Siamo
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">{company.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
             <div>
                <h3 className="text-terrefvg-green font-semibold uppercase text-xs tracking-wide mb-2">I Nostri Prodotti</h3>
                <ul className="space-y-1">
                  {company.products.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-terrefvg-gold"></span> {p}
                    </li>
                  ))}
                </ul>
             </div>
             <div>
                <h3 className="text-terrefvg-green font-semibold uppercase text-xs tracking-wide mb-2">Servizi</h3>
                <ul className="space-y-1">
                  {company.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-terrefvg-green"></span> {f}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* Opening Hours Section */}
          {company.openingHours && (
            <div>
              <h3 className="text-terrefvg-green font-semibold uppercase text-sm tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Orari di Apertura
              </h3>
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                {daysOrder.map((day) => {
                  const hours = company.openingHours?.[day] || 'Chiuso';
                  return (
                    <div key={day} className="flex justify-between items-center px-4 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 text-sm">
                      <span className="font-medium text-gray-600 w-24">{dayLabels[day]}</span>
                      <span className={`text-right ${hours === 'Chiuso' ? 'text-red-400 italic' : 'text-gray-800'}`}>
                        {hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery (If present) */}
          {company.gallery && company.gallery.length > 0 && (
            <div>
              <h3 className="text-terrefvg-green font-semibold uppercase text-sm tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Galleria
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {company.gallery.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`${company.name} gallery ${idx + 1}`} 
                    className={`rounded-lg object-cover w-full h-24 hover:opacity-90 transition ${idx === 2 ? 'col-span-2 h-32' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
             <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-terrefvg-green mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm text-gray-600">{company.address}</span>
             </div>
             {company.phone && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-terrefvg-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <a href={`tel:${company.phone}`} className="text-sm text-gray-600 hover:text-terrefvg-green">{company.phone}</a>
                </div>
             )}
             {company.website && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-terrefvg-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-terrefvg-green truncate">Visita il sito web</a>
                </div>
             )}
          </div>

          {/* Reviews Section */}
          <div className="pt-4 border-t border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-terrefvg-green font-semibold uppercase text-sm tracking-wide">Recensioni</h3>
                <span className="text-xs text-gray-400 font-normal underline cursor-pointer hover:text-terrefvg-green">Scrivi una recensione</span>
             </div>
             
             <div className="space-y-4">
                {company.reviews && company.reviews.length > 0 ? (
                  company.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-gray-800">{review.author}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-xs text-gray-600 italic">"{review.text}"</p>
                      <p className="text-[10px] text-gray-400 mt-1 text-right">{review.date}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic text-center py-2">Nessuna recensione presente.</p>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <a 
          href={company.bookingUrl || `mailto:${company.email || ''}`}
          className="flex-1 bg-terrefvg-red text-white py-3 rounded-lg font-bold text-center hover:bg-red-900 transition shadow-lg flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          PRENOTA ORA
        </a>
      </div>
    </div>
  );
};

export default CompanyCard;
