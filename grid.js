let rows=100;
let col=26;
let leftCol=document.querySelector(".left-col");
let topRow=document.querySelector(".top-row");
let grid=document.querySelector(".grid");
let Boldbtn=document.querySelector(".bold");
let italicbtn=document.querySelector(".italic");
let underlinebtn=document.querySelector(".underline");
let addressBox=document.querySelector(".address-input");
let fontSize=document.querySelector(".font-size");
let fontFamily=document.querySelector(".font-family");
let textcolor=document.querySelector(".text-color");
let fontcolor=document.querySelector(".font-color")
let backgroundColor=document.querySelector(".background-color");
let alignmentContainer=document.querySelectorAll(".alignment-container>*");
let center=document.querySelector(".center");
let formulaBar=document.querySelector(".formula-input");
//to create top row
for(let i=0;i<rows;i++){
    let div=document.createElement("div");
    div.textContent=i+1;
    div.setAttribute("class","box");
    leftCol.appendChild(div);
}
//to create left col
for(let i=0;i<col;i++){
    let div=document.createElement("div");
    div.textContent=String.fromCharCode(65+i);
    div.setAttribute("class","cell");
    topRow.appendChild(div);
}
//to create cells in Grid or to create a whole grid
for(let i=0;i<rows;i++){
    let row=document.createElement("div");
    row.setAttribute("class","row");
    for(let j=0;j<col;j++){
        let cell=document.createElement("div");
       // cell.textContent=`${String.fromCharCode(65+j)} ${i+1}`
        cell.setAttribute("class","cell");
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);
        cell.setAttribute("contenteditable","true");
        row.appendChild(cell);
        cell.addEventListener("click",handleAddressBox);
        
    }
    grid.appendChild(row);
}
let sheetArray=[];
let sheetDB=[];
let addBtn=document.querySelector(".add");
let firstSheet=document.querySelector(".sheet");
firstSheet.addEventListener("click",makeMeActive);
firstSheet.click();
let sheetList=document.querySelector(".sheet-list");
addBtn.addEventListener("click",function(){
   let newSheet=document.createElement("div");
   let sheets=document.querySelectorAll(".sheet");
   newSheet.setAttribute("class","sheet");
   let lastSheet=sheets[sheets.length-1];
   let idx=lastSheet.getAttribute("idx");
   idx=Number(idx);
   for(let i=0;i<sheets.length;i++){
       sheets[i].classList.remove("active");
       sheets[i].style.borderBottom="none";
   }
   newSheet.setAttribute("idx",idx+1);
   newSheet.textContent=`Sheet ${idx+2}`;
   newSheet.classList.add("active");
   sheetList.appendChild(newSheet);
   newSheet.style.borderBottom="4px solid green";
   createSheet();
   sheetDB=sheetArray[idx+1];
   setUI();
   newSheet.addEventListener("click",makeMeActive);

})
function makeMeActive(e){
    let clicked=e.currentTarget;
    let sheets=document.querySelectorAll(".sheet");
    for(let i=0;i<sheets.length;i++){
        sheets[i].classList.remove("active");
        sheets[i].style.borderBottom="none";
    }
    clicked.classList.add("active");
    clicked.style.borderBottom="4px solid green";
    let idx=clicked.getAttribute("idx");
    if(!sheetArray[idx]){
    createSheet();
    }
    
   sheetDB=sheetArray[idx];
   
   setUI();
}
//data base of our grid every cell is represented by a object in this dataBase
function createSheet(){
    let newDB=[];
    for(let i=0;i<rows;i++){
        let row=[];
        for(let j=0;j<col;j++){
            let cell={
                bold:"normal",
                underline:"none",
                italic:"normal",
                textColor:"#000000",
                backgroundColor:"#000000",
                fontSize:16,
                fontfamily:"sans-serif",
                align:"center",
                value:"",
                formula:"",
                children:[],
                parent:[],
                visited:false,
            }
            let cellUI=document.querySelector(`.grid .cell[rid="${i}"][cid="${j}"]`);
            cellUI.textContent="";
            row.push(cell);
         }
        newDB.push(row);
      }
      sheetArray.push(newDB);
}
function setUI(){
   
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let cell=document.querySelector(`.grid .cell[rid="${i}"][cid="${j}"]`);
            let cellObj=sheetDB[i][j];
            cell.textContent=cellObj.value;
           setFormating(cellObj,cell);
        }
    }
}
function setFormating(cellObj,cell){
    if(cellObj.formula){
        formulaBar.value=cellObj.formula;
        
      }else{
          formulaBar.value="";
      }
      //cell Bold check
     if(cellObj.bold=="bold"){
         Boldbtn.classList.add("active-btn");
         cell.style.fontWeight="bold";
      }else{
         Boldbtn.classList.remove("active-btn");
         cell.style.fontWeight="normal";
      }
      //cell Underline check
      if(cellObj.underline=="none"){
         underlinebtn.classList.remove("active-btn");
         cell.style.textDecoration="none";
     }else{
         underlinebtn.classList.add("active-btn");
         cell.style.textDecoration="underline";
     }
     //cell italic check
     if(cellObj.italic=="normal"){
         italicbtn.classList.remove("active-btn");
         cell.style.fontStyle= "normal";
     }else{
         italicbtn.classList.add("active-btn");
         cell.style.fontStyle= "italic";
     }
     //cell alignment check
     let align=cellObj.align;
     if(align=="center"){
         for(let j=0;j<alignmentContainer.length;j++){
          alignmentContainer[j].classList.remove("active-btn");
         }
         center.classList.add("active-btn");
         cell.style.textAlign="center";
     }else if (align!="center"){
         for(let j=0;j<alignmentContainer.length;j++){
             if(align==alignmentContainer[j].classList[0]){
                 alignmentContainer[j].classList.add("active-btn");
                 cell.style.textAlign=align;
             }else{
                 alignmentContainer[j].classList.remove("active-btn");
                 center.classList.remove("active-btn");
             }
         }
     }
    
     //Font size check
     if(cellObj.fontSize!=16){
         fontSize.value=cellObj.fontSize;
         let size=cellObj.fontSize+"px";
         cell.style.fontSize=size;
     }else if(cellObj.fontSize==16){
         fontSize.value=16
         cell.style.fontSize="16px";
     }
     //font Family check
     if(cellObj.fontfamily!="sans-serif"){
         fontFamily.value=cellObj.fontfamily;
         cell.style.fontFamily=cellObj.fontFamily;
     }else{
         fontFamily.value="sans-serif";
         cell.style.fontFamily="sans-serif";
     }
     //text Color check
     if(cellObj.textColor!="#000000"){
         textcolor.value=cellObj.textColor;
         cell.style.color=cellObj.textColor;
     }else{
         textcolor.value="#000000";
         cell.style.color="#000000";
     }
     //background color check
     if(cellObj.backgroundColor!="#000000"){
         backgroundColor.value=cellObj.backgroundColor;
         cell.style.background=cellObj.textColor;
     }else{
         backgroundColor.value="#000000";
       //  cell.style.background="#000000";
     }
}
//as by default address Box holds address of first cell so to put first cell address in adrdessBox 
let firstcell=document.querySelector(`.cell[rid="0"][cid="0"]`);
firstcell.click();

//function to handle address Box
function handleAddressBox(e){
    
   let clickedcell=e.currentTarget; 
    let rid=clickedcell.getAttribute("rid");
    let cid=clickedcell.getAttribute("cid");
    rid=Number(rid);
    cid=Number(cid);
    let address=`${String.fromCharCode(65+cid)}${rid+1}`;
     addressBox.value=address;
     cellObj=sheetDB[rid][cid];
     //console.log(cellObj.children);
     //console.log(cellObj.parent);
     //formula bar check set cells formula into formula bar
     if(cellObj.formula){
       formulaBar.value=cellObj.formula;
     }else{
         formulaBar.value="";
     }
     //cell Bold check
     if(cellObj.bold=="bold"){
         Boldbtn.classList.add("active-btn");
     }else{
         Boldbtn.classList.remove("active-btn");
     }
     //cell Underline check
     if(cellObj.underline=="none"){
        underlinebtn.classList.remove("active-btn");
    }else{
        underlinebtn.classList.add("active-btn");
    }
    //cell italic check
    if(cellObj.italic=="normal"){
        italicbtn.classList.remove("active-btn");
    }else{
        italicbtn.classList.add("active-btn");
    }
    //cell alignment check
    let align=cellObj.align;
    if(align=="center"){
        for(let j=0;j<alignmentContainer.length;j++){
         alignmentContainer[j].classList.remove("active-btn");
        }
        center.classList.add("active-btn");
    }else if (align!="center"){
        for(let j=0;j<alignmentContainer.length;j++){
            if(align==alignmentContainer[j].classList[0]){
                alignmentContainer[j].classList.add("active-btn");
            }else{
                alignmentContainer[j].classList.remove("active-btn");
                center.classList.remove("active-btn");
            }
        }
    }
   
    //Font size check
    if(cellObj.fontSize!=16){
        fontSize.value=cellObj.fontSize;
    }else if(cellObj.fontSize==16){
        fontSize.value=16
    }
    //font Family check
    if(cellObj.fontfamily!="sans-serif"){
        fontFamily.value=cellObj.fontfamily;
    }else{
        fontFamily.value="sans-serif";
    }
    //text Color check
    if(cellObj.textColor!="#000000"){
        textcolor.value=cellObj.textColor;
    }else{
        textcolor.value="#000000";
        
    }
    //background color check
    if(cellObj.backgroundColor!="#000000"){
        backgroundColor.value=cellObj.backgroundColor;
    }else{
        backgroundColor.value="#000000";
    }

}
//***********Formatting**********/
//for Bold
Boldbtn.addEventListener("click",function(){
    let uicellElement=getuiCellElement();
    let rid=uicellElement.getAttribute("rid");
    let cid=uicellElement.getAttribute("cid");
    let cellObj=sheetDB[rid][cid];
    if(cellObj.bold=="normal"){
        Boldbtn.classList.add("active-btn");
        cellObj.bold="bold";
        uicellElement.style.fontWeight="bold";
    }else{
        Boldbtn.classList.remove("active-btn");
        cellObj.bold="normal";
        uicellElement.style.fontWeight="normal";
    }
    //uicellElement.style.fontWeight="bold";
})
// text-decoration: underline||none Making Underline
underlinebtn.addEventListener("click",function(){
    let uicellElement=getuiCellElement();
    let rid=uicellElement.getAttribute("rid");
    let cid=uicellElement.getAttribute("cid");
    let cellObj=sheetDB[rid][cid];
    if(cellObj.underline=="none"){
        underlinebtn.classList.add("active-btn");
        cellObj.underline="underline";
        uicellElement.style.textDecoration="underline";
    }else{
        underlinebtn.classList.remove("active-btn");
        cellObj.underline="none";
        uicellElement.style.textDecoration="none";
    }
})
//font-style: italic||normal; Making Italic
italicbtn.addEventListener("click",function(){
    let uicellElement=getuiCellElement();
    let rid=uicellElement.getAttribute("rid");
    let cid=uicellElement.getAttribute("cid");
    let cellObj=sheetDB[rid][cid];
    
    if(cellObj.italic=="normal"){
        italicbtn.classList.add("active-btn");
        cellObj.italic="italic";
        uicellElement.style.fontStyle= "italic";
    }else{
        italicbtn.classList.remove("active-btn");
        cellObj.italic="normal";
        uicellElement.style.fontStyle= "normal";
    }
    
})
//font-size
fontSize.addEventListener("change",function(){
   let size=fontSize.value;
   sizepx=size+"px";
    let uicellElement=getuiCellElement();
   uicellElement.style.fontSize=sizepx;
   let rid=uicellElement.getAttribute("rid");
   let cid=uicellElement.getAttribute("cid");
   let cellObj=sheetDB[rid][cid];
   cellObj.fontSize=size;
})
//font-family
fontFamily.addEventListener("change",function(){
    let family=fontFamily.value;
    let uicellElement=getuiCellElement();
    uicellElement.style.fontFamily=family;
    let rid=uicellElement.getAttribute("rid");
    let cid=uicellElement.getAttribute("cid");
    let cellObj=sheetDB[rid][cid];
    cellObj.fontfamily=family;
})
//alignment

for(let i=0;i<alignmentContainer.length;i++){
alignmentContainer[i].addEventListener("click",function(e){
    let align=e.currentTarget.classList[0];
   let uicellElement=getuiCellElement();
   let rid=uicellElement.getAttribute("rid");
   let cid=uicellElement.getAttribute("cid");
   let cellObj=sheetDB[rid][cid];
   
   if(cellObj.align=="center"){
        if(align!="center"){
            for(let j=0;j<alignmentContainer.length;j++){
                alignmentContainer[j].classList.remove("active-btn");
            }
         //   center.classList.remove("active-btn");
            e.currentTarget.classList.add("active-btn");
            cellObj.align=align;
            uicellElement.style.textAlign=align;
          
        }
   }else if(cellObj.align!="center"){
       if(cellObj.align==align){
           e.currentTarget.classList.remove("active-btn");
           cellObj.align="center";
           uicellElement.style.textAlign="center";
           center.classList.add("active-btn");
       }else if(align!=cellObj.align){
           
        for(let j=0;j<alignmentContainer.length;j++){
            alignmentContainer[j].classList.remove("active-btn");
        }
      
       // center.classList.remove("active-btn");
        e.currentTarget.classList.add("active-btn");
        cellObj.align=align;
        uicellElement.style.textAlign=align;
       }
   }
})
}
//text color

textcolor.addEventListener("change",function(e){
     let color=e.target.value;
    let uicellElement=getuiCellElement();
    uicellElement.style.color=color;
    let rid=uicellElement.getAttribute("rid");
   let cid=uicellElement.getAttribute("cid");
   let cellObj=sheetDB[rid][cid];
   cellObj.textColor=color;
})
//background-Color
backgroundColor.addEventListener("change",function(e){
    let color=e.target.value;
    let uicellElement=getuiCellElement();
    uicellElement.style.backgroundColor=color;
    let rid=uicellElement.getAttribute("rid");
   let cid=uicellElement.getAttribute("cid");
   let cellObj=sheetDB[rid][cid];
   cellObj.backgroundColor=color;
})
//returns cell element whose address is present in address Box
function getuiCellElement(){
    let address=addressBox.value;
    let ridcidObj=getridcid(address);
    let rid=ridcidObj.rid;
    let cid=ridcidObj.cid;
    let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    return cell;
}
//return rid and cid by giving it address only
function getridcid(address){
    let j=Number(address.charCodeAt(0))-65;
    let i=Number(address.slice(1))-1;
    return {"rid":i,"cid":j};
}
