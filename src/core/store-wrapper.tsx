import React, {useCallback, useEffect, useRef} from 'react';
import { enableStaticRendering } from 'mobx-react';
import {GetServerSideProps, GetStaticProps, NextComponentType, NextPage, NextPageContext} from 'next';
import App, {AppContext, AppInitialProps} from 'next/app';
import {IncomingMessage, ServerResponse} from 'http';
import {ParsedUrlQuery} from 'querystring';
import { StoreProvider, RootStore } from './store';

export const HYDRATE = '__NEXT_MOBX_WRAPPER_HYDRATE__';
export const STOREKEY = '__NEXT_MOBX_WRAPPER_STORE__';

const getIsServer = () => typeof window === 'undefined';

const getDeserializedState = (initialState: any, {deserializeState}: Config = {}) =>
    deserializeState ? deserializeState(initialState) : initialState;

const getSerializedState = (state: any, {serializeState}: Config = {}) =>
    serializeState ? serializeState(state) : state;

const getStoreKey = ({storeKey}: Config = {}) => storeKey || STOREKEY;

enableStaticRendering(getIsServer());

export declare type MakeStore<S = any> = (context: Context) => any;

export interface InitStoreOptions<S = any> {
    makeStore: MakeStore<S>;
    context: Context;
    config: Config<S>;
}

const initStore = <S extends {} = any>({
    makeStore,
    context,
    config,
}: InitStoreOptions<S>) => {
    const storeKey = getStoreKey(config);

    const createStore = () => {
        return makeStore(context)
    };

    if (getIsServer()) {
        const c = context as any;
        let req;
        if (c.req) req = c.req;
        if (c.ctx && c.ctx.req) req = c.ctx.req;
        if (req) {
            // ATTENTION! THIS IS INTERNAL, DO NOT ACCESS DIRECTLY ANYWHERE ELSE
            if (!req.__nextMobxWrapperStore) req.__nextMobxWrapperStore = createStore();
            return req.__nextMobxWrapperStore;
        }
        return createStore();
    }
    // Memoize store if client
    if (!(storeKey in window)) {
        (window as any)[storeKey] = createStore();
    }

    return (window as any)[storeKey];
};

//FIXME Use Parameters<GetServerSideProps>, see https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterst
export interface GetServerSidePropsContext {
    req: IncomingMessage;
    res: ServerResponse;
    params?: ParsedUrlQuery;
    query: ParsedUrlQuery;
    preview?: boolean;
    previewData?: any;
}

//FIXME Use Parameters<GetStaticProps>, see https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterst
export interface GetStaticPropsContext {
    params?: ParsedUrlQuery;
    preview?: boolean;
    previewData?: any;
}

export const createWrapper = <S extends {} = any>(
    makeStore: MakeStore<S>,
    hydrateHandler: (store: RootStore, state: any) => void,
    config: Config<S> = {},
) => {
    const makeProps = async ({
        callback,
        context,
        isApp = false,
    }: {
        callback: any;
        context: Context;
        isApp?: boolean;
    }): Promise<WrapperProps> => {
        const store = initStore({context, makeStore, config});

        if (config.debug) console.log(`1. getProps created store with state`, store);

        const initialProps =
            (callback &&
                (await callback(
                    // merging store into context instead of just passing as another argument because it's impossible to override getInitialProps signature
                    isApp ? {...context, ctx: {...(context as AppContext).ctx, store}} : {...context, store},
                ))) ||
            {};

        if (config.debug) console.log(`3. getProps after dispatches has store state`, store);

        // To state
        const state = store;

        return {
            initialProps,
            initialState: getIsServer() ? getSerializedState(state, config) : state,
        };
    };

    const getInitialPageProps = <P extends {} = any>(
        callback: (context: NextPageContext & {store: RootStore}) => P | void,
    ) => async (context: NextPageContext) => {
        if (context.store) {
            console.warn('No need to wrap pages if _app was wrapped');
            return callback(context as any);
        }
        return makeProps({callback, context});
    };

    const getInitialAppProps = <P extends {} = any>(
        callback: (context: AppContext & {store: RootStore}) => P | void,
    ) => async (context: AppContext) =>
        (await makeProps({callback, context, isApp: true})) as WrapperProps & AppInitialProps; // this is just to convince TS

    const getStaticProps = <P extends {} = any>(
        callback: (context: GetStaticPropsContext & {store: RootStore}) => P | void,
    ): GetStaticProps<P> => async (context: any) => {
        const {
            initialProps: {props, ...settings},
            ...wrapperProps
        } = await makeProps({callback, context});

        return {
            ...settings,
            props: {
                ...wrapperProps,
                ...props,
            },
        } as any;
    };

    const getServerSideProps = <P extends {} = any>(
        callback: (context: GetServerSidePropsContext & {store: RootStore}) => P | void,
    ): GetServerSideProps<P> => async (context: any) => {
        return await getStaticProps(callback as any)(context); // just not to repeat myself
    };

    const withMobx = (Component: NextComponentType | App | any) => {
        const displayName = `withMobx(${Component.displayName || Component.name || 'Component'})`;

        //TODO Check if pages/_app was wrapped so there's no need to wrap a page itself
        const Wrapper: NextPage<WrapperProps> = ({initialState, initialProps, ...props}, context) => {
            const isFirstRender = useRef<boolean>(true);

            // this happens when App has page with getServerSideProps/getStaticProps
            const initialStateFromGSPorGSSR = props?.pageProps?.initialState;
            // console.log('SSG', initialStateFromGSPorGSSR)

            if (config.debug)
                console.log('4. WrappedApp created new store with', displayName, {
                    initialState,
                    initialStateFromGSPorGSSR,
                });

            const store = useRef<RootStore>(initStore({makeStore, config, context}));

            const hydrate = useCallback(() => {
                if (initialState)
                    hydrateHandler(store.current, getDeserializedState(initialState, config))

                // ATTENTION! This code assumes that Page's getServerSideProps is executed after App.getInitialProps
                // so we dispatch in this order
                if (initialStateFromGSPorGSSR)
                    hydrateHandler(store.current, getDeserializedState(initialStateFromGSPorGSSR, config))
            }, [initialStateFromGSPorGSSR, initialState]);

            // apply synchronously on first render (both server side and client side)
            if (isFirstRender.current) hydrate();

            // apply async in case props have changed, on navigation for example
            useEffect(() => {
                if (isFirstRender.current) {
                    isFirstRender.current = false;
                    return;
                }
                hydrate();
            }, [hydrate]);

            // order is important! Next.js overwrites props from pages/_app with getStaticProps from page
            // @see https://github.com/zeit/next.js/issues/11648
            if (initialProps && initialProps.pageProps)
                props.pageProps = {
                    ...initialProps.pageProps, // this comes from wrapper in _app mode
                    ...props.pageProps, // this comes from gssp/gsp in _app mode
                };

            let resultProps = props;

            // just some cleanup to prevent passing it as props, we need to clone props to safely delete initialState
            if (initialStateFromGSPorGSSR) {
                resultProps = {...props, pageProps: {...props.pageProps}};
                delete resultProps.pageProps.initialState;
            }

            return (
                <StoreProvider store={store.current}>
                    <Component {...initialProps} {...resultProps} />
                </StoreProvider>
            );
        };

        Wrapper.displayName = displayName;

        if ('getInitialProps' in Component)
            Wrapper.getInitialProps = async (context: any) => {
                const callback = Component.getInitialProps; // bind?
                return (context.ctx ? getInitialAppProps(callback) : getInitialPageProps(callback))(context);
            };

        return Wrapper;
    };

    return {
        getServerSideProps,
        getStaticProps,
        withMobx,
    };
};

export type Context = NextPageContext | AppContext | GetStaticPropsContext | GetServerSidePropsContext;

export interface Config<S extends {} = any> {
    serializeState?: (state: S) => any;
    deserializeState?: (state: any) => S;
    storeKey?: string;
    debug?: boolean;
}

export interface WrapperProps {
    initialProps: any; // stuff returned from getInitialProps
    initialState: any; // stuff in the Store state after getInitialProps
    pageProps?: any; // stuff from page's getServerSideProps or getInitialProps when used with App
}