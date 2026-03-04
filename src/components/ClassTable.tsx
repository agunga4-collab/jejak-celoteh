
import React from 'react';
import { Anecdote } from '../types';
import { calculateAge } from '../App';

interface ClassTableProps {
  students: { name: string; birthDate: string }[];
  anecdotes: Anecdote[];
}

export const ClassTable: React.FC<ClassTableProps> = ({ students, anecdotes }) => {
  const getLatestAnecdote = (name: string) => {
    return anecdotes.find(a => a.studentName.toLowerCase() === name.toLowerCase());
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'Luar Biasa': return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[10px] font-bold">Luar Biasa</span>;
      case 'Perlu Bimbingan': return <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[10px] font-bold">Bimbingan</span>;
      case 'Sesuai Usia': return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[10px] font-bold">Sesuai Usia</span>;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const copyTableToClipboard = () => {
    let header = "No\tNama\tTanggal Lahir\tUsia\tCerita\tAnalisis\tStatus\n";
    let rows = students.map((s, i) => {
      const record = getLatestAnecdote(s.name);
      const age = calculateAge(s.birthDate);
      return `${i + 1}\t${s.name}\t${s.birthDate}\t${age}\t${record?.content || 'Belum ada'}\t${record?.analysis || '-'}\t${record?.developmentStatus || '-'}`;
    }).join('\n');
    
    navigator.clipboard.writeText(header + rows);
    alert('Data tabel berhasil disalin!');
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-800 comic-font">Daftar Pantauan Kelas (29 Siswa)</h2>
          <p className="text-xs text-gray-500">Rekapitulasi Usia & Tanggal Lahir Siswa</p>
        </div>
        <button 
          onClick={copyTableToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Salin ke Excel
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 w-12 text-center">No</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Nama Siswa</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Tgl Lahir</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 w-16 text-center">Usia</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Cerita Terakhir</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 w-28 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const record = getLatestAnecdote(student.name);
              const calculatedAge = calculateAge(student.birthDate);
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors group text-sm">
                  <td className="p-4 text-xs font-bold text-gray-400 border-b border-gray-50 text-center">{index + 1}</td>
                  <td className="p-4 border-b border-gray-50">
                    <span className="font-bold text-gray-700">{student.name}</span>
                  </td>
                  <td className="p-4 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">{formatDate(student.birthDate)}</span>
                  </td>
                  <td className="p-4 border-b border-gray-50 text-center">
                    <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-700 rounded-lg font-bold text-xs">{calculatedAge} Th</span>
                  </td>
                  <td className="p-4 border-b border-gray-50">
                    {record ? (
                      <span className="text-[11px] text-gray-600 line-clamp-1 italic max-w-xs">
                        "{record.content}"
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-300 italic">Belum ada catatan</span>
                    )}
                  </td>
                  <td className="p-4 border-b border-gray-50 text-center">
                    {record ? getStatusBadge(record.developmentStatus) : <span className="text-[10px] text-gray-200">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
