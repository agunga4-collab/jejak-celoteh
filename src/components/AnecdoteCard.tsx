
import React, { useState } from 'react';
import { Anecdote } from '../types';

interface AnecdoteCardProps {
  anecdote: Anecdote;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}

export const AnecdoteCard: React.FC<AnecdoteCardProps> = ({ anecdote, onEdit, onDelete }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'Luar Biasa': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Perlu Bimbingan': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const copyToClipboard = () => {
    const text = `LAPORAN PERKEMBANGAN\nSiswa: ${anecdote.studentName} (${anecdote.age} thn)\nTanggal: ${formatDate(anecdote.date)}\nStatus: ${anecdote.developmentStatus}\nKejadian: ${anecdote.content}\nAnalisis: ${anecdote.analysis || '-'}`;
    navigator.clipboard.writeText(text);
    alert('Catatan & Analisis disalin!');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-sky-100">
            {anecdote.studentName[0]}
          </div>
          <span className="text-sm font-bold text-gray-800">{anecdote.studentName}</span>
        </div>
        <span className="text-[11px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg">
          {formatDate(anecdote.date)}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
          Usia: {anecdote.age} Tahun
        </span>
        {anecdote.developmentStatus && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusColor(anecdote.developmentStatus)}`}>
            {anecdote.developmentStatus}
          </span>
        )}
      </div>
      
      <p className="text-gray-700 text-[15px] mb-6 italic leading-relaxed whitespace-pre-wrap flex-grow">
        "{anecdote.content}"
      </p>

      {anecdote.analysis && (
        <div className={`transition-all duration-300 overflow-hidden ${showAnalysis ? 'max-h-60 mb-4' : 'max-h-0'}`}>
          <div className="bg-emerald-50 p-4 rounded-2xl text-[12px] text-emerald-800 border border-emerald-100 leading-relaxed shadow-inner">
            <span className="font-bold block mb-1">📈 Analisis Perkembangan:</span>
            {anecdote.analysis}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end mt-auto pt-5 border-t border-gray-50 gap-1">
        <button 
          onClick={() => setShowAnalysis(!showAnalysis)}
          className={`p-2.5 rounded-xl transition-all ${showAnalysis ? 'text-emerald-500 bg-emerald-50 scale-110' : 'text-gray-400 hover:text-emerald-500 hover:bg-gray-50'}`}
          title="Lihat Analisis"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
        <button 
          onClick={onEdit}
          className="p-2.5 text-gray-400 hover:text-amber-500 hover:bg-gray-50 rounded-xl transition-all"
          title="Ubah Catatan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          onClick={copyToClipboard}
          className="p-2.5 text-gray-400 hover:text-sky-500 hover:bg-gray-50 rounded-xl transition-all"
          title="Salin"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
        <button 
          onClick={() => onDelete?.(anecdote.id)}
          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-gray-50 rounded-xl transition-all"
          title="Hapus"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
