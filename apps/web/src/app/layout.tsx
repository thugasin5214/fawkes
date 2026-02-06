import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fawkes",
  description: "Agent-friendly full-stack web app generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
