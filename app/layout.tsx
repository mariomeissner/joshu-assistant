import localFont from "next/font/local";
import "./globals.css";

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

export const metadata = {
  title: "Joshu - Personal Work Assistant",
  description:
    "An intelligent work assistant powered by AI to help answer your questions",
  keywords: ["AI", "chat", "assistant", "help", "questions"],
  authors: [{ name: "Your Name" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Joshu - Personal Work Assistant",
    description:
      "An intelligent work assistant powered by AI to help answer your questions",
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshu - Personal Work Assistant",
    description:
      "An intelligent work assistant powered by AI to help answer your questions",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
