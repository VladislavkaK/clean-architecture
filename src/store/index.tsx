import React from 'react';
import 'mobx-react-lite/batchingForReactDom';
import { PostStore } from './post/post.store';
import { appContainer } from '../pages/_app';

const storesCtx = React.createContext({
    postStore: appContainer.getContainer().get<PostStore>("PostStore")
});

export const useStores = () => React.useContext(storesCtx);