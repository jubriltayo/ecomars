export const metadata = {
  title: "Ecomars API",
  description: "Backend API for Ecomars",
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
