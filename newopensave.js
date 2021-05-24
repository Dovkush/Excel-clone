let save=document.querySelector(".save");
let open=document.querySelector(".open");
let newSheet=document.querySelector(".new");
save.addEventListener("click",function(){
    let link=document.createElement("a");
    const data = JSON.stringify(sheetArray);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    link.download="file.json";
    link.href=url;
    link.click();
})
open.addEventListener("click",function(){
    let select=document.createElement("input");
    select.type="file";
    select.click();
        select.addEventListener("change",function(){
            let filesArr=select.files;
            let fileObj=filesArr[0];
            let fr=new FileReader(fileObj);
            fr.readAsText(fileObj);
            fr.onload=function(){
                  sheetArray=fr.result;
                  sheetArray=JSON.parse(sheetArray);
                  
                  let allsheets=document.querySelectorAll(".sheet");
               for(let i=1;i<allsheets.length;i++){
                    allsheets[i].remove();
                }
               let len=sheetArray.length-1;
                while(len!=0){
                    addBtn.click();
                    len--;
                }
                firstSheet.addEventListener("click",makeMeActive);
                firstSheet.click();
                
                  
              }
         })
        
 })
 newSheet.addEventListener("click",function(){
    let allsheets=document.querySelectorAll(".sheet");
    sheetArray=[];
     for(let i=1;i<allsheets.length;i++){
         allsheets[i].remove();
     }
     firstSheet.addEventListener("click",makeMeActive);
     firstSheet.click();
     let firstcell=document.querySelector(`.cell[rid="0"][cid="0"]`);
     firstcell.click();
});
