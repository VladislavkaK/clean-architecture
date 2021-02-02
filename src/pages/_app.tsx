import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { AppContainer } from '../app.container';
import { wrapper } from '../core/store';

export const appContainer = new AppContainer();

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <GeistProvider>
    <CssBaseline />
    <Component {...pageProps} />
  </GeistProvider>
);

export default wrapper.withMobx(MyApp);