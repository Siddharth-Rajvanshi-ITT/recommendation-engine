function isValidDateFormat(input: string) {
    const regexDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/;
    
    if (!regexDDMMYYYY.test(input)) {
        return false;
    }

    const [day, month, year] = input.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
}



export { isValidDateFormat}

