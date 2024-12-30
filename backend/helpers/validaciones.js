const convertToInteger = (value) => {
    return value !== undefined && value !== null ? parseInt(value, 10) : null;
};

const convertToFloat = (value) => {
    return value !== undefined && value !== null ? parseFloat(value) : null;
};


module.exports = { 
    convertToInteger,
    convertToFloat
};