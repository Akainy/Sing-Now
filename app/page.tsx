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
  memo?: string; // 메모 필드 추가
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]); 
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'favorite'>('search');

  // --- 메모 기능을 위한 상태 ---
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [tempMemo, setTempMemo] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    localStorage.setItem('singnow-favorites', JSON.stringify(favorites));
  }, [favorites]);

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
      const mergedData = (data as Song[]).map(song => {
        const saved = favorites.find(f => f.number === song.number);
        return saved ? { ...song, memo: saved.memo } : song;
      });
      setResults(mergedData);
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

  const toggleFavorite = (song: Song) => {
    const isAlreadyFav = favorites.some((fav) => fav.number === song.number);
    if (isAlreadyFav) {
      setFavorites(favorites.filter((fav) => fav.number !== song.number));
    } else {
      setFavorites([...favorites, song]);
    }
  };

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

  const handleLyricsSearch = (artist: string, title: string) => {
    const prompt = `가수 "${artist}", 노래 제목 "${title}"의 가사를 찾아줘. 
형식은 반드시 아래와 같이 소절마다 출력해줘:
[원문 가사]
(가사 내용)
[한국어 발음]
(한국어 발음 내용)
[해석(한국어)]
(한국어 해석 내용)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prompt).then(() => {
        alert("가사 요청 문구가 복사되었습니다.\n제미나이에 붙여넣기 하세요!");
        window.open('https://gemini.google.com/app', '_blank');
      }).catch(() => {
        fallbackCopyText(prompt);
      });
    } else {
      fallbackCopyText(prompt);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert("가사 요청 문구가 복사되었습니다.\n제미나이에 붙여넣기 하세요!");
      window.open('https://gemini.google.com/app', '_blank');
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
    document.body.removeChild(textArea);
  };

  const saveMemo = () => {
    if (!activeSong) return;
    const updatedFavorites = favorites.map(f => 
      f.number === activeSong.number ? { ...f, memo: tempMemo } : f
    );
    if (!favorites.some(f => f.number === activeSong.number)) {
      updatedFavorites.push({ ...activeSong, memo: tempMemo });
    }
    setFavorites(updatedFavorites);
    setResults(results.map(r => 
      r.number === activeSong.number ? { ...r, memo: tempMemo } : r
    ));
    setIsEditMode(false);
    setIsMemoModalOpen(false);
  };

  const openMemoModal = (song: Song) => {
    setActiveSong(song);
    setTempMemo(song.memo || '');
    setIsEditMode(false);
    setIsMemoModalOpen(true);
  };

  const displayList = viewMode === 'search' ? results : favorites;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans overflow-x-hidden relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      {/* --- 메모 팝업 모달 --- */}
      {isMemoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Song Memo</span>
                <h2 className="text-lg font-extrabold text-slate-800 truncate max-w-[220px]">{activeSong?.title}</h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isEditMode ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}
                >
                  {isEditMode ? '취소' : '수정'}
                </button>
                <button onClick={() => setIsMemoModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isEditMode ? (
                <textarea 
                  className="w-full h-[50vh] p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-slate-700 font-medium transition-all"
                  placeholder="노래에 대한 메모를 남겨보세요"
                  value={tempMemo}
                  onChange={(e) => setTempMemo(e.target.value)}
                />
              ) : (
                <div className="w-full h-[50vh] p-4 rounded-2xl bg-slate-50/50 border border-transparent overflow-y-auto text-slate-600 whitespace-pre-wrap italic">
                  {tempMemo || "기록된 메모가 없습니다. '수정'을 눌러 메모를 작성해보세요."}
                </div>
              )}

              {isEditMode && (
                <button 
                  onClick={saveMemo}
                  className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  저장하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
            <span className="text-2xl font-[1000] italic bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent leading-tight py-1 pr-1">MENU</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <ul className="space-y-6">
            <li>
              <button onClick={() => { setViewMode('search'); setIsMenuOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-blue-600 transition-all group w-full text-left outline-none">
                <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 text-xl shrink-0"><span className="relative -top-[0.5px]">🔍</span></span>
                <span className="leading-none mt-0.5 text-lg">반주 검색 하기</span>
              </button>
            </li>
            <li>
              <button onClick={() => { setViewMode('favorite'); setIsMenuOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-blue-600 transition-all group w-full text-left outline-none">
                <span className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 text-xl shrink-0 ${viewMode === 'favorite' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'}`}><span className="relative -top-[0.5px]">⭐</span></span>
                <span className="leading-none mt-0.5 text-lg">즐겨찾기 목록</span>
              </button>
            </li>
            <li>
              <button onClick={() => alert("신곡 알림 설정 기능은 아직 준비 중 입니다.")} className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-blue-600 transition-all group w-full text-left outline-none">
                <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 text-xl shrink-0"><span className="relative -top-[0.5px]">🔔</span></span>
                <span className="leading-none mt-0.5 text-lg">신곡 알림 설정</span>
              </button>
            </li>
            <li className="pt-6 border-t border-slate-100">
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Account</p>
              <button className="flex items-center gap-4 text-lg font-bold text-slate-400 hover:text-slate-600 transition-all w-full text-left group outline-none">
                <span className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-200 transition-all text-xl shrink-0"><span className="relative -top-[0.5px]">👤</span></span>
                <span className="leading-none mt-0.5 text-lg">사용자 설정</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <header className="mb-12 md:mb-16 text-center flex flex-col items-center">
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
                  {query && <button type="button" onClick={() => setQuery('')} className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 bg-slate-100/50 rounded-full transition-colors active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg></button>}
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
              const hasMemo = !!song.memo && song.memo.trim() !== ""; 
              return (
                <div key={song.number} className="relative group bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] flex justify-between items-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] md:active:scale-100">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] md:text-[12px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono tracking-wider shrink-0">{song.number}</span>
                    </div>
                    <h3 className="text-[17px] md:text-2xl font-extrabold text-slate-800 leading-[1.3] mb-1 break-words line-clamp-2 group-hover:text-blue-600 transition-colors">{song.title}</h3>
                    <p className="text-sm md:text-lg font-bold text-slate-400 truncate tracking-tight">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto">
                    {/* --- 가사 검색 버튼 (돋보기) - 왼쪽으로 이동 --- */}
                    <button 
                      onClick={() => handleLyricsSearch(song.artist, song.title)}
                      className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-emerald-50 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
                      title="가사 검색"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>

                    {/* --- 메모 버튼 (말풍선) - 오른쪽으로 이동 --- */}
                    <button 
                      onClick={() => openMemoModal(song)}
                      className={`flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full transition-all duration-300 shadow-sm active:scale-90 ${hasMemo ? 'bg-amber-600 text-white shadow-amber-200' : 'bg-amber-50 text-amber-500 hover:bg-amber-600 hover:text-white'}`}
                      title="메모 작성"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={hasMemo ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11l5 5V15z"></path></svg>
                    </button>
                    
                    {song.youtubeUrl && (
                      <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-red-100/50 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 shadow-[0_2px_10px_rgba(255,0,0,0.1)] active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
                      </a>
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