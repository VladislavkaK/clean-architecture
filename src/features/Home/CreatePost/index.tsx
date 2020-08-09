import React, { FC } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import { CreatePostDTO } from "../../../domain/post/dto/create-post-dto";
import { CreatePostValidator } from "../../../domain/post/validator/create-post.validator";

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledHeader = styled.div`
    font-size: 20px;
    font-weight: bold;
`

const StyledFormContainer = styled.div`
    display: grid;
    grid-template-columns: 300px;
    grid-gap: 5px;
    justify-content: center;
`

interface CreatePostProps {
    onCreatePost: (post: CreatePostDTO) => void;
}

const CreatePost: FC<CreatePostProps> = ({
    onCreatePost
}) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            body: '',
            userId: 0,
        },
        validationSchema: CreatePostValidator,
        onSubmit: (values) => {
            onCreatePost(values);
        }
    });

    return (
        <StyledContainer>
            <StyledHeader>
                Добавить новую запись
            </StyledHeader>
            <form onSubmit={formik.handleSubmit}>
                <StyledFormContainer>
                    <input name="title" value={formik.values.title} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                    {formik.touched.title && formik.errors.title && (
                        <div>{formik.errors.title}</div>
                    )}
                    <input name="body" value={formik.values.body} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                    {formik.touched.body && formik.errors.body && (
                        <div>{formik.errors.body}</div>
                    )}
                    <input name="userId" type="number" value={formik.values.userId} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                    {formik.touched.userId && formik.errors.userId && (
                        <div>{formik.errors.userId}</div>
                    )}
                    <button type="submit">Создать</button>
                </StyledFormContainer>
            </form>
        </StyledContainer>
    )
}

export default CreatePost;