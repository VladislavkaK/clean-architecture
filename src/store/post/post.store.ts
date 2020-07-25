import { observable, action } from 'mobx';
import { IPostService } from '../../domain/post/service/post.service';
import { injectable, inject } from 'inversify';

@injectable()
export class PostStore {
    @inject("IPostService") _service: IPostService;

    @observable
    loading: string = 'sdsd';

    @observable
    data: any = null;

    @observable
    error: any = null;

    // constructor(
    //     @inject("IPostService") service: IPostService
    // ) {
    //     this._service = service;
    // }

    @action getAllPosts() {
        this._service.getAllPosts();
    }
}