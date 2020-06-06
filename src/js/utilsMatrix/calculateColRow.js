 import { getCol, getRow } from './getColRow'
 import { summaryReducer, advReducer, randomInteger } from '../utilsMatrix/counting';
function calculateRow(index){
    let row = getRow.call(this, index);
    return summaryReducer(row);
}
function calculateCol(index){
  let col = getCol.call(this, index);
  return advReducer(col);
}
function fillRows(row, i){
  for(let j = 0; j< this.cols; j++){
    let random = randomInteger(100,999);
    row.push({
      id: `${i}_${j}`,
      amount: random
    })
  } 
  return row  
}
export {calculateRow}
export {calculateCol}
export {fillRows}