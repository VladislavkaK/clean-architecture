import { observable, action } from 'mobx';
import { injectable, inject } from 'inversify';
import { IPostService } from '../../domain/post/service/post.service';
import { PostModel } from '../../domain/post/model/post.model';
import { IPostTransformerRepository } from '../../domain/post/transform/post.transformer-repository';

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
    posts: PostModel[] = [];

    @observable
    postsError: any = null;

    constructor(
        @inject("IPostService") service: IPostService,
        @inject("IPostTransformerRepository") transformer: IPostTransformerRepository
    ) {
        this._service = service;
        this._transformer = transformer;
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
}