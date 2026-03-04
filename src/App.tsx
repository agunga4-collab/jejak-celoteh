
import React, { useState } from 'react';
import { Anecdote } from './types';
import { generateStudentAnecdotes } from './geminiService';
import { AnecdoteCard } from './components/AnecdoteCard';
import { ManualEntryModal } from './components/ManualEntryModal';
import { ClassTable } from './components/ClassTable';

export const CLASS_ROSTER = [
  { name: 'Abid', birthDate: '2018-05-12' }, { name: 'Anis', birthDate: '2018-02-20' }, 
  { name: 'Budi', birthDate: '2017-11-05' }, { name: 'Beni', birthDate: '2017-09-15' }, 
  { name: 'Caca', birthDate: '2018-01-30' }, { name: 'Citra', birthDate: '2018-03-12' }, 
  { name: 'Dedi', birthDate: '2017-08-22' }, { name: 'Elga', birthDate: '2018-06-01' }, 
  { name: 'Fandi', birthDate: '2018-04-10' }, { name: 'Gita', birthDate: '2018-02-28' }, 
  { name: 'Hana', birthDate: '2017-12-12' }, { name: 'Indra', birthDate: '2018-07-05' }, 
  { name: 'Jaka', birthDate: '2018-03-25' }, { name: 'Kiki', birthDate: '2018-01-10' }, 
  { name: 'Lani', birthDate: '2017-10-20' }, { name: 'Maya', birthDate: '2018-08-14' }, 
  { name: 'Nanda', birthDate: '2018-05-05' }, { name: 'Omar', birthDate: '2017-11-28' }, 
  { name: 'Putri', birthDate: '2018-02-14' }, { name: 'Qori', birthDate: '2018-04-20' }, 
  { name: 'Raka', birthDate: '2018-06-30' }, { name: 'Siti', birthDate: '2017-09-09' }, 
  { name: 'Tio', birthDate: '2018-01-01' }, { name: 'Ulfa', birthDate: '2018-03-03' }, 
  { name: 'Vina', birthDate: '2018-07-22' }, { name: 'Wawan', birthDate: '2017-12-31' }, 
  { name: 'Xena', birthDate: '2018-05-20' }, { name: 'Yoga', birthDate: '2018-04-01' }, 
  { name: 'Zaki', birthDate: '2018-02-02' }
];

export const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const INITIAL_ANECDOTES: Anecdote[] = [
  {
    id: '1',
    studentName: 'Fandi',
    birthDate: '2018-04-10',
    age: 6,
    content: 'Fandi menangis saat diberi uang saku kertas 20 ribu. Dia bilang: "Bu Guru, aku mau yang logam aja, yang kertas ringan banget kayak mainan. Yang logam berat, pasti isinya lebih banyak cokelatnya kalau dibeliin."',
    date: '2024-10-15',
    analysis: 'Fandi berada di tahap pra-operasional akhir. Ia masih menilai nilai suatu benda berdasarkan atribut fisiknya (berat/ukuran) daripada nilai nominal abstraknya.',
    developmentStatus: 'Sesuai Usia'
  },
  {
    id: '2',
    studentName: 'Lani',
    birthDate: '2017-10-20',
    age: 7,
    content: 'Saat saya sedang menghela napas panjang setelah mengajar, Lani mendekat dan memberikan permen karet bekasnya (masih dibungkus). "Bu Guru capek ya? Ini permen Lani buat Ibu, biar mulut Ibu goyang terus jadi nggak ngantuk."',
    date: '2024-10-16',
    analysis: 'Lani menunjukkan empati yang luar biasa. Ia mampu mengenali emosi orang lain (lelah) dan memberikan solusi meskipun solusinya masih berdasarkan sudut pandang anak-anak.',
    developmentStatus: 'Luar Biasa'
  }
];

const App: React.FC = () => {
  const [anecdotes, setAnecdotes] = useState<Anecdote[]>(INITIAL_ANECDOTES);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnecdote, setEditingAnecdote] = useState<Anecdote | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const results = await generateStudentAnecdotes("Buatkan 2 contoh anekdot nyata kelas 1 SD (usia 6-7 tahun) beserta analisis perkembangannya yang mendalam.");
      const newEntries: Anecdote[] = results.map((res, i) => ({
        ...res,
        id: Date.now().toString() + i,
        date: new Date().toISOString().split('T')[0]
      }));
      setAnecdotes(prev => [...newEntries, ...prev]);
    } catch (e) {
      alert("Gagal ambil ide AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (data: Omit<Anecdote, 'id'>) => {
    if (editingAnecdote) {
      setAnecdotes(prev => prev.map(item => 
        item.id === editingAnecdote.id 
          ? { ...data, id: editingAnecdote.id } 
          : item
      ));
      setEditingAnecdote(null);
    } else {
      setAnecdotes(prev => [{
        ...data,
        id: Date.now().toString()
      }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (anecdote: Anecdote) => {
    setEditingAnecdote(anecdote);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnecdote(null);
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3 justify-center md:justify-start">
            <span className="bg-gradient-to-br from-emerald-500 to-sky-600 text-white p-2.5 rounded-2xl rotate-2 inline-block shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <span className="gradient-text comic-font">Jejak Celoteh</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            Portofolio Perkembangan & Anekdot Fase A • Kelas 1 SD
          </p>
        </div>

        <div className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl flex gap-1 shadow-inner border border-gray-200/50">
          <button 
            onClick={() => setViewMode('cards')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'cards' ? 'bg-white shadow-md text-sky-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Kartu Cerita
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-white shadow-md text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Rekap Tabel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <button 
          onClick={() => { setEditingAnecdote(null); setIsModalOpen(true); }}
          className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-sky-100 transition-all group"
        >
          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-bold text-gray-800">Catat Observasi</span>
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Dokumentasi Manual</span>
          </div>
        </button>

        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            {isLoading ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <span className="block font-bold text-gray-800">Inspirasi Pedagogi</span>
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Analisis AI Otomatis</span>
          </div>
        </button>
      </div>

      {viewMode === 'cards' ? (
        <div className="space-y-6">
          {anecdotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {anecdotes.map(a => (
                <AnecdoteCard 
                  key={a.id} 
                  anecdote={a} 
                  onEdit={() => handleEdit(a)}
                  onDelete={(id) => setAnecdotes(prev => prev.filter(x => x.id !== id))} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-50 shadow-sm text-gray-300 font-medium">
              Belum ada catatan yang ditemukan.
            </div>
          )}
        </div>
      ) : (
        <ClassTable students={CLASS_ROSTER} anecdotes={anecdotes} />
      )}

      <ManualEntryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit}
        initialData={editingAnecdote || undefined}
      />

      <footer className="mt-20 text-center pb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
          © 2024 Jejak Celoteh • Jurnal Portofolio Guru SD
        </p>
      </footer>
    </div>
  );
};

export default App;
