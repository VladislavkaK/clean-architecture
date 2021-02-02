import { injectable, inject } from "inversify";
import { HttpClient, HTTP_TYPES } from "../../../core/http";
import { PostEntity, CreatePostDTO } from "../types/posts.types";

export interface IPostService {
    createPost(post: CreatePostDTO): Promise<PostEntity>;
    getPost(id: string): Promise<PostEntity>;
    getAllPosts(): Promise<PostEntity[]>;
}

@injectable()
export class PostService implements IPostService {
    private _http: HttpClient;

    constructor(
        @inject(HTTP_TYPES.HttpClient) http: HttpClient
    ) {
        this._http = http;
    }

    async createPost(post: CreatePostDTO): Promise<PostEntity> {
        try {
            const resp = await this._http.post(`/posts`, post);
            return resp.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getPost(id: string): Promise<PostEntity> {
        try {
            const resp = await this._http.get(`/posts/${id}`);
            return resp.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllPosts(): Promise<PostEntity[]> {
        try {
            const resp = await this._http.get('/posts');
            return resp.data;
        } catch (error) {
            throw new Error(error);
        }
    }
}