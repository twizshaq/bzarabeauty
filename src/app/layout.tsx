"use client"

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Playfair_Display} from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        {children}
        {/* <div className="nav-ctn">
          <div className="nav-bar">
            <Link href="/">
              <button className={`home-btn ${pathname === "/" ? "active" : ""}`}>
                Home
              </button>
            </Link>
            <Link href="/bookings">
              <button
                className={`book-btn ${
                  pathname === "/bookings" ? "active" : ""}`}>
                Book
              </button>
            </Link>
          </div>
        </div> */}
      </body>
    </html>
  );
}
