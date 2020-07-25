import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../store';

const IndexPage = observer(() => {
    const { postStore } = useStores();

    return (
        <div>{postStore.loading}</div>
    )
});

export default IndexPage;