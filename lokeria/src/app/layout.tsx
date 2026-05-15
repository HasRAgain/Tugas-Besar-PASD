import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { getUser, getProfile } from "@/actions/auth";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lokeria — Smart Job Search Platform",
    template: "%s | Lokeria",
  },
  description:
    "Find your dream job with Lokeria. Powerful filtering, beautiful UI, and a seamless job search experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let profile = null;

  try {
    user = await getUser();
    if (user) {
      profile = await getProfile();
    }
  } catch {
    // Supabase not configured yet, fail silently
  }

  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        geistHeading.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <Navbar
          user={user ? { id: user.id, email: user.email } : null}
          profile={profile}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
