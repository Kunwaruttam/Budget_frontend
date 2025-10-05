import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from '@/components/client-providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budget Tracker - Hierarchical Budget Management",
  description: "Professional budget tracking application with real-time expense monitoring and advanced reporting capabilities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  const savedTheme = localStorage.getItem('budget_theme');
                  if (savedTheme) {
                    return savedTheme;
                  }
                  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                  }
                  return 'light';
                }
                
                const theme = getInitialTheme();
                document.documentElement.classList.add(theme);
                
                if (!localStorage.getItem('budget_theme')) {
                  localStorage.setItem('budget_theme', theme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
