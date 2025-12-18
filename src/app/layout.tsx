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
      <body className="min-h-screen bg-kosi-bg text-kosi-text">
        {children}
      </body>
    </html>
  );
}
