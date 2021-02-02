import * as yup from 'yup';

const ERRORS = {
    REQUIRED: "Поле обязательно"
}

export const CreatePostValidator = yup.object().shape({
    title: yup.string().required(ERRORS.REQUIRED),
    body: yup.string().required(ERRORS.REQUIRED),
    userId: yup.string().required(ERRORS.REQUIRED)
});