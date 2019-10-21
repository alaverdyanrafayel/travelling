export default (reducers, cleaners, store) => {
    const state = store.getState(),
        { dispatch } = store;

    reducers.forEach(reducer => {
        const data = state.get(reducer);
        if (data) {
            const fields = data.get('fields');
            const errors = data.get('errors');
            const messages = data.get('messages');
            if (
                (fields && fields.size > 0) ||
                (errors && errors.size > 0) ||
                (messages && messages.size > 0)
            ) {
                dispatch(cleaners[reducer].clear());
            } else if (cleaners[reducer].always) {
                dispatch(cleaners[reducer].clear());
            }
        }
    });
};
