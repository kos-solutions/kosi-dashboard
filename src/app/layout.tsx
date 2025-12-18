import "./globals.css";

export const metadata = {
  title: "KOSI Dashboard",
  description: "KOSI parental dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
