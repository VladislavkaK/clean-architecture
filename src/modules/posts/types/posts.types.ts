export type CreatePostDTO = {
    title: string;
    body: string;
    userId: number;
}

export interface PostEntity {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface PostModel {
    id: number;
    userId: number;
    title: string;
    body: string;
    isOdd: boolean;
}

export const POST_TYPES = {
    IPostService: Symbol.for('IPostService'),
    IPostTransformer: Symbol.for('IPostTransformer'),
    PostState: Symbol.for('PostState')
};