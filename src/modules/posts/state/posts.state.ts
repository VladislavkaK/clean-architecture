import { makeObservable, observable, action } from 'mobx';
import { injectable, inject } from 'inversify';
import { POST_TYPES, PostModel } from '../types/posts.types';
import { IPostService } from '../service/posts.service';
import { CreatePostDTO } from '../types/posts.types';
import { IPostTransformer } from '../transformer/posts.transformer';

@injectable()
export class PostState {
    private _service: IPostService;
    private _transformer: IPostTransformer;

    @observable
    isPostFetching: boolean = false;

    @observable
    post: PostModel = null;

    @observable
    postError: any = null;

    @observable
    isPostsFetching: boolean = false;

    @observable
    createPostError: any = null;

    @observable
    posts: PostModel[] = [];

    @observable
    postsError: any = null;

    constructor(
        @inject(POST_TYPES.IPostService) service: IPostService,
        @inject(POST_TYPES.IPostTransformer) transformer: IPostTransformer
    ) {
        this._service = service;
        this._transformer = transformer;
        makeObservable(this);
    }

    @action async createPost(post: CreatePostDTO) {
        try {
            await this._service.createPost(post);
        } catch (error) {
            this.createPostError = error;
        }
    }

    @action async getPost(id: string) {
        try {
            const post = await this._service.getPost(id);
            this.post = this._transformer.toModel(post);
        } catch (error) {
            this.postError = error;
        }
    }

    @action async getAllPosts() {
        try {
            const posts = await this._service.getAllPosts();
            this.posts = posts.map(this._transformer.toModel);
        } catch (error) {
            this.postsError = error;
        }
    }

    hydrate(state: PostState) {
        if (!state) return;
        this.isPostFetching = state.isPostFetching || false;
        this.post = state.post || null;
        this.postError = state.postError || null;
        this.createPostError = state.createPostError || null;
        this.isPostsFetching = state.isPostsFetching || false;
        this.posts = state.posts || [];
        this.postsError = state.postsError || null;
    }
}