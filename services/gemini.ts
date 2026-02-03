
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const critiqueTradeLogic = async (
  logic: string, 
  stage: string, 
  tradeData: any
) => {
  try {
    const prompt = `
      You are an institutional trading mentor. Critique this trade setup.
      User Stage: ${stage}
      Symbol: ${tradeData.symbol}
      Bias: ${tradeData.bias}
      Entry: ${tradeData.entryPrice}, SL: ${tradeData.stopLoss}, TP: ${tradeData.takeProfit}
      
      User's Logic: "${logic}"

      RULES:
      1. Be Socratic. Ask questions that expose logic gaps.
      2. If logic is emotional ("I feel"), warn them.
      3. If they don't mention liquidity or market sessions, point it out.
      4. Do not tell them what to do.
      5. Keep it professional and institutional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The mentor is currently unavailable. Review your rules: Is this within your risk limits? Does it follow your primary pattern?";
  }
};

export const evaluateBehavior = async (trades: any[]) => {
  // Logic to analyze a sequence of trades for revenge, overtrading, or discipline
  try {
    const prompt = `
      Analyze these recent trades for behavioral patterns: ${JSON.stringify(trades)}
      Identify: Revenge trading, Overtrading, Patience level, Rule adherence.
      Output a brief, stern but constructive behavioral summary.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text;
  } catch (e) {
    return "Stay focused on the process.";
  }
};
