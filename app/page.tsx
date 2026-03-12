'use client';

import { useState, useEffect, useRef } from 'react';

interface IconInfo {
  type: string;
  text: string;
}

interface Song {
  number: string;
  title: string;
  artist: string;
  icons: IconInfo[];
  youtubeUrl?: string | null;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]); // 즐겨찾기 목록 데이터
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'favorite'>('search'); // 화면 모드

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기 로드 시 로컬스토리지에서 즐겨찾기 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('singnow-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("데이터 로드 실패", e);
      }
    }
  }, []);

  // 즐겨찾기 상태가 변할 때마다 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem('singnow-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 실시간 검색 로직
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 600);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const performSearch = async (searchWord: string) => {
    setViewMode('search');
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('검색 오류:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // 즐겨찾기 토글 기능
  const toggleFavorite = (song: Song) => {
    const isAlreadyFav = favorites.some((fav) => fav.number === song.number);
    if (isAlreadyFav) {
      setFavorites(favorites.filter((fav) => fav.number !== song.number));
    } else {
      setFavorites([...favorites, song]);
    }
  };

  // JSON 내보내기
  const exportToJson = () => {
    if (favorites.length === 0) return alert("즐겨찾기 목록이 비어있습니다.");
    const dataStr = JSON.stringify(favorites, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `singnow_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // JSON 불러오기
  const importFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setFavorites(imported);
          alert("목록을 성공적으로 불러왔습니다!");
          setViewMode('favorite');
        }
      } catch (err) {
        alert("올바른 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
  };

  const displayList = viewMode === 'search' ? results : favorites;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans overflow-x-hidden relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      {/* --- 상단 메뉴 토글 버튼 --- */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="absolute top-6 right-6 z-40 p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 text-slate-600 hover:text-blue-600 transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* --- 사이드 메뉴 --- */}
      <div className={`absolute inset-0 z-50 transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <nav className={`absolute top-0 right-0 w-[280px] h-screen bg-white/90 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.05)] p-8 transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-[1000] italic bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent leading-tight py-1 pr-1">
              MENU
            </span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-6">
            <li>
              <button onClick={() => { setViewMode('search'); setIsMenuOpen(false); window.scrollTo(0,0); }} className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-blue-600 transition-all group w-full text-left outline-none">
                <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 text-xl shrink-0"><span className="relative">🔍</span></span>
                <span className="flex-1 flex items-center h-11 pt-1">반주 검색 하기</span>
              </button>
            </li>
            <li>
              <button onClick={() => { setViewMode('favorite'); setIsMenuOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-blue-600 transition-all group w-full text-left outline-none">
                <span className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 text-xl shrink-0 ${viewMode === 'favorite' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'}`}><span className="relative">⭐</span></span>
                <span className="flex-1 flex items-center h-11 pt-1">즐겨찾기 목록</span>
              </button>
            </li>
            <li>
              <button onClick={() => alert("신곡 알림 설정 기능은 아직 준비 중 입니다.")} className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-blue-600 transition-all group w-full text-left outline-none">
                <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 text-xl shrink-0"><span className="relative">🔔</span></span>
                <span className="flex-1 flex items-center h-11 pt-1">신곡 알림 설정</span>
              </button>
            </li>
            <li className="pt-6 border-t border-slate-100">
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Account</p>
              <button className="flex items-center gap-4 text-lg font-bold text-slate-400 hover:text-slate-600 transition-all w-full text-left group outline-none">
                <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-200 transition-all text-xl shrink-0"><span className="relative">👤</span></span>
                <span className="flex-1 flex items-center h-11 pt-1">사용자 설정</span>
              </button>
            </li>
          </ul>

          <div className="absolute bottom-10 left-8">
            <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">Sing Now v1.0</p>
          </div>
        </nav>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <header className="mb-12 md:mb-16 text-center flex flex-col items-center">
          {/* [수정 부분] pr-2를 추가하여 이탤릭체 끝부분 잘림 방지 */}
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic mb-4 bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm pr-3">
            {viewMode === 'search' ? 'SING NOW' : 'FAVORITES'}
          </h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 opacity-80 mb-6">
            {viewMode === 'search' ? 'TJ Media Real-time Intelligence' : 'MY BOOKMARKED SONGS'}
          </p>

          {viewMode === 'favorite' && (
            <div className="flex gap-4 mb-4 animate-in fade-in zoom-in duration-300">
              <button onClick={exportToJson} className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-slate-100">📤</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Export</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-slate-100">📥</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Import</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={importFromJson} accept=".json" className="hidden" />
            </div>
          )}
        </header>

        {viewMode === 'search' && (
          <div className="sticky top-4 md:top-8 z-30 mb-12 md:mb-16">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목, 가수, 혹은 드라마 제목, 초성 검색 등" className="w-full h-14 md:h-18 p-5 md:p-6 pl-6 md:pl-8 pr-14 md:pr-20 rounded-[1.8rem] md:rounded-[2.2rem] bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-500/10 outline-none text-lg md:text-xl font-semibold transition-all focus:bg-white" />
                <div className="absolute right-4 md:right-6 flex items-center gap-2">
                  {query && <button type="button" onClick={() => setQuery('')} className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 bg-slate-100/50 rounded-full transition-colors active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>}
                  {loading && <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4 md:gap-6 pb-20">
          {displayList.length > 0 ? (
            displayList.map((song) => {
              const isFav = favorites.some(f => f.number === song.number);
              return (
                <div key={song.number} className="relative group bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] flex justify-between items-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] md:active:scale-100">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] md:text-[12px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono tracking-wider shrink-0">{song.number}</span>
                      <div className="flex gap-1 overflow-hidden shrink-0">
                        {song.icons.slice(0, 2).map((ico, idx) => (
                          <span key={idx} className="text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-md font-black bg-slate-800 text-white uppercase whitespace-nowrap">{ico.type === 'exclusive' ? 'PRE' : ico.type}</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-[17px] md:text-2xl font-extrabold text-slate-800 leading-[1.3] mb-1 break-words line-clamp-2 group-hover:text-blue-600 transition-colors">{song.title}</h3>
                    <p className="text-sm md:text-lg font-bold text-slate-400 truncate tracking-tight">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto">
                    {song.youtubeUrl && (
                      <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-red-100/50 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 shadow-[0_2px_10px_rgba(255,0,0,0.1)] active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg></a>
                    )}
                    <button onClick={() => toggleFavorite(song)} className={`flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full transition-all duration-300 shadow-sm active:scale-90 ${isFav ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-50 text-slate-300 hover:bg-blue-600 hover:text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            !loading && (
              <div className="py-24 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-lg font-bold text-slate-400">{viewMode === 'search' ? (query ? '결과가 없습니다.' : '노래를 검색해보세요!') : '즐겨찾기 목록이 비어있습니다.'}</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}