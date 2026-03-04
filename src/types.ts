
export interface Anecdote {
  id: string;
  studentName: string;
  birthDate?: string; // Format: YYYY-MM-DD
  age: number;
  content: string;
  date: string; // Tanggal Kejadian (ISO format: YYYY-MM-DD)
  context?: string;      
  reflection?: string;   
  analysis?: string;
  developmentStatus?: 'Sesuai Usia' | 'Luar Biasa' | 'Perlu Bimbingan'; 
}

export interface GeneratedAnecdote {
  content: string;
  studentName: string;
  age: number;
  analysis: string;
  developmentStatus: 'Sesuai Usia' | 'Luar Biasa' | 'Perlu Bimbingan';
}
