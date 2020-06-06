import Matrix from './matrix'
import MatrixRender from './matrixRender'

let matrix = new Matrix(5,7);
let renderMatrix = new MatrixRender(matrix);

const btnAdd = document.createElement('button');
      btnAdd.innerText = 'Add row';
      btnAdd.addEventListener('click', () => {
          matrix.addRow();
      });
      let btnMinus = document.createElement('button');
      btnMinus.innerText = 'Minus Row'
         
      btnMinus.addEventListener('click', e=>{
        matrix.deleteRow();
      })
      document.body.insertAdjacentElement('afterend', btnAdd);
      document.body.insertAdjacentElement('afterend', btnMinus);