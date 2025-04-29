const validateFields = (obj) => {
    for (const field in obj) {
        if (!obj[field] || obj[field].trim() === '') {
            return { isValid: false, missingField: field };
        }
    }
    return { isValid: true };
};

module.exports = {
    validateFields
};
