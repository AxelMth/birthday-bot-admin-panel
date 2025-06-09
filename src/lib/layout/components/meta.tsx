import { Helmet } from 'react-helmet-async';

const APP_NAME = 'Birthday Bot Admin';

export const Meta = () => {
  return (
    <Helmet>
      <title>Birthday Bot Admin</title>
      <meta name="description" content="Admin panel for Birthday Bot" />

      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#FFFFFF" />

      <link rel="shortcut icon" href="/favicon.svg" />
    </Helmet>
  );
};
