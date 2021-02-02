import { Container } from "inversify";
import "reflect-metadata";
import { HttpClient, HTTP_TYPES, httpClient } from "./core/http";
import { POST_TYPES, IPostService, PostService, PostTransformer, IPostTransformer, PostState } from './modules/posts';;

export class AppContainer {
    _container: Container = null;
    
    constructor() {
        this._container = new Container();
    }

    buildCore() {
        this._container.bind<HttpClient>(HTTP_TYPES.HttpClient).toConstantValue(httpClient);
    }

    buildPost() {
        this._container.bind<IPostService>(POST_TYPES.IPostService).to(PostService);
        this._container.bind<IPostTransformer>(POST_TYPES.IPostTransformer).to(PostTransformer);
        this._container.bind<PostState>(POST_TYPES.PostState).to(PostState).inSingletonScope();
    }

    getContainer() {
        return this._container;
    }
}