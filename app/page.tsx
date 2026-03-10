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
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  // 실시간 검색 로직 (Debounce)
  useEffect(() => {
    // 검색어가 없으면 결과를 비우고 종료
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // 0.5초(500ms) 대기 타이머 설정 -> 과부하에 대한 우려로 1초로 설정 -> 너무 느려서 0.6초로 재조정
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 600);

    // 사용자가 다시 타이핑을 시작하면 이전 타이머를 취소 (이게 핵심!)
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // 실제 검색을 수행하는 함수
  const performSearch = async (searchWord: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 엔터 키를 눌렀을 때 폼 제출 방지 및 즉시 검색
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <main className="max-w-2xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50 text-black">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-black text-blue-600 tracking-tighter mb-1 italic">SING NOW</h1>
        <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Real-time TJ Mirror</p>
      </header>

      {/* 검색 바 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 sticky top-4 z-10">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 가수, OST 정보를 입력하세요..."
            className="w-full p-4 rounded-2xl border-none shadow-xl focus:ring-2 focus:ring-blue-400 outline-none text-base bg-white"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* 검색 결과 리스트 */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((song) => (
            <div key={song.number} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                    No. {song.number}
                  </span>
                  <div className="flex gap-1">
                    {song.icons.map((ico, idx) => (
                      <span 
                        key={idx}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${
                          ico.type === 'mv' ? 'bg-purple-100 text-purple-600' :
                          ico.type === 'mr' ? 'bg-green-100 text-green-600' :
                          ico.type === 'exclusive' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {ico.type === 'exclusive' ? 'PREMIUM' : ico.type}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {song.title}
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">{song.artist}</p>
              </div>
              
              <button className="ml-4 p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
          ))
        ) : (
          !loading && query.trim() !== "" && (
            <div className="text-center py-20">
              <p className="text-gray-300 font-medium">검색 결과가 없습니다.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}