
import React, { useState, useEffect } from 'react';
import { Anecdote } from '../types';
import { analyzeSpecificAnecdote } from '../geminiService';
import { calculateAge, CLASS_ROSTER } from '../App';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (anecdote: Omit<Anecdote, 'id'>) => void;
  initialData?: Anecdote;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    birthDate: '',
    occurrenceDate: new Date().toISOString().split('T')[0], // Default hari ini
    age: 0,
    content: '',
    reflection: '',
    analysis: '',
    developmentStatus: 'Sesuai Usia' as any
  });

  // Isi form jika sedang mode edit
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        studentName: initialData.studentName,
        birthDate: initialData.birthDate || '',
        occurrenceDate: initialData.date,
        age: initialData.age,
        content: initialData.content,
        reflection: initialData.reflection || '',
        analysis: initialData.analysis || '',
        developmentStatus: initialData.developmentStatus || 'Sesuai Usia'
      });
    } else if (!initialData && isOpen) {
      setFormData({
        studentName: '',
        birthDate: '',
        occurrenceDate: new Date().toISOString().split('T')[0],
        age: 0,
        content: '',
        reflection: '',
        analysis: '',
        developmentStatus: 'Sesuai Usia'
      });
    }
  }, [initialData, isOpen]);

  const handleNameChange = (name: string) => {
    const student = CLASS_ROSTER.find(s => s.name === name);
    if (student) {
      const age = calculateAge(student.birthDate);
      setFormData(prev => ({ 
        ...prev, 
        studentName: name, 
        birthDate: student.birthDate,
        age: age
      }));
    } else {
      setFormData(prev => ({ ...prev, studentName: name }));
    }
  };

  useEffect(() => {
    if (formData.birthDate) {
      const age = calculateAge(formData.birthDate);
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.birthDate]);

  if (!isOpen) return null;

  const handleAIAnalysis = async () => {
    if (!formData.content) return alert("Tulis dulu ceritanya ya Bu.");
    setIsAnalyzing(true);
    try {
      const res = await analyzeSpecificAnecdote(formData.studentName || 'Siswa', formData.age, formData.content);
      setFormData(prev => ({ 
        ...prev, 
        analysis: res.analysis,
        developmentStatus: res.status 
      }));
    } catch (e) {
      alert("Gagal menganalisis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = [];
    if (!formData.studentName) errors.push("Nama Siswa");
    if (!formData.birthDate) errors.push("Tanggal Lahir");
    if (!formData.content) errors.push("Isi Cerita");
    if (!formData.occurrenceDate) errors.push("Tanggal Kejadian");

    if (errors.length > 0) {
      return alert(`Mohon lengkapi data berikut: \n- ${errors.join('\n- ')}`);
    }

    // Konversi ke format Anecdote
    const { occurrenceDate, ...rest } = formData;
    onSubmit({
      ...rest,
      date: occurrenceDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-100">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800 comic-font">
            {initialData ? '✏️ Ubah Observasi' : '📝 Catatan Observasi'}
          </h2>
          <button onClick={onClose} className="bg-gray-100 p-2.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
             </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Nama Siswa <span className="text-rose-500">*</span>
              </label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-200 outline-none font-bold appearance-none cursor-pointer"
                value={formData.studentName}
                onChange={e => handleNameChange(e.target.value)}
              >
                <option value="">-- Pilih Siswa --</option>
                {CLASS_ROSTER.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Tanggal Kejadian <span className="text-rose-500">*</span>
              </label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-200 outline-none font-medium text-sm"
                value={formData.occurrenceDate}
                onChange={e => setFormData({...formData, occurrenceDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Cerita Kejadian <span className="text-rose-500">*</span>
            </label>
            <textarea 
              rows={4}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-sky-200 outline-none text-[15px] leading-relaxed"
              placeholder="Tuliskan kejadian aslinya di sini..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            ></textarea>
          </div>

          <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-1">
                📌 Analisis Perkembangan & Status
              </label>
              <button 
                type="button"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="text-[10px] bg-emerald-600 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menganalisis...
                  </span>
                ) : 'Dapatkan Analisis AI'}
              </button>
            </div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {['Sesuai Usia', 'Luar Biasa', 'Perlu Bimbingan'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({...formData, developmentStatus: s as any})}
                  className={`whitespace-nowrap text-[9px] px-4 py-2 rounded-xl font-bold border transition-all ${formData.developmentStatus === s ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <textarea 
              rows={3}
              className="w-full bg-transparent border-none outline-none text-[13px] text-emerald-900 placeholder-emerald-300 italic leading-relaxed"
              placeholder="Analisis pedagogi otomatis akan muncul di sini..."
              value={formData.analysis}
              onChange={e => setFormData({...formData, analysis: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-4.5 bg-gray-900 text-white font-bold rounded-[1.5rem] shadow-xl hover:bg-black transition-all active:scale-[0.98] text-sm"
          >
            {initialData ? 'Simpan Perubahan' : 'Simpan ke Portofolio'}
          </button>
        </form>
      </div>
    </div>
  );
};
