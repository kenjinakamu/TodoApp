import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Spring Boot + Next.js Todo application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
