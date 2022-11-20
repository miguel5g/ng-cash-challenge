import { Head, Html, Main, NextScript } from 'next/document';

const Document: React.FC = () => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body className="bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
