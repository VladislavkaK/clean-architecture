import { Container } from "inversify";
import "reflect-metadata";
import { HttpClient, httpClient } from "./core/base/http";
import { IPostService, PostService } from "./domain/post/service/post.service";
import { PostStore } from "./store/post/post.store";

export class AppContainer {
    _container: Container = null;
    constructor() {
        this._container = new Container();
    }

    build() {
        this._container.bind<HttpClient>("HttpClient").toConstantValue(httpClient);
        this._container.bind<IPostService>("IPostService").to(PostService);
        this._container.bind<PostStore>("PostStore").to(PostStore);
    }

    getContainer() {
        return this._container;
    }
}