import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. 메타데이터 설정: 여기가 링크 미리보기를 결정하는 핵심입니다.
export const metadata: Metadata = {
  title: "SING NOW | 실시간 TJ 노래방 검색",
  description: "헤매지 말고 바로 SING NOW! 가장 빠르고 세련된 TJ 노래방 반주곡 실시간 검색 서비스입니다.",
  keywords: ["노래방", "TJ미디어", "노래번호", "반주곡검색", "노래방번호", "SINGNOW"],
  authors: [{ name: "Akainy" }],
  
  // 소셜 미디어(카카오톡, 페이스북 등)용 설정
  openGraph: {
    title: "SING NOW | 실시간 TJ 노래방 검색",
    description: "제목, 가수, 드라마 제목으로 빠르게 번호를 확인하세요. 이제 노래방에서 번호 찾느라 시간 낭비하지 마세요!",
    url: "https://sing-now.vercel.app",
    siteName: "SING NOW",
    images: [
      {
        url: "https://sing-now.vercel.app/og-image.png", // 실제 배포 후 이미지 경로
        width: 1200,
        height: 630,
        alt: "SING NOW 서비스 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  
  // 트위터/X용 설정
  twitter: {
    card: "summary_large_image",
    title: "SING NOW | 실시간 TJ 노래방 검색",
    description: "가장 빠르고 세련된 TJ 노래방 반주곡 실시간 검색 서비스",
    images: ["https://sing-now.vercel.app/og-image.png"],
  },

  // 브라우저 탭 아이콘 (Favicon)
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* 2026 트렌디 디자인을 위한 배경 처리 */}
        <div className="fixed inset-0 bg-[#f8fafc] -z-50" />
        {children}
      </body>
    </html>
  );
}