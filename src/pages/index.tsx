import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../store';

const IndexPage = observer(() => {
    const { postStore } = useStores();

    useEffect(() => {
        postStore.getAllPosts();
    }, [])

    return (
        <div>
            {postStore.posts.map((post) => (
                <div>{post.title}</div>
            ))}
        </div>
    )
});

export default IndexPage;