import React, { FC } from 'react';
import { toJS } from 'mobx';
import { POST_TYPES } from '../modules/posts';
import { appContainer } from '../pages/_app';
import { PostState } from '../modules/posts';
import { Context, createWrapper, MakeStore } from './store-wrapper';

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

    const postState = appContainer.getContainer().get<PostState>(POST_TYPES.PostState);
    
    return {
        postState,
    }
}

export const StoreContext = React.createContext<RootStore>({
    postState: null,
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