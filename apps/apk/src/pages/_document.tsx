import { Head, Html, Main, NextScript } from "next/document";

const APP_DEFAULT_TITLE = "Melya Closet";
const APP_DESCRIPTION =
  "Panel de administracion de Melya Closet - Tu tienda de moda";

export default function Document() {
  return (
    <Html lang="es" dir="ltr">
      <Head>
        <meta name="application-name" content={APP_DEFAULT_TITLE} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta property="og:site_name" content={APP_DEFAULT_TITLE} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <link
          rel="icon"
          href="/icon-light-32x32.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/icon-dark-32x32.png"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </Head>
      <body className="font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
