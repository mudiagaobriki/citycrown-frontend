export function getSumByKey(array, key) {
    // Initialize a variable to store the sum
    let sum = 0;

    // Loop through the array of objects
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < array.length; i++) {
        // Check if the current object has the specified key
        // eslint-disable-next-line no-prototype-builtins
        if (array[i].hasOwnProperty(key)) {
            // Add the value of the key to the sum
            sum += Number(array[i][key]);
        }
    }

    // Return the final sum
    return sum;
}