function randomInteger(min, max){
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
function summaryReducer(array){
    return array.reduce( (summary, elem) => summary + elem.amount, 0);
}  
function toFixed(num, count = 3){
    return +num.toFixed(count);
}
function advReducer(array){
    return toFixed(summaryReducer(array) / array.length)
}

export {randomInteger}  
export {summaryReducer}
export {toFixed}
export {advReducer}


