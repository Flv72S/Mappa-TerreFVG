import React, { useState, useRef, useEffect } from 'react';
import { Company, ChatMessage } from '../types';
import { getConciergeResponse } from '../services/geminiService';

interface AIConciergeProps {
  companies: Company[];
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: Company | null;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ companies, isOpen, onClose, selectedCompany }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Benvenuto in TerreFVG! 👋 Sono il tuo Concierge virtuale.\n\nPosso creare percorsi personalizzati per te. Dimmi cosa ti piace o scegli un suggerimento qui sotto!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation not available:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyText = messages.map(m => `${m.role === 'user' ? 'Utente' : 'Concierge'}: ${m.text}`).join('\n');
    
    // Pass context to service
    const responseText = await getConciergeResponse(
      userMsg.text, 
      companies, 
      historyText,
      userLocation,
      selectedCompany
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  // Define quick actions based on context
  // These queries are engineered to trigger the "Itinerary Mode" in the Gemini System Instruction
  const quickActions = [
    { label: '🍷 Tour Vini', query: 'Crea un itinerario di mezza giornata per visitare le migliori Cantine della zona. Visualizza le tappe.' },
    { label: '🧀 Tour Sapori', query: 'Vorrei un percorso enogastronomico che includa Produttori locali e un Agriturismo per mangiare.' },
  ];

  if (selectedCompany) {
    quickActions.unshift({ 
      label: `📍 Da ${selectedCompany.name}...`, 
      query: `Mi trovo da ${selectedCompany.name}. Crea un itinerario logico per il resto della giornata visitando altre aziende vicine.` 
    });
  } else if (userLocation) {
    quickActions.unshift({
      label: '📍 Vicino a me',
      query: 'Basandoti sulla mia posizione attuale, crea un mini-tour delle aziende più vicine a me adesso.'
    });
  }

  return (
    <div className="absolute top-0 right-0 w-full h-full md:w-96 md:h-auto md:top-4 md:right-4 md:bottom-4 md:rounded-xl bg-white shadow-2xl z-30 flex flex-col border border-gray-200 overflow-hidden font-sans animate-fadeIn">
      
      {/* Header */}
      <div className="bg-terrefvg-green p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <h3 className="font-bold">Concierge AI</h3>
            <p className="text-xs text-green-100">Itinerari & Info</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-terrefvg-light space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
              msg.role === 'user' 
                ? 'bg-terrefvg-green text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Input */}
      <div className="bg-white border-t border-gray-100 shrink-0">
        
        {/* Chips */}
        {!isLoading && (
          <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action.query)}
                className="whitespace-nowrap shrink-0 bg-white text-terrefvg-green border border-terrefvg-green/40 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-terrefvg-green hover:text-white transition shadow-sm"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 pt-0">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-terrefvg-green focus:ring-1 focus:ring-terrefvg-green text-sm"
              placeholder="Chiedi un itinerario..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-terrefvg-green text-white p-2 rounded-full hover:bg-terrefvg-dark disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;