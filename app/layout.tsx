import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Kakao Emoticon URL Redirect",
  description: "Extract the redirect URL for Kakao emoticon items."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
