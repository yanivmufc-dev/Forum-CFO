import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forum CFO",
  description: "Your command center for growing CFO relationships",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-700">
              Forum CFO
            </a>
            <div className="flex gap-6 text-sm font-medium">
              <a href="/linkedin" className="text-gray-600 hover:text-blue-700 transition-colors">
                LinkedIn
              </a>
              <a href="/members" className="text-gray-600 hover:text-blue-700 transition-colors">
                חברים
              </a>
              <a href="/prep" className="text-gray-600 hover:text-blue-700 transition-colors">
                הכנה לפגישה
              </a>
              <a href="/templates" className="text-gray-600 hover:text-blue-700 transition-colors">
                תבניות
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
