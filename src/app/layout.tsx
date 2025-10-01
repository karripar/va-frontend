import "./globals.css";
import Navbar from "./components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Navbar />
        <main className="mx-auto py-20 max-w-6xl">{children}</main>
      </body>
    </html>
  );
}
