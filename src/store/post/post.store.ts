import { observable } from 'mobx';

export class PostStore {
    @observable
    loading: string = 'sdsd';

    @observable
    data: any = null;

    @observable
    error: any = null;
}