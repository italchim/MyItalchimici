import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from '../types';

// A placeholder for the API key that will be replaced by the CI/CD pipeline.
const ai = new GoogleGenAI({ apiKey: "%%GEMINI_API_KEY%%" });

export async function getAiResponse(documentContent: string, userQuery: string, history: ChatMessage[]): Promise<string> {
  // In a production deployment, the mock logic is no longer needed.
  // The container is configured to fail on startup if the API_KEY is not provided.
  try {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `Sei un assistente esperto per l'azienda Italchimici. Il tuo compito è rispondere alle domande degli utenti basandoti *esclusivamente* sul contenuto del documento interno fornito. Se la risposta non si trova nel documento, dichiara che non riesci a trovare l'informazione nel contesto fornito. Sii conciso e disponibile.

CONTENUTO DEL DOCUMENTO:
---
${documentContent}
---
`;
    
    // Convert history to Gemini's format.
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: userQuery }] });


    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error.message.includes("API key not valid")) {
        return "Errore di configurazione: La chiave API per il servizio AI non è valida. Contatta il reparto IT per assistenza.";
    }
    return "Spiacente, ho riscontrato un errore durante l'elaborazione della tua richiesta. Riprova più tardi.";
  }
}

export async function getGlobalAiResponse(userQuery: string, context: string, history: ChatMessage[]): Promise<string> {
  try {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `Sei "My.Italchimici Assistant", un assistente AI aziendale amichevole e disponibile per i dipendenti di Italchimici.
Il tuo compito è rispondere alle domande degli utenti basandoti *esclusivamente* sulle informazioni fornite nel CONTESTO AZIENDALE.
Il contesto contiene notizie, procedure, eventi del calendario e post del forum.
Quando rispondi, sii conciso, chiaro e professionale.
Se la risposta non si trova nel contesto, rispondi educatamente che non hai accesso a quell'informazione.
Non inventare informazioni. Fai riferimento ai documenti o alle notizie quando è pertinente (es. "Secondo la procedura X...", "Come annunciato nella notizia Y...").

CONTESTO AZIENDALE:
---
${context}
---
`;

    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: userQuery }] });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for global assistant:", error);
    if (error.message.includes("API key not valid")) {
        return "Errore di configurazione: La chiave API per il servizio AI non è valida. Contatta il reparto IT per assistenza.";
    }
    return "Spiacente, ho riscontrato un errore. Potresti riprovare?";
  }
}
