'use client';

import { useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(false);

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

  // 유튜브 앱 호출을 시도하는 함수
  const handleYoutubeClick = (e: React.MouseEvent<HTMLAnchorElement>, youtubeUrl: string) => {
    e.preventDefault();

    // TJ 미디어 URL에서 곡 번호 추출 (query= 뒤의 숫자)
    const songNumber = youtubeUrl.split('query=')[1];
    
    if (songNumber) {
      // 검색 쿼리 생성 (TJ + 곡 번호)
      const searchQuery = `TJ ${songNumber}`;
      
      // 모바일 앱 스킴과 웹 URL 준비
      const appUrl = `youtube://results?search_query=${encodeURIComponent(searchQuery)}`;
      const webUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

      // 1. 앱 호출 시도 (iOS/Android 공통 스킴)
      const start = Date.now();
      window.location.href = appUrl;

      // 2. 앱이 없어서 실행되지 않을 경우 대비 (0.5초 뒤 반응 없으면 웹으로 이동)
      setTimeout(() => {
        if (Date.now() - start < 1000) {
          window.open(webUrl, '_blank');
        }
      }, 500);
    } else {
      // 번호 추출 실패 시 원본 링크 열기
      window.open(youtubeUrl, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-24">
        
        <header className="mb-12 md:mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic mb-4 bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
            SING NOW
          </h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 opacity-80">
            TJ Media Real-time Intelligence
          </p>
        </header>

        {/* 검색 섹션 */}
        <div className="sticky top-4 md:top-8 z-30 mb-12 md:mb-16">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목, 가수, 혹은 드라마 제목, 초성 검색 등"
                className="w-full h-14 md:h-18 p-5 md:p-6 pl-6 md:pl-8 pr-14 md:pr-20 rounded-[1.8rem] md:rounded-[2.2rem] bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-500/10 outline-none text-lg md:text-xl font-semibold transition-all focus:bg-white"
              />
              
              <div className="absolute right-4 md:right-6 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 bg-slate-100/50 rounded-full transition-colors active:scale-90"
                    aria-label="검색어 지우기"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {loading && (
                  <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* 결과 리스트 */}
        <div className="grid gap-4 md:gap-6">
          {results.length > 0 ? (
            results.map((song) => (
              <div 
                key={song.number} 
                className="relative group bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] flex justify-between items-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] md:active:scale-100"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] md:text-[12px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono tracking-wider shrink-0">
                      {song.number}
                    </span>
                    <div className="flex gap-1 overflow-hidden shrink-0">
                      {song.icons.slice(0, 2).map((ico, idx) => (
                        <span 
                          key={idx}
                          className="text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-md font-black bg-slate-800 text-white uppercase whitespace-nowrap"
                        >
                          {ico.type === 'exclusive' ? 'PRE' : ico.type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-[17px] md:text-2xl font-extrabold text-slate-800 leading-[1.3] mb-1 break-words line-clamp-2 md:line-clamp-none group-hover:text-blue-600 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm md:text-lg font-bold text-slate-400 truncate tracking-tight">
                    {song.artist}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto">
                  {song.youtubeUrl && (
                    <a 
                      href={song.youtubeUrl} 
                      onClick={(e) => handleYoutubeClick(e, song.youtubeUrl!)} // 클릭 이벤트 가로채기
                      className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-red-100/50 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 shadow-[0_2px_10px_rgba(255,0,0,0.1)] active:scale-90"
                      title="유튜브 반주"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                      </svg>
                    </a>
                  )}

                  <button className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-slate-50 text-slate-300 transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-sm active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && query.trim() !== "" && (
              <div className="py-24 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-lg font-bold text-slate-400">결과가 없습니다.</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}