import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Press Co. — Social AI",
  description: "Pull a ready-to-post caption for your shop, on the spot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
