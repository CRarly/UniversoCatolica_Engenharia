import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desafio Estrutural | Engenharia Civil",
  description:
    "Jogo de perguntas e respostas sobre Engenharia Civil: acerte, construa e conclua a casa antes da demolição.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
