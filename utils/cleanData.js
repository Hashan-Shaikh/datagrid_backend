//clean every row for dashes and extra spaces
const cleanData = (row) => {
    for (const key in row) {
        const value = row[key];
        row[key] = value === '-' ? null : value.trim().replace(/\s+/g, ' ');
    }
    return row;
};

module.exports =  cleanData;
