function validateNumberInput(number) {
    if (!number || number === '') {
        return "Amount is required";
    } else {
        const parsedAmount = Number(number);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            return "Enter valid amount";
        } else if (!Number.isInteger(parsedAmount)) {
            return "Enter valid amount";
        }
    }

    return null;
}

function validateTextInput(text, fieldName) {
    if (!text) {
        return `${fieldName} is required`
    } else if (text.length < 3) {
        return `Enter a valid ${fieldName}`;
    }

    return null;
}

export {validateNumberInput, validateTextInput};