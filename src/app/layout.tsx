import { Cinzel, Merriweather } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | The Artisans' Guild",
    default: "The Artisans' Guild | Medieval & Fantasy Marketplace",
  },
  description:
    "A specialized marketplace for crafters and artisans in a medieval fantasy setting. Join guilds, trade wares in the bazaar, and share dispatches at the tavern.",
  metadataBase: new URL("https://crafters-guild.example.com"),
  openGraph: {
    title: "The Artisans' Guild",
    description: "A Medieval & Fantasy Marketplace for Crafters",
    url: "https://crafters-guild.example.com",
    siteName: "The Artisans' Guild",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Artisans' Guild",
    description: "A Medieval & Fantasy Marketplace for Crafters",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${merriweather.variable} flex min-h-screen flex-col antialiased`}
      >
        <Navigation />
        <main className="flex w-full flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
