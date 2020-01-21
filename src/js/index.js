class Matrix{
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
  randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
  summaryReducer(array){
    return array.reduce( (summary, elem) => summary + elem.amount, 0);
  }  
  toFixed(num, count = 3){
    return +num.toFixed(count);
  }

advReducer(array){
  return this.toFixed(this.summaryReducer(array) / array.length)
}
  fillRows(row, i){
    for(let j = 0; j< this.cols; j++){
      let random = this.randomInteger(100,999);
      row.push({
        id: `${i}_${j}`,
        amount: random
      })
    } 
    return row  
  }
  createMatrix(){
    for(let i = 0; i < this.rows; i++){
        const row = [];
      this.fillRows(row, i);
      this.matrix.push(row)
    }
  }
   getCol(index){
    return this.matrix.map( row => row[index] );
  }
  getRow(index){
    return this.matrix[index]
  }

  calculateRow(index){
    let row = this.getRow(index);
    return this.summaryReducer(row);
  }
  
  calculateCol(index){
    let col = this.getCol(index);
    return this.advReducer(col);
  }

  calculateRows(){
    this.rowResults = this.matrix.map((row, index)=> this.calculateRow(index));    
    return this.rowResults;
  }
  calculateCols(){
    this.colResults = this.matrix[0].map((row,index) => this.calculateCol(index));
    return this.colResults
  }
  calculateMatrix(){
    this.calculateRows();
    this.calculateCols();
  }
  addRow(){
    let nextRowIndex = this.rows;

    const newRow = this.fillRows([], nextRowIndex);
    this.matrix.push(newRow);
    this.rows = this.matrix.length;
    
    let newRowResults = this.summaryReducer(newRow);
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
   
    let summNum = this.summaryReducer(matrixIndex);
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
    this.colResults[col] =  this.toFixed(this.colResults[col] + diff / this.cols);
    
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
class MatrixRender{
  constructor(matrix){
    this.matrix = matrix;
    this.rootElement = document.createElement('table');
    this.getMatrix = matrix.getMatrix();
    
    const btnAdd = document.createElement('button');
    btnAdd.innerText = 'Add row';
    btnAdd.addEventListener('click', () => {
        matrix.addRow();
    });
    let btnMinus = document.createElement('button');
    btnMinus.innerText = 'Minus Row'
       
    btnMinus.addEventListener('click', e=>{
      this.matrix.deleteRow();
    })


    document.body.insertAdjacentElement('afterend', btnAdd);
    document.body.insertAdjacentElement('afterend', btnMinus);

    matrix.subscribe(this);
    const fragment = this.render();
    this.mount(fragment);   
  }

  render(){
      const fragment = document.createDocumentFragment();
      this.getMatrix.forEach((row,index) =>{
      let tr = document.createElement('tr');
        
        tr.setAttribute('data-id', index)
        let tds = this.rowRender(row);        
        
        tds.forEach(td => tr.appendChild(td));
        
        let rowResults = this.matrix.rowResults[index];
        let td = document.createElement('td');
        td.innerText = 'result: ' + rowResults;
        td.classList.add(`row-result_${index}`);
        tr.appendChild(td);
        fragment.appendChild(tr);
      })  
      let tr = document.createElement('tr')
      let colResults = this.matrix.colResults.map((res, ind)=>{
        let td = document.createElement('td');
        td.style.paddingRight = '10px';
        td.classList.add(`col-${ind}`);
        td.innerText = res;
        tr.appendChild(td)
      }) 
     

      fragment.appendChild(tr);  
      return fragment;  
     
  }
  rowRender(data){
    return data.map(elem=>{
      let td = document.createElement('td');

      td.setAttribute('data-id', elem.id);
      td.classList.add('td-' + elem.id);
      
      td.style.paddingRight = '10px';
      
      td.innerText = elem.amount;
      td.style.position = 'relative'; 
      let rootLeft = null;
      td.addEventListener('mouseover', e=> {
      let target = e.target;
        
      let index = target.parentNode.getAttribute('data-id')
      let [row, col] = target.getAttribute('data-id').split('_');
      let res = this.matrix.hoverRowProcent(index, col);

      let resultXMount = this.matrix.xMount(target.innerText);
      let [letftNum, rigthNum] = resultXMount;
      let getIdLeft;
      let getIdRight;
      this.getMatrix.map((row, index)=>{
          row.forEach(e=>{
            if(e.amount == letftNum){
              getIdLeft = e.id           
            }else if(e.amount == rigthNum){
              getIdRight = e.id
            }else{
              return
            }
            })
        });
        let [rowLeft, colLeft] = getIdLeft.split('_');
        let [rowRight, colRight] = getIdRight.split('_');
        
        this.rootElement.childNodes[rowLeft].childNodes[colLeft].style.backgroundColor = 'red';
        this.rootElement.childNodes[rowRight].childNodes[colRight].style.backgroundColor = 'red';

        target.innerText = Math.round(res) + '%'
  
        let span = document.createElement('div');
        span.style.width = '100%';
        span.style.height = `${Math.round(res)}% `; 
        span.style.position = 'absolute';
        span.style.backgroundColor = 'red'
        td.appendChild(span);
        
      })
      td.addEventListener('mouseout', e=>{
        let target = e.target;
        // let number = target.innerText;
        // console.log(number);
       this.rootElement.childNodes.forEach(e=> e.childNodes.forEach(e=>{
         e.style.backgroundColor = 'white'
       }))
       
        
        // target.innerText = number;
        let [row, col] = target.getAttribute('data-id').split('_');
        let res = this.matrix.matrix[row][col].amount;
        target.innerText = res;
        
        
      })
      td.addEventListener('click', e=>{
        
        let target = e.target;
        
        let [row, col] = target.getAttribute('data-id').split('_');
        let value = this.matrix.matrix[row][col].amount;        
        value++;
        this.matrix.addMount(Number(row), Number(col),value);
      })
      return td
    })
  }
  
 
  mount(fragment){
    this.rootElement.appendChild(fragment)
    document.body.appendChild(this.rootElement)
  }
  reload(){
    this.rootElement.innerHTML = '';
    this.mount(this.render())
  }
  reactRow(){
    this.reload();
  }
  reactDelete(){
    this.reload();
  }
  addMount(payload){
    let {row, col} = payload;
    let cell = this.rootElement.querySelector(`.td-${row}_${col}`)  
    let val = this.matrix.cellAmount(row, col);
    cell.innerText = val;

    let colRes = this.rootElement.querySelector(`.col-${col}`);
    colRes.innerText = this.matrix.colResults[col];

    rowRes = this.rootElement.querySelector(`.row-result_${row}`);
    rowRes.innerText = 'result: '+ this.matrix.rowResults[row];
  }
  onMessage( event, payload ){
    switch (event){
        default:
            break;
        case 'addMount':
            this.addMount(payload);
            break;
        case 'newRow':
            this.reactRow();
            break;
        case 'deleteRow':
            this.reactDelete();
    }
}
}
let matrix = new Matrix(5,7);
let renderMatrix = new MatrixRender(matrix);