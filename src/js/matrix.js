import
{
  randomInteger, summaryReducer, toFixed, advReducer
} from './utilsMatrix/counting';
import {calculateRow, calculateCol, fillRows} from './utilsMatrix/calculateColRow'

export default class Matrix{
    constructor(m, n){
      this.rows = m;
      this.cols = n;
      this.matrix = [];
      this.rowResults =[];
      this.colResults = [];
      this.subscribers = [];
      this.procentHover = [];
      this.createMatrix();
      this.calculateMatrix();
    }
    createMatrix(){
      for(let i = 0; i < this.rows; i++){
          const row = [];
        fillRows.call(this,row, i);
        this.matrix.push(row)
      }
    }
    calculateRows(){
      this.rowResults = this.matrix.map((row, index)=> calculateRow.call(this, index, this.matrix));    
      return this.rowResults;
    }
    calculateCols(){
      this.colResults = this.matrix[0].map((row,index) => calculateCol.call(this,index, this.matrix));
      return this.colResults
    }
    calculateMatrix(){
      this.calculateRows();
      this.calculateCols();
    }
    addRow(){
      let nextRowIndex = this.rows;

      const newRow = fillRows.call(this, [], nextRowIndex);
      this.matrix.push(newRow);
      this.rows = this.matrix.length;
      
      let newRowResults = summaryReducer(newRow);
      this.rowResults.push(newRowResults);
      this.calculateCols();
      this.notify('newRow')
    }
    deleteRow(){
      this.matrix.pop();
      this.calculateCols();
       this.rowResults.pop() 
      this.rows = this.matrix.length;
      this.notify('deleteRow')
    }
    hoverRowProcent(index, col){
      let matrixIndex = this.matrix[index];
      let number = matrixIndex[col].amount;
      let summNum = summaryReducer(matrixIndex);
      let procent =  number * 100 / summNum;
      // this.notify('hoverProcent')
      return procent;
    }
    getMountAllMatrix(){
      let mass = []
       this.matrix.map((row, index)=>{
         row.forEach(e=>{
           mass.push(e.amount)
        })
      })
      return mass;
    }
    cellAmount(row,col){
     return this.matrix[row][col].amount
    }
    addMount(row,col,value = 0){
      let oldValue = this.matrix[row][col].amount;
      
      let diff = value - oldValue;
      this.matrix[row][col].amount = value;
  
      this.rowResults[row] += diff;
      this.colResults[col] =  toFixed(this.colResults[col] + diff / this.cols);
      
      this.notify('addMount', {row, col});   
      return value;
      
    }
    xMount(num){
      let matrix1 = this.getMountAllMatrix();
  
      const closestRight = Math.min(...matrix1.filter(v => v > num));
      const closestLeft = Math.max(...matrix1.filter(v => v < num))
      let lol = [closestLeft,closestRight] ;
      return lol
    }
    getMatrix(){
      return this.matrix;
    }
    subscribe(subscriber){
      this.subscribers.push(subscriber)
    }
    notify(event, payload = {}){
      this.subscribers.forEach(sub =>{
          sub.onMessage(event, payload)
      });
    }
}