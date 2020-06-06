function getCol(index){
  return this.matrix.map( row => row[index] );
}
function getRow(index){
  return this.matrix[index]
}
export {getCol}
export {getRow}