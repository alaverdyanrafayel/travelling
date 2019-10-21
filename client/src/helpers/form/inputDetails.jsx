export default (errors, name) => {
    let error = '';

    if (errors[name] && errors[name].length > 0) {
        error = errors[name];
    }

    return error;

};
