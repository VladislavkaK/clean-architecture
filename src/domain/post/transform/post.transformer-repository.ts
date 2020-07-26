import { injectable } from "inversify";
import { PostEntity } from "../model/post.entity";
import { PostModel } from "../model/post.model";

export interface IPostTransformerRepository {
    toModel(param: PostEntity): PostModel;
}

@injectable()
export class PostTransformerRepository {
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