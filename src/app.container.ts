import { Container } from "inversify";
import "reflect-metadata";
import { HttpClient, HTTP_TYPES, httpClient } from "./core/base/http";
import { POST_TYPES } from "./domain/post/types";
import { IPostService, PostService } from "./domain/post/service/post.service";
import { PostStore } from "./store/post/post.store";
import { PostTransformerRepository, IPostTransformerRepository } from "./domain/post/transform/post.transformer-repository";

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
        this._container.bind<IPostTransformerRepository>(POST_TYPES.IPostTransformerRepository).to(PostTransformerRepository);
        this._container.bind<PostStore>(POST_TYPES.PostStore).to(PostStore).inSingletonScope();
    }

    getContainer() {
        return this._container;
    }
}