import React, { FC } from 'react';
import { observer } from 'mobx-react';
import styled from "styled-components";
import { useStore, wrapper } from '../store';
import CreatePost from '../features/Home/CreatePost';
import Posts from '../features/Home/Posts';
import { CreatePostDTO } from '../domain/post/dto/create-post-dto';

const StyledContainer = styled.div``;

const IndexPage: FC<any> = observer(({ posts }) => {
    const { postStore } = useStore();

    const handlePostCreate = async (post: CreatePostDTO) => {
        await postStore.createPost(post);
        postStore.getAllPosts();
    }

    console.log(postStore?.posts)

    return (
        <StyledContainer>
            <CreatePost onCreatePost={handlePostCreate} />
            <Posts posts={posts} />
        </StyledContainer>
    )
});

export const getServerSideProps = wrapper.getServerSideProps(
    async ({ store }) => {
        await store.postStore.getAllPosts();
        return { props: { posts: store.postStore.posts } }
    }
);
export default IndexPage;