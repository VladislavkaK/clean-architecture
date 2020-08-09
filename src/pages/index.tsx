import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from "styled-components";
import { useStores } from '../store';
import CreatePost from '../features/Home/CreatePost';
import Posts from '../features/Home/Posts';
import { CreatePostDTO } from '../domain/post/dto/create-post-dto';

const StyledContainer = styled.div``;

const IndexPage = observer(() => {
    const { postStore } = useStores();

    useEffect(() => {
        postStore.getAllPosts();
    }, []);

    const handlePostCreate = async (post: CreatePostDTO) => {
        await postStore.createPost(post);
        postStore.getAllPosts();
    }

    return (
        <StyledContainer>
            <CreatePost onCreatePost={handlePostCreate} />
            <Posts posts={postStore.posts} />
        </StyledContainer>
    )
});

export default IndexPage;