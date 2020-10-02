import React from 'react';
import 'mobx-react-lite/batchingForReactDom';
import { POST_TYPES } from '../domain/post/types';
import { PostStore } from './post/post.store';
import { appContainer } from '../pages/_app';

export const postStore = appContainer.getContainer().get<PostStore>(POST_TYPES.PostStore);

const storesCtx = React.createContext({
    postStore,
});

export const useStores = () => React.useContext(storesCtx);