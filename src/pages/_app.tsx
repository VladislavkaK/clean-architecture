import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { AppContainer } from '../app.container';
import { wrapper } from '../store';

export const appContainer = new AppContainer();

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default wrapper ? wrapper.withMobx(MyApp) : MyApp;