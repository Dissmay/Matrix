
export default class MatrixRender{
    constructor(matrix){
      this.matrix = matrix;
      this.rootElement = document.createElement('table');
      this.getMatrix = matrix.getMatrix();
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
      this.matrix.colResults.map((res, ind)=>{
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
  
      let rowRes = this.rootElement.querySelector(`.row-result_${row}`);
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