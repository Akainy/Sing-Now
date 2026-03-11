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

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans overflow-x-hidden">
      {/* 배경 데코레이션 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      {/* 전체 컨테이너: 모바일에서 양옆 여백 조정 (px-4) */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-24">
        
        {/* 헤더 섹션: 모바일 글자 크기 조정 */}
        <header className="mb-12 md:mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic mb-4 bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
            SING NOW
          </h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 opacity-80">
            TJ Media Real-time Intelligence
          </p>
        </header>

        {/* 검색 섹션: 모바일 높이 및 라운딩 조정 */}
        <div className="sticky top-4 md:top-8 z-30 mb-12 md:mb-16">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] md:rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목, 가수, 혹은 드라마 제목"
                className="w-full h-14 md:h-18 p-5 md:p-6 pl-6 md:pl-8 rounded-[1.8rem] md:rounded-[2.2rem] bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-500/10 outline-none text-lg md:text-xl font-semibold transition-all focus:bg-white"
              />
              <div className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2">
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
                className="relative group bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] flex justify-between items-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
              >
                {/* 왼쪽: 곡 정보 (공간 확보를 위해 min-w-0 pr-2 적용) */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-[10px] md:text-[12px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full font-mono tracking-wider shrink-0">
                      {song.number}
                    </span>
                    <div className="flex gap-1 overflow-hidden">
                      {song.icons.slice(0, 2).map((ico, idx) => ( // 모바일 공간을 위해 아이콘 최대 2개만 표시
                        <span 
                          key={idx}
                          className={`text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-md md:rounded-lg font-black uppercase tracking-tighter whitespace-nowrap ${
                            ico.type === 'mv' ? 'bg-purple-500 text-white' :
                            ico.type === 'mr' ? 'bg-emerald-500 text-white' :
                            ico.type === 'exclusive' ? 'bg-orange-500 text-white' :
                            'bg-slate-800 text-white'
                          }`}
                        >
                          {ico.type === 'exclusive' ? 'PREMIUM' : ico.type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg md:text-2xl font-extrabold text-slate-800 leading-tight mb-0.5 md:mb-1 truncate group-hover:text-blue-600 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm md:text-lg font-bold text-slate-400 tracking-tight truncate">
                    {song.artist}
                  </p>
                </div>
                
                {/* 오른쪽: 액션 버튼 그룹 (모바일 크기 축소) */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  {song.youtubeUrl && (
                    <a 
                      href={song.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-90 pl-[1.5px]"
                      title="유튜브 반주"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.301 1.103.33 3.37.33 3.37s-.029 2.286-.33 3.37a2.01 2.01 0 0 1-1.415 1.42c-1.123.302-5.288.331-6.11.331h-.089c-.822 0-4.987-.03-6.11-.331a2.01 2.01 0 0 1-1.415-1.42c-.301-1.103-.33-3.37-.33-3.37s.029-2.286.33-3.37a2.01 2.01 0 0 1 1.415-1.42c1.123-.302 5.288-.332 6.11-.332zM6.505 4.635v6.73L11.93 8.0z"/>
                      </svg>
                    </a>
                  )}

                  <button className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-slate-50 text-slate-300 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && query.trim() !== "" && (
              <div className="py-20 md:py-32 text-center rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-lg md:text-xl font-bold text-slate-400">결과를 찾지 못했어요</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}