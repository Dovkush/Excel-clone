class Stack{
    constructor(){
         this.items=[];
    }
    push(val){
      this.items.push(val);
    }
    pop(){
    if (this.items.length == 0)
    return "Underflow";
   return this.items.pop();
    }
    peek(){
        if (this.items.length == 0)
    return "Underflow";
        return this.items[this.items.length - 1];
    }
    isEmpty(){   // return true if stack is empty
    return this.items.length == 0;
    }
}

function evaluate(exp){
    var operator = new Stack();
    var operand= new Stack();
    let arr=exp.split(" ");
   
  for(let i=0;i<arr.length;i++){
      let o=arr[i];
      if(o==')'){
          while(operator.isEmpty!=true&&operator.peek()!='('){
              let val2=operand.pop();
              let val1=operand.pop();
              let op=operator.pop();
              let opv=operation(val1,val2,op);
              operand.push(opv);
          }
          operator.pop();
      }else if(o=='+'||o=='*'||o=='-'||o=='/'){
          while(operator.isEmpty()!=true&&operator.peek()!='('
                &&precedence(o)<=precedence(operator.peek())){
                    let val2=operand.pop();
                    let val1=operand.pop();
                    let op=operator.pop();
                    let opv=operation(val1,val2,op);
                    operand.push(opv);
         }
         operator.push(o);
      }else if(o=='('){
          operator.push(o);
      }else if(o>='0'&&0<='9'){
          operand.push(Number(o));
      }
 }
  while(operator.isEmpty()!=true){
    let val2=operand.pop();
    let val1=operand.pop();
    let op=operator.pop();
    let opv=operation(val1,val2,op);
    operand.push(opv);
  }
  return operand.pop();
}
function operation(val1,val2, op){
    if(op=='+'){
        return val1+val2;
    }else if(op=='-'){
        return val1-val2;
    }else if(op=='*'){
        return val1*val2;
    }else {
        return val1/val2;
    }
}
function precedence(op){
    if(op=='+'){
        return 1;
    }else if(op=='-'){
        return 1;
    }else if(op=='*'){
        return 2;
    }else{
        return 2;
    }
}