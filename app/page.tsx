// 초기 버전
// 'use client';

// import { useState, useEffect } from 'react';

// interface IconInfo {
//   type: string;
//   text: string;
// }

// interface Song {
//   number: string;
//   title: string;
//   artist: string;
//   icons: IconInfo[];
// }

// export default function Home() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(false);

//   // 실시간 검색 로직 (Debounce)
//   useEffect(() => {
//     // 검색어가 없으면 결과를 비우고 종료
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     // 0.5초(500ms) 대기 타이머 설정 -> 과부하에 대한 우려로 1초로 설정 -> 너무 느려서 0.6초로 재조정
//     const debounceTimer = setTimeout(() => {
//       performSearch(query);
//     }, 600);

//     // 사용자가 다시 타이핑을 시작하면 이전 타이머를 취소 (이게 핵심!)
//     return () => clearTimeout(debounceTimer);
//   }, [query]);

//   // 실제 검색을 수행하는 함수
//   const performSearch = async (searchWord: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         setResults(data);
//       } else {
//         setResults([]);
//       }
//     } catch (error) {
//       console.error('검색 오류:', error);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 엔터 키를 눌렀을 때 폼 제출 방지 및 즉시 검색
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     performSearch(query);
//   };

//   return (
//     <main className="max-w-2xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50 text-black">
//       <header className="py-8 text-center">
//         <h1 className="text-3xl font-black text-blue-600 tracking-tighter mb-1 italic">SING NOW</h1>
//         <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Real-time TJ Mirror</p>
//       </header>

//       {/* 검색 바 */}
//       <form onSubmit={handleSubmit} className="flex gap-2 mb-8 sticky top-4 z-10">
//         <div className="relative flex-1">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="제목, 가수, OST 정보를 입력하세요..."
//             className="w-full p-4 rounded-2xl border-none shadow-xl focus:ring-2 focus:ring-blue-400 outline-none text-base bg-white"
//           />
//           {loading && (
//             <div className="absolute right-4 top-1/2 -translate-y-1/2">
//               <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}
//         </div>
//       </form>

//       {/* 검색 결과 리스트 */}
//       <div className="space-y-4">
//         {results.length > 0 ? (
//           results.map((song) => (
//             <div key={song.number} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
//                     No. {song.number}
//                   </span>
//                   <div className="flex gap-1">
//                     {song.icons.map((ico, idx) => (
//                       <span 
//                         key={idx}
//                         className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${
//                           ico.type === 'mv' ? 'bg-purple-100 text-purple-600' :
//                           ico.type === 'mr' ? 'bg-green-100 text-green-600' :
//                           ico.type === 'exclusive' ? 'bg-orange-100 text-orange-600' :
//                           'bg-gray-100 text-gray-500'
//                         }`}
//                       >
//                         {ico.type === 'exclusive' ? 'PREMIUM' : ico.type}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <h3 className="text-lg font-bold text-gray-900 leading-tight">
//                   {song.title}
//                 </h3>
//                 <p className="text-gray-500 text-sm mt-0.5">{song.artist}</p>
//               </div>
              
//               <button className="ml-4 p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all active:scale-90">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
//               </button>
//             </div>
//           ))
//         ) : (
//           !loading && query.trim() !== "" && (
//             <div className="text-center py-20">
//               <p className="text-gray-300 font-medium">검색 결과가 없습니다.</p>
//             </div>
//           )
//         )}
//       </div>
//     </main>
//   );
// }


// 두번째 수정
// 'use client';

// import { useState, useEffect } from 'react';

// interface IconInfo {
//   type: string;
//   text: string;
// }

// interface Song {
//   number: string;
//   title: string;
//   artist: string;
//   icons: IconInfo[];
// }

// export default function Home() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const debounceTimer = setTimeout(() => {
//       performSearch(query);
//     }, 600);

//     return () => clearTimeout(debounceTimer);
//   }, [query]);

//   const performSearch = async (searchWord: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         setResults(data);
//       } else {
//         setResults([]);
//       }
//     } catch (error) {
//       console.error('검색 오류:', error);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     performSearch(query);
//   };

//   return (
//     <main className="max-w-2xl mx-auto p-5 md:p-10 min-h-screen bg-white text-slate-900">
//       {/* 헤더 섹션: 로고 강조 및 여백 조정 */}
//       <header className="py-12 text-center">
//         <h1 className="text-5xl font-black text-blue-600 tracking-tighter mb-3 italic">
//           SING NOW
//         </h1>
//         <p className="text-base text-slate-400 font-bold uppercase tracking-[0.2em]">
//           Real-time TJ Mirror
//         </p>
//       </header>

//       {/* 검색 바: 폰트 크기 증가 및 라운딩 처리 강화 */}
//       <form onSubmit={handleSubmit} className="flex gap-2 mb-12 sticky top-6 z-20">
//         <div className="relative flex-1 group">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="노래 제목이나 가수를 입력하세요..."
//             className="w-full p-5 pl-6 rounded-3xl border-none shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] focus:shadow-[0_15px_45px_-12px_rgba(37,99,235,0.2)] focus:ring-2 focus:ring-blue-500/20 outline-none text-lg font-medium transition-all bg-slate-50 placeholder:text-slate-400"
//           />
//           {loading && (
//             <div className="absolute right-6 top-1/2 -translate-y-1/2">
//               <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}
//         </div>
//       </form>

//       {/* 검색 결과 리스트: 가독성 중심의 레이아웃 */}
//       <div className="space-y-5">
//         {results.length > 0 ? (
//           results.map((song) => (
//             <div 
//               key={song.number} 
//               className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
//             >
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="text-[13px] font-black tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-mono">
//                     #{song.number}
//                   </span>
//                   <div className="flex gap-1.5">
//                     {song.icons.map((ico, idx) => (
//                       <span 
//                         key={idx}
//                         className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-tight ${
//                           ico.type === 'mv' ? 'bg-purple-100 text-purple-600' :
//                           ico.type === 'mr' ? 'bg-emerald-100 text-emerald-600' :
//                           ico.type === 'exclusive' ? 'bg-orange-100 text-orange-600' :
//                           'bg-slate-100 text-slate-500'
//                         }`}
//                       >
//                         {ico.type === 'exclusive' ? 'PREMIUM' : ico.type}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
//                   {song.title}
//                 </h3>
//                 <p className="text-[17px] font-medium text-slate-500 tracking-tight">
//                   {song.artist}
//                 </p>
//               </div>
              
//               <button className="ml-4 p-4 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-90 shadow-sm">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
//               </button>
//             </div>
//           ))
//         ) : (
//           !loading && query.trim() !== "" && (
//             <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
//               <p className="text-slate-400 text-lg font-bold">검색 결과가 없어요 🥲</p>
//               <p className="text-slate-300 text-sm mt-2 font-medium">다른 키워드로 검색해보시겠어요?</p>
//             </div>
//           )
//         )}
//       </div>
//     </main>
//   );
// }

// 세번째 수정
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
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* 상단 장식용 그라데이션 빛 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* 헤더 섹션: 그라데이션 로고 */}
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-[1000] tracking-tighter italic mb-4 bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
            SING NOW
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 opacity-80">
            TJ Media Real-time Intelligence
          </p>
        </header>

        {/* 검색 섹션: 플로팅 글래스 디자인 */}
        <div className="sticky top-8 z-30 mb-16">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목, 가수, 혹은 드라마 제목"
                className="w-full h-18 p-6 pl-8 rounded-[2.2rem] bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-500/10 outline-none text-xl font-semibold placeholder:text-slate-300 transition-all focus:bg-white"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center">
                {loading ? (
                  <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* 결과 리스트: 미니멀 & 레이어드 디자인 */}
        <div className="grid gap-6">
          {results.length > 0 ? (
            results.map((song) => (
              <div 
                key={song.number} 
                className="relative group bg-white border border-slate-100 p-7 rounded-[2.5rem] flex justify-between items-center transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1.5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[12px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full font-mono tracking-wider">
                      {song.number}
                    </span>
                    <div className="flex gap-1.5">
                      {song.icons.map((ico, idx) => (
                        <span 
                          key={idx}
                          className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter ${
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

                  <h3 className="text-2xl font-extrabold text-slate-800 leading-tight mb-1 transition-colors group-hover:text-blue-600">
                    {song.title}
                  </h3>
                  <p className="text-lg font-bold text-slate-400 tracking-tight">
                    {song.artist}
                  </p>
                </div>
                
                <button className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-300 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
            ))
          ) : (
            !loading && query.trim() !== "" && (
              <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="inline-block p-6 rounded-full bg-slate-50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-slate-400">결과를 찾지 못했어요</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}