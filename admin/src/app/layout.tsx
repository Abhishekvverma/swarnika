import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import ThemeClientProvider from "@/styles/ThemeClientProvider";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Luxe Gems Admin",
  description: "Admin dashboard for Luxe Gems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <ThemeClientProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeClientProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
