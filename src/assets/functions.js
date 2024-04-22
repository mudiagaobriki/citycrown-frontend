import {DateTime} from "luxon";

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

export function getObjectsWithDate(arr,dateKey){
    // console.log(DateTime.fromISO(arr[1][dateKey]))
    // console.log(DateTime.fromISO(new Date().toISOString()))
    // const {day,year,month} = DateTime.fromISO(arr[1][dateKey])
    // console.log({day,year,month})

    const getDayWeekMonth = (dt) =>{
        const {day,year,month} = DateTime.fromISO(dt)
        console.log(`Dt: ${day}-${month}-${year}`)
        return `${day}-${month}-${year}`
    }

    const result = arr.filter(el => getDayWeekMonth(el[dateKey]) === getDayWeekMonth(new Date().toISOString()))
    return result;
}