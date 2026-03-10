import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // 검색어가 없는 경우 예외 처리
  if (!query) {
    return NextResponse.json({ error: '검색어를 입력하세요.' }, { status: 400 });
  }

  // TJ미디어 검색 URL (페이지당 30개 결과 요청)
  const targetUrl = `https://www.tjmedia.com/song/accompaniment_search?pageNo=1&pageRowCnt=30&strSotrGubun=ASC&strType=0&searchTxt=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    const songs: any[] = [];
    const seenNumbers = new Set(); // [중복 제거 핵심] 이미 저장한 곡 번호를 기억하는 바구니

    // 제공해주신 .grid-container.list 구조를 기반으로 파싱 시작
    $('.grid-container.list').each((_, el) => {
      // 1. 곡 번호 추출
      const number = $(el).find('.num2').text().trim();
      
      // 2. [중복 체크] 번호가 없거나 이미 바구니(Set)에 있는 번호라면 이번 곡은 건너뜁니다.
      if (!number || seenNumbers.has(number)) return;
      seenNumbers.add(number); // 새로운 번호라면 바구니에 추가

      // 3. 곡 제목 추출 (아이콘을 제외한 순수 텍스트 p 태그)
      const title = $(el).find('.title3 .ico-flex > p').text().trim();
      
      // 4. 가수 추출
      const artist = $(el).find('.title4.singer span').text().trim();

      // 5. 아이콘 정보 추출 (MV, MR, 전용곡 등)
      const icons: { type: string; text: string }[] = [];
      $(el).find('.title3 .ico-flex ul li p.ico').each((_, icoEl) => {
        const fullClass = $(icoEl).attr('class') || '';
        const type = fullClass.replace('ico ', '').trim(); 
        const text = $(icoEl).text().trim();
        
        if (text) {
          icons.push({ type, text });
        }
      });

      // 6. 결과 배열에 추가
      if (number && title) {
        songs.push({
          number,
          title,
          artist,
          icons
        });
      }
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json({ error: '데이터 분석 중 오류 발생' }, { status: 500 });
  }
}