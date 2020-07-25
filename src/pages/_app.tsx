import { AppProps } from 'next/app';
import { AppContainer } from '../app.container';

export const appContainer = new AppContainer();

appContainer.build();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;