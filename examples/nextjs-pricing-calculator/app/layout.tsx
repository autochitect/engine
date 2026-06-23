import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Calculator — @autochitect/engine",
  description:
    "Interactive SaaS pricing calculator powered by a 245KB WebAssembly engine. All calculations run client-side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
