// Call updateHistoryDisplay on page load
document.addEventListener("DOMContentLoaded", function () {
    updateHistoryDisplay(); 
});

let input = document.getElementById("display");
let historyContainer = document.querySelector(".history-container");
let history_array;
try {
    history_array = JSON.parse(localStorage.getItem('history'));
} catch (error) {
    history_array = [];
}
let parentContainer = document.getElementById("parent")
let isAnyResult = false;

function enter_value(n1) {

   if(isAnyResult){
         input.value = "";
         isAnyResult = false;
   }

    if (["+", "-", "*", "÷", "%"].includes(n1)) //checking if n1 is a symbol and if yes then it proceeds further
    {
        if (input.value === "" || ["+", "-", "*", "÷", "%"].includes(input.value.slice(-1))) {
            return;
        }
    }
    input.value += n1;
}

function all_remove() {
    input.value = "";
}

function calculation() {
    try {
        let expression = input.value.replace("÷", "/");  //bcz previously for division code has been used
        let result;

        if (expression.includes("%")) {
           
            let parts = expression.split("%");
            let number = parseFloat(parts[0]); // The number before the %
            result = number / 100;

            input.value = result;
        } else {
            result = eval(expression);
            input.value = result;
        }

        // Save the calculation to history
        history_array.push(`${expression} = ${result}`);
        // Update history display after each calculation
        updateHistoryDisplay();
        isAnyResult = true;

    } catch (error) {
        input.value = "Error"; // Display an error message if the expression is invalid
    }
}

function updateHistoryDisplay() {
    historyContainer.innerHTML = ""; // Clear existing history

    if (history_array.length === 0) {
        let nohistory = document.createElement("div"); //to display text when it is empty
        nohistory.className = "nohistory";
        nohistory.textContent = "There's no history yet.";
        historyContainer.appendChild(nohistory);

    }
    else {
        history_array.forEach((entry) =>

        {
            let historyItem = document.createElement("div");
            
            historyItem.className = "history-item";
           
            historyItem.textContent = entry;
           
            historyContainer.appendChild(historyItem);
            
        });
    }

    localStorage.setItem('history', JSON.stringify(history_array));
}

function toggleHistory() {
    parentContainer.style.display = (parentContainer.style.display === "none" || parentContainer.style.display === "")
        ? "block"
        : "none";  //(condition) ? value_if_true : value_if_false;  

}

function delete_history() {
    history_array = [];
    updateHistoryDisplay();
}


document.addEventListener("keydown", function (event) {
    
    if (!isNaN(event.key)) {
        enter_value(event.key);
    }
   
    else if (["+", "-", "*", "/", "%","."].includes(event.key)) {
        enter_value(event.key === "/" ? "÷" : event.key); // Replace '/' with '÷'
    }
   
    else if (event.key === "Enter") {
        calculation();
    }
    
    else if (event.key === "Backspace") {
        input.value = input.value.slice(0, -1);
    }
    
    else if (event.key === "Escape") {
        all_remove();
    }
});
