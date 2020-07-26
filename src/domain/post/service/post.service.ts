import { injectable, inject } from "inversify";
import { HttpClient } from "../../../core/base/http";

export interface IPostService {
    getPost(id: string);
    getAllPosts();
}

@injectable()
export class PostService implements IPostService {
    private _http: HttpClient;

    constructor(
        @inject("HttpClient") http: HttpClient
    ) {
        this._http = http;
    }

    getPost(id: string) {
        
    }

    getAllPosts() {
        return this._http.get('/posts')
    }
}