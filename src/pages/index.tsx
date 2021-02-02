import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import styled from "styled-components";
import { useStore, wrapper } from '../core/store';
import { CreatePost, Posts, CreatePostDTO } from '../modules/posts';

const StyledContainer = styled.div``;

const IndexPage = observer<any>(() => {
    const { postState } = useStore();

    useEffect(() => {
        postState.getAllPosts();
    }, [])

    const handlePostCreate = async (post: CreatePostDTO) => {
        await postState.createPost(post);
        postState.getAllPosts();
    }

    if (postState.isPostFetching) return 'Loading...';

    return (
        <StyledContainer>
            <CreatePost onCreatePost={handlePostCreate} />
            <Posts posts={postState.posts} />
        </StyledContainer>
    )
});

export default IndexPage;