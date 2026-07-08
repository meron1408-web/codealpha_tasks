const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.innerText;

        if(value === "AC"){

            expression = "";
            display.value = "";

        }

        else if(value === "DEL"){

            expression = expression.slice(0,-1);
            display.value = expression;

        }

        else if(value === "="){

            calculate();

        }

        else{

            expression += value;
            display.value = expression;

        }

    });

});

function calculate(){

    try{

        let result = eval(expression);

        display.value = result;

        expression = result.toString();

    }

    catch{

        display.value = "Error";

        expression = "";

    }

}

document.addEventListener("keydown",(e)=>{

    const key = e.key;

    if((key>='0' && key<='9') ||
        ['+','-','*','/','.','%'].includes(key))
    {

        expression += key;

        display.value = expression;
    }

    else if(key==="Enter"){

        calculate();

    }

    else if(key==="Backspace"){

        expression = expression.slice(0,-1);

        display.value = expression;

    }

    else if(key==="Escape"){

        expression = "";

        display.value = "";

    }

});