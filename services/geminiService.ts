import { GoogleGenAI } from "@google/genai";
import { Vendor, Contract, Incident, RiskLevel } from '../types';

// In a real app, strict error handling for missing keys is needed.
// For this mock, we assume the environment variable is injected.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export interface AIAnalysisResult {
  summary: string;
  riskFactors: string[];
  recommendation: string;
  suggestedRiskLevel: RiskLevel;
}

export const analyzeVendorRisk = async (
  vendor: Vendor,
  contracts: Contract[],
  incidents: Incident[]
): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    // Fallback if no API key is present for demo purposes
    return {
      summary: "AI Analysis unavailable (Missing API Key). Simulating analysis: Vendor shows mixed signals based on recent data.",
      riskFactors: ["Manual review required", "Data completeness check needed"],
      recommendation: "Proceed with caution until API key is configured.",
      suggestedRiskLevel: RiskLevel.MEDIUM
    };
  }

  try {
    const prompt = `
      Act as a Senior Third-Party Risk Analyst. Analyze the following vendor profile and provide a risk assessment.
      
      Vendor: ${vendor.name} (${vendor.category})
      Description: ${vendor.description}
      Current Risk Score: ${vendor.riskScore}/100
      
      Contracts: ${contracts.length} active contracts. Total Value: $${contracts.reduce((acc, c) => acc + c.value, 0)}.
      Incidents: ${incidents.length} recorded incidents. 
      ${incidents.map(i => `- [${i.severity}] ${i.title}: ${i.description}`).join('\n')}

      Return a JSON response with the following structure:
      {
        "summary": "A concise executive summary of the risk profile (max 50 words).",
        "riskFactors": ["List of specific risk factors identified"],
        "recommendation": "Actionable advice for the procurement team.",
        "suggestedRiskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Failed to generate AI analysis.",
      riskFactors: ["System Error"],
      recommendation: "Please review manually.",
      suggestedRiskLevel: RiskLevel.MEDIUM
    };
  }
};
