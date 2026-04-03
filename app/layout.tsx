import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smblends Booking",
  description: "Mobile-first booking website for Smblends."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className="theme font-sans antialiased">{children}</body>
    </html>
  );
}
