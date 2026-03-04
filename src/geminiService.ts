
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedAnecdote } from "./types";

const API_KEY = process.env.API_KEY || "";

const SYSTEM_INSTRUCTION = `Anda adalah pakar psikologi anak dan asisten guru SD Kelas 1.
Tugas Anda:
1. Membuat cerita anekdot menarik tentang perilaku siswa usia 6-7 tahun di sekolah.
2. Memberikan ANALISIS PERKEMBANGAN singkat (1-2 kalimat).
3. Memberikan status perkembangan: 
   - 'Sesuai Usia': Jika perilaku normal untuk anak 6-7 tahun.
   - 'Luar Biasa': Jika menunjukkan empati atau logika di atas rata-rata usianya.
   - 'Perlu Bimbingan': Jika perilaku menunjukkan hambatan atau butuh perhatian guru.
Gunakan bahasa Indonesia yang mendukung dan profesional.`;

export const generateStudentAnecdotes = async (prompt: string): Promise<GeneratedAnecdote[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            studentName: { type: Type.STRING },
            age: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            developmentStatus: { 
              type: Type.STRING, 
              description: "Status: 'Sesuai Usia', 'Luar Biasa', atau 'Perlu Bimbingan'" 
            }
          },
          required: ["content", "studentName", "age", "analysis", "developmentStatus"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return [];
  }
};

export const analyzeSpecificAnecdote = async (name: string, age: number, content: string): Promise<{analysis: string, status: any}> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Berikan analisis perkembangan dan status ('Sesuai Usia'/'Luar Biasa'/'Perlu Bimbingan') untuk: ${name}, ${age}th: ${content}`,
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          status: { type: Type.STRING }
        },
        required: ["analysis", "status"]
      }
    }
  });
  
  try {
    const res = JSON.parse(response.text.trim());
    return res;
  } catch (e) {
    return { analysis: response.text || "Gagal analisis", status: "Sesuai Usia" };
  }
};
