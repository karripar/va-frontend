import "./globals.css";
import Navbar from "./components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className={` antialiased`}>
        <Navbar />
        <main className="mx-auto max-w-6xl my-2">{children}</main>
      </body>
    </html>
  );
}
