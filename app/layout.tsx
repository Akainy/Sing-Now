import type { Metadata } from "next";
import localFont from "next/font/local"; // 로컬 폰트 적용을 위한 임포트
import "./globals.css";

// TJ 노래방 즐거운 서체 설정 (4가지 두께 매칭)
const tjFont = localFont({
  src: [
    {
      path: "../public/fonts/TJJoyofsingingL.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/TJJoyofsingingM.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/TJJoyofsingingB.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/TJJoyofsingingEB.otf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SING NOW | 실시간 TJ 노래방 검색",
  description: "헤매지 말고 바로 SING NOW! 가장 빠르고 세련된 TJ 노래방 반주곡 실시간 검색 서비스입니다.",
  keywords: ["노래방", "TJ미디어", "노래번호", "반주곡검색", "노래방번호", "SINGNOW"],
  authors: [{ name: "Akainy" }],
  openGraph: {
    title: "SING NOW | 실시간 TJ 노래방 검색",
    description: "제목, 가수, 드라마 제목으로 빠르게 번호를 확인하세요. 이제 노래방에서 번호 찾느라 시간 낭비하지 마세요!",
    url: "https://sing-now.vercel.app",
    siteName: "SING NOW",
    images: [
      {
        url: "https://sing-now.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SING NOW 서비스 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SING NOW | 실시간 TJ 노래방 검색",
    description: "가장 빠르고 세련된 TJ 노래방 반주곡 실시간 검색 서비스",
    images: ["https://sing-now.vercel.app/og-image.png"],
  },
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
      {/* inter.className 대신 tjFont.className을 적용합니다. */}
      <body className={tjFont.className}>
        <div className="fixed inset-0 bg-[#f8fafc] -z-50" />
        {children}
      </body>
    </html>
  );
}