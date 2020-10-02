import React, { FC } from 'react';
import { InferGetServerSidePropsType } from 'next'
import { observer } from 'mobx-react-lite';
import styled from "styled-components";
import { postStore, useStores } from '../store';
import CreatePost from '../features/Home/CreatePost';
import Posts from '../features/Home/Posts';
import { CreatePostDTO } from '../domain/post/dto/create-post-dto';

const StyledContainer = styled.div``;

const IndexPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = observer(({ posts }) => {
    const { postStore } = useStores();

    const handlePostCreate = async (post: CreatePostDTO) => {
        await postStore.createPost(post);
        postStore.getAllPosts();
    }

    return (
        <StyledContainer>
            <CreatePost onCreatePost={handlePostCreate} />
            <Posts posts={posts} />
        </StyledContainer>
    )
});

export const getServerSideProps = async (ctx) => {
    await postStore.getAllPosts();
    return { props: { posts: postStore.posts } }
}

export default IndexPage;