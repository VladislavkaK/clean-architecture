import React, { FC } from "react";
import styled from "styled-components";
import { PostModel } from "../../../domain/post/model/post.model";

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
    justify-items: center;
    margin-top: 25px;
`;

const StyledPost = styled.div`
    max-width: 30%;
`;

const StyledPostHeader = styled.div`
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    color: #000;
`;

const StyledPostBody = styled.div`
    font-size: 16px;
    color: #676767;
`;

interface PostsProps {
    posts: PostModel[];
}

const Posts: FC<PostsProps> = ({
    posts
}) => {
    return (
        <StyledContainer>
            {posts.map((post) => (
                <StyledPost key={post.id}>
                    <StyledPostHeader>
                        {post.title}
                    </StyledPostHeader>
                    <StyledPostBody>
                        {post.body}
                    </StyledPostBody>
                </StyledPost>
            ))}
        </StyledContainer>
    )
}

export default Posts;