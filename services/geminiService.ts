import { GoogleGenAI } from "@google/genai";
import { Company } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConciergeResponse = async (
  query: string,
  companies: Company[],
  conversationHistory: string,
  userLocation?: { lat: number; lng: number } | null,
  selectedCompany?: Company | null
) => {
  // We serialize the company data to provide context (Grounding)
  const companiesContext = JSON.stringify(companies.map(c => ({
    name: c.name,
    type: c.category,
    city: c.address, // Simplifying address to act as location identifier
    coordinates: { lat: c.lat, lng: c.lng },
    products: c.products.join(', '),
    features: c.features.join(', '),
    open: c.openingHours ? "Orari disponibili" : "Orari non disponibili"
  })));

  const locationContext = userLocation 
    ? `POSIZIONE UTENTE: Latitudine ${userLocation.lat}, Longitudine ${userLocation.lng}.`
    : "POSIZIONE UTENTE: Non disponibile (l'utente non ha condiviso la geolocalizzazione).";

  const selectionContext = selectedCompany
    ? `CONTESTO VISIVO: L'utente sta guardando la scheda di "${selectedCompany.name}" (${selectedCompany.category}) a ${selectedCompany.address}.`
    : "CONTESTO VISIVO: L'utente è sulla mappa generale.";

  const systemInstruction = `
    Sei il "Concierge TerreFVG", una guida turistica digitale esperta e amichevole del Friuli Venezia Giulia.
    Il tuo compito è creare itinerari enogastronomici logici e dare informazioni sulle aziende.

    DATABASE AZIENDE (Usa SOLO queste):
    ${companiesContext}

    ${locationContext}
    ${selectionContext}

    ---
    
    MODALITÀ ITINERARIO (Se l'utente chiede "percorsi", "tour", "dove andare", "cosa fare"):
    1.  **LOGICA GEOGRAFICA**: Non far saltare l'utente da un capo all'altro della regione. Raggruppa aziende vicine tra loro (basa il calcolo sulle coordinate lat/lng fornite).
    2.  **STRUTTURA VISIVA**: Usa un formato a elenco con frecce per indicare lo spostamento. Esempio:
        📍 TAPPA 1: [Nome Azienda]
        📝 [Cosa fare: es. Degustazione vini]
        
        ⬇️ (Spostamento breve)
        
        📍 TAPPA 2: [Nome Azienda]
        🍴 [Cosa fare: es. Pranzo tipico]
    3.  **VARIETÀ**: Se possibile, alterna le categorie (es. Mattina in Cantina -> Pranzo in Agriturismo -> Pomeriggio dal Produttore).
    4.  **CONTESTO**: Se l'utente ha selezionato un'azienda, quella DEVE essere la prima tappa o il fulcro del tour.

    REGOLE DI COMPORTAMENTO:
    - Rispondi in italiano.
    - Sii sintetico ma invitante.
    - Usa EMOJI per rendere la lettura piacevole (🍷 per vino, 🧀 per cibo, 🚗 per spostamenti).
    - Se l'utente chiede info su un'azienda specifica, fornisci orari (se presenti) e specialità.
    - Non inventare aziende non presenti nella lista. Se non trovi nulla di vicino, dillo onestamente.
  `;

  try {
    // Model 'gemini-2.5-flash' is selected for the Free Tier (High rate limits, low cost/free)
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: `Cronologia chat:\n${conversationHistory}\n\nNuova richiesta utente: ${query}` }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6, 
        maxOutputTokens: 1000, // Enforce limit for Free Tier efficiency
      }
    });

    return response.text || "Mi dispiace, non riesco a elaborare un itinerario al momento. Riprova tra poco.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Specific handling for Free Tier Rate Limits (Status 429)
    if (error.status === 429 || error.toString().includes('429') || error.toString().includes('Quota')) {
      return "⚠️ Il Concierge sta ricevendo troppe richieste (Limite Piano Gratuito). Attendi un minuto e riprova.";
    }

    return "Il Concierge è momentaneamente occupato. Riprova tra qualche istante.";
  }
};