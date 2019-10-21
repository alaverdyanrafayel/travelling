export default (errors) => {
    let convertedErrors = {};

    Object.keys(errors).map(input => {
        if (errors[input].msg && typeof errors[input].msg === 'string') {
            convertedErrors[input] = errors[input].msg;
        } else if (errors[input] && typeof errors[input] === 'string') {
            convertedErrors[input] = errors[input];
        }
    });

    return convertedErrors;
};
