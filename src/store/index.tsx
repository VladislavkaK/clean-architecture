import { toJS } from 'mobx';
import React, { FC } from 'react';
import { POST_TYPES } from '../domain/post/types';
import { appContainer } from '../pages/_app';
import { PostStore } from './post/post.store';
import { Context, createWrapper, MakeStore } from './wrapper';

export const hydrateRoot = (store: RootStore, state: RootStore) => {
    for (const storeKey in state) {
        if (typeof store[storeKey].hydrate === 'function')
            store[storeKey].hydrate(state[storeKey])
    }
}

export const createStore = () => {
    appContainer._container.unbindAll();

    appContainer.buildCore();
    appContainer.buildPost();

    const postStore = appContainer.getContainer().get<PostStore>(POST_TYPES.PostStore);
    
    return {
        postStore,
    }
}

export const StoreContext = React.createContext<RootStore>({
    postStore: null,
});

export const StoreProvider: FC<{ store: RootStore }> = ({ store, children }) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
}

export const useStore = () => React.useContext(StoreContext);

export type RootStore = ReturnType<typeof createStore>;

// create a makeStore function
export const makeStore: MakeStore<RootStore> = (context: Context) => createStore();

// export an assembled wrapper
export const wrapper = createWrapper<RootStore>(makeStore, hydrateRoot, {
    serializeState: state => JSON.stringify(toJS(state)),
    deserializeState: state => JSON.parse(state)
});