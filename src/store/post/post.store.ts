import { makeObservable, observable, action } from 'mobx';
import { injectable, inject } from 'inversify';
import { POST_TYPES } from "../../domain/post/types";
import { IPostService } from '../../domain/post/service/post.service';
import { PostModel } from '../../domain/post/model/post.model';
import { IPostTransformerRepository } from '../../domain/post/transform/post.transformer-repository';
import { CreatePostDTO } from '../../domain/post/dto/create-post-dto';

@injectable()
export class PostStore {
    private _service: IPostService;
    private _transformer: IPostTransformerRepository;

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
        @inject(POST_TYPES.IPostTransformerRepository) transformer: IPostTransformerRepository
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

    hydrate(state: PostStore) {
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