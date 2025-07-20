import "./globals.css";
import { AuthProvider } from "../lib/auth";

export const metadata = {
  title: "AMS - Apartment Management System",
  description: "Manage apartment expenses and payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
