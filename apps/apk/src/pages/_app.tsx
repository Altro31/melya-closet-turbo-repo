import CollectionPreloader from "@/components/collection-preloader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/sections/dashboard/header";
import { MobileNav } from "@/sections/dashboard/mobile-nav";
import { Sidebar } from "@/sections/dashboard/sidebar";
import "@/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { Toaster } from "sonner";

const APP_DEFAULT_TITLE = "Melya Closet";
const APP_DESCRIPTION =
  "Panel de administracion de Melya Closet - Tu tienda de moda";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{APP_DEFAULT_TITLE}</title>
        <meta name="description" content={APP_DESCRIPTION} />
      </Head>
      <NuqsAdapter>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:hidden">
              <MobileNav />
            </div>
            <div className="lg:pl-64">
              <Header />
              <Component {...pageProps} />
              <CollectionPreloader />
            </div>
          </div>
          {/* <Analytics /> */}
          <Toaster closeButton richColors />
        </TooltipProvider>
      </NuqsAdapter>
    </>
  );
}
