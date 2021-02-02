import { injectable } from 'inversify';
import { PostEntity, PostModel } from '../types/posts.types';

export interface IPostTransformer {
    toModel(param: PostEntity): PostModel;
}

@injectable()
export class PostTransformer {
    toModel(param: PostEntity): PostModel {
        return {
            id: param.id,
            userId: param.userId,
            title: param.title,
            body: param.body,
            isOdd: param.id % 2 === 0
        }
    }
}