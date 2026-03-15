import { Cinzel, Merriweather } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-merriweather", weight: ["300", "400", "700", "900"], subsets: ["latin"] });

export const metadata = {
  title: "The Artisans' Guild",
  description: "A Medieval & Fantasy Marketplace for Crafters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${merriweather.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
