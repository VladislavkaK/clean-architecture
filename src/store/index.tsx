import React from 'react';
import 'mobx-react-lite/batchingForReactDom';
import { PostStore } from './post/post.store';

const storesCtx = React.createContext({
    postStore: new PostStore()
});

export const useStores = () => React.useContext(storesCtx);