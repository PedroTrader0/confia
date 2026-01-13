import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

// Always initialize the client with the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReceipt = async (base64Image: string): Promise<Partial<Transaction> | null> => {
  try {
    const model = 'gemini-3-pro-preview';
    const prompt = `
      Analyze this receipt/invoice image. Extract the following information:
      - total_amount
      - date (YYYY-MM-DD)
      - description (e.g., merchant name)
      - category (suggest one: Alimentação, Transporte, Serviços, Compras, Outros)
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total_amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["total_amount", "date", "description"]
        }
      }
    });

    // response.text is a getter that returns string | undefined. 
    // With responseSchema, the model usually respects the JSON structure.
    const text = response.text || '{}';
    const data = JSON.parse(text);

    return {
      amount: data.total_amount,
      date: data.date,
      description: data.description,
      category: data.category || 'Outros',
      type: 'expense' // Usually receipts are expenses
    };

  } catch (error) {
    console.error("Error analyzing receipt:", error);
    return null;
  }
};

export const chatWithFinanceAI = async (message: string, contextData: string): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const systemInstruction = `
      Você é um assistente financeiro especialista do sistema CONFIA.
      Ajude o usuário com dúvidas sobre finanças, economia e gestão empresarial.
      
      Aqui está um resumo dos dados atuais do usuário (apenas para contexto, não compartilhe dados sensíveis sem necessidade):
      ${contextData}
      
      Responda de forma curta, profissional e amigável, em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
      }
    });

    return response.text || "Não consegui gerar uma resposta no momento.";

  } catch (error) {
    console.error("Error in AI chat:", error);
    return "Ocorreu um erro ao processar sua pergunta. Verifique se a chave da API está configurada.";
  }
};