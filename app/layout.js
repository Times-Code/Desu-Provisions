import { AuthProvider } from "./Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import logo from "../public/logo1.jpg"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Desu Provisions",
  description: "A Grocery Store",
  icons: {
    icon: '../public/logo1.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/logo1.jpg"/>
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
