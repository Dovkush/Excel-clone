let cells=document.querySelectorAll(".cell");
let invalidformula=document.querySelector(".invalid-formula");
let okbtn=document.querySelector(".ok-button");
//let formulaBar=document.querySelector(".formula-input");
for(let i=0;i<cells.length;i++){
    //here when we are writing or updating any cell we will store the value of cell for later use
    cells[i].addEventListener("blur",function(){
       //function or variables declared in upper js files are visible to lower files we can access them 
       let rid=cells[i].getAttribute("rid");
       let cid=cells[i].getAttribute("cid");
       let cellObj=sheetDB[rid][cid];
      
     //this is if we change a cell value forcefully(Case 3)
        if(cellObj.value!=""&&cells[i].textContent!=cellObj.value){
         let child=addressBox.value;
           updateChildsInParent(child,cellObj);
           cellObj.parent=[];
           cellObj.formula="";
       }
       cellObj.value=cells[i].textContent;
        //to update childrens of cell when we change value of cell
       updateChildrens(cellObj);
    })
}
formulaBar.addEventListener("keydown",function(e){//event on formula bar
    if(e.value!=""&&e.key=="Enter"){
        //get the fromula from fomrula bar user input formula
        let currentFormula=formulaBar.value;
        //Evaluate the formula and get value 
        let address=addressBox.value;
        let{rid,cid}=getridcid(address);
        let cellObj=sheetDB[rid][cid];
        //if we change our formula
       
        if(currentFormula!=cellObj.formula){
          updateChildsInParent(address,cellObj);
         }else if(currentFormula==cellObj.formula){
             return;
         }
        
      let value=evaluateFormula(currentFormula);
       
       //set childs in parent as if we change in cells's parent cell we can use this to change childs value
       setChildInParent(currentFormula);
       console.log(cellObj.children);
       //set parents in child as if we change in child cell then the chain of formula break and 
       //child will not get affected if we change its parent
       setParentInChild(currentFormula);
       console.log(cellObj.parent);
       let isCircle=checkIfCircle(address,cellObj);
       if(isCircle){
        
           invalidformula.style.display="block";
           updateChildsInParent(address,cellObj);
           cellObj.parent=[];
           return;
       }
     
      //set cell value after evaluating formula and set the cell value and formula in sheetDB
      setCell(value,currentFormula); 
       updateChildrens(cellObj);//in case formula is changed
       
    }
})
okbtn.addEventListener("click",function(){
    invalidformula.style.display="none";
})
function checkIfCircle(address,cellObj){
    if(cellObj.visited==true){
        return true;
    }
   cellObj.visited=true;
   let childrens=cellObj.children;
   for(let i=0;i<childrens.length;i++){
      let child=childrens[i];
      let {rid,cid}=getridcid(child);
      let childObj=sheetDB[rid][cid];
    let ifCircle = checkIfCircle(child,childObj);
       if(ifCircle){
        cellObj.visited=false;
        return true;
        }
     }
     cellObj.visited=false;
     return false;
}
function evaluateFormula(formula){
  //( A1 + A2 )
  //split(" ");
  //[(,A1,+,A2,)]
  let formulaTokens=formula.split(" ");
  for(let i=0;i<formulaTokens.length;i++){
      ascii=formulaTokens[i].charCodeAt(0);
      if(ascii>=65&&ascii<=90){
          let{rid,cid}=getridcid(formulaTokens[i]);
          let cellObj=sheetDB[rid][cid];
          let value=cellObj.value;
          if(value==""){
              formulaTokens[i]=0;
          }else{
          formulaTokens[i]=value;
          }
     }
  }
  let evaluateF=formulaTokens.join(" ");
  return evaluate(evaluateF);
}
function setCell(value,formula){
   let uicellElement=getuiCellElement();
   let rid=uicellElement.getAttribute("rid");
   let cid=uicellElement.getAttribute("cid");
   let cellObj=sheetDB[rid][cid];
   uicellElement.textContent=value;
   cellObj.value=value;
   cellObj.formula=formula;//adding formula and value of cell to sheetDB(database)
}
//sets child in parents DB
function setChildInParent(formula){
    let formulaTokens=formula.split(" ");
    let child=addressBox.value;
    for(let i=0;i<formulaTokens.length;i++){
        let ascii=formulaTokens[i].charCodeAt(0);
        if(ascii>=65&&ascii<=90){
            let{rid,cid}=getridcid(formulaTokens[i]);
            let cellObj=sheetDB[rid][cid];
            cellObj.children.push(child);
        }
    }
}
//sets parents in child DB
function setParentInChild(formula){
    let formulaTokens=formula.split(" ");
    let child=addressBox.value;
    let {rid,cid}=getridcid(child);
    let childObj=sheetDB[rid][cid];
   if(childObj.parent.length>0){
       childObj.parent=[];
   }
    for(let i=0;i<formulaTokens.length;i++){
     
        let ascii=formulaTokens[i].charCodeAt(0);
        if(ascii>=65&&ascii<=90){
           childObj.parent.push(formulaTokens[i]);
        }
    }
   
}
function updateChildsInParent(child,childObj){
    let parent=childObj.parent;
    for(let i=0;i<parent.length;i++){
       let p=parent[i];
       let{rid,cid}=getridcid(p);
       let parentObj=sheetDB[rid][cid];
        let idx=0;
      for(let i=0;i<parentObj.children;i++){
          if(chidrens[i]==child){
              idx=i;
          }
      }
      parentObj.children.splice(idx,1);
       }

}

function updateChildrens(cellObj){
    let childrens=cellObj.children;
    
     for(let i=0;i<childrens.length;i++){
       let child=childrens[i];
       let {rid,cid}=getridcid(child);
       let childObj=sheetDB[rid][cid];
       let childFormula=childObj.formula;
       let newValue = evaluateFormula(childFormula);
       setChildCell(newValue,childFormula,child);//set child cell value on UI and in sheetDB
       updateChildrens(childObj);
      }
}

function setChildCell(value,formula,child){
    let {rid,cid}=getridcid(child);
    let childcell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    childcell.textContent=value;
    let childObj=sheetDB[rid][cid];
    childObj.value=value;
    childObj.formula=formula;
}