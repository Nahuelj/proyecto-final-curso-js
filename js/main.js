const $inputCreateTask = document.getElementById("inputCreateTask");
const $addTask = document.getElementById("addTask");
const $cleanTasks = document.getElementById("cleanTasks"); 
const $container = document.getElementById("container");
let $btnDelete = Array.from(document.querySelectorAll("#btn-delete"));
let $btnReplace = Array.from(document.querySelectorAll("#btn-replace"));
let $btnCheck = Array.from(document.querySelectorAll("#btn-check"));
let $taskText = Array.from(document.querySelectorAll("#taskText"));
let $tasks = Array.from(document.querySelectorAll(".task"));
const $date = document.getElementById("date");
const $idea = document.getElementById("idea");
loadTasks();

function updateElements(){
    $btnDelete = Array.from(document.querySelectorAll("#btn-delete"));
    $btnReplace = Array.from(document.querySelectorAll("#btn-replace"));
    $btnCheck = Array.from(document.querySelectorAll("#btn-check"));
    $taskText = Array.from(document.querySelectorAll("#taskText"));
    $tasks = Array.from(document.querySelectorAll(".task"));
}

function start(){
    updateElements();
    deleteTask();
    editText();
    replaceTask();
    check();
    saveTasks();
}
start();


// CREAR NUEVAS TAREAS
function createTask (e) {
    e.preventDefault();

    if ($inputCreateTask.value){

        const $newTask = document.createElement("div");
        $newTask.classList.add("task");
        $newTask.classList.add("created");

        let inputValue = $inputCreateTask.value;
        let card = `
        <button id="btn-check"><img src="./icons/unchecked.svg" alt=""></button>
        <p contenteditable="true" id="taskText">${inputValue}</p>
        <button id="btn-delete"><img src="./icons/delete-white.png" alt=""></button>
        <button id="btn-replace"><img src="./icons/replace-white.png" alt=""></button>
                    `
        $newTask.innerHTML = card;
        $container.appendChild($newTask);
        $inputCreateTask.value = "";
        $inputCreateTask.focus();

        start();
    }


}

$addTask.addEventListener("click", createTask);
$addTask.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
        createTask();
    }
});

// ELIMINAR TODAS LAS TAREAS EXISTENTES (CLEAN)
let previousTasks = "";

function cleanTasks(e){
    e.preventDefault();

    previousTasks = $container.innerHTML;
    $container.classList.add("deleted");

    setTimeout(() => {
        $container.innerHTML = "";
        $container.classList.remove("deleted");
        updateElements();
        saveTasks();
    }, 95);

    Toastify({
        text: "Undo change",
        duration: 3000,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #9DB2BF, #9DB2BF)",
          color: "white",
          "border-radius": "10px", 
        },
        onClick: function(){
            undoTasks(previousTasks, $container);
            start();
            saveTasks();
        } // Callback after click
      }).showToast();
}

$cleanTasks.addEventListener("click", cleanTasks);

// ELIMINAR TAREAS INDIVIDUALMENTE (DELETE)

let previusTask = "";
let positionPreviousTask = "";
function deleteTask(){
    // creamos un foreach para iterar en el array de botones y cuando clickeamos en uno se remueva eliminandose con su padre

    $btnDelete.forEach(btn => {
    btn.onclick = (e) =>{
        e.preventDefault();
        previusTask = e.target.parentNode.parentNode;
        positionPreviousTask = e.target.parentElement.parentElement.nextElementSibling;

        btn.parentElement.classList.remove("created");
        btn.parentElement.classList.add("deleted");
        setTimeout(() => {
            btn.parentElement.remove();
            btn.parentElement.classList.remove("deleted");
            btn.parentElement.classList.add("created");
            saveTasks();
        }, 90);
        

        Toastify({
            text: "Undo change",
            duration: 3000,
            close: false,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #9DB2BF, #9DB2BF)",
              color: "white",
              "border-radius": "10px", 
            },
            onClick: function(){
                undoTask(previusTask, positionPreviousTask);
                start();
                saveTasks();
            } // Callback after click
          }).showToast();
    }
});
}

// EDITAR EL TEXTO DEL PARRAFO Y QUITAR EL FOCO CON ENTER

function editText(){
    $taskText.forEach(text => {
        text.onkeydown = (e) =>{
            if(e.key === "Enter"){
                text.blur();
                saveTasks();
            }
        }
    });
}

// REEMPLAZAR TAREA SELECCIONADA POR OTRA
let $taskSelected;
let $nextTaskSelected;
let $nextTaskToChange;
function replaceTask(){
    $btnReplace.forEach(btn => {
        btn.onclick = () =>{

            if($taskSelected){
                $taskSelected.classList.remove("selected");
                removeReplaceAnimation();
                let $taskToChange = btn.parentElement;
                $nextTaskToChange = $taskToChange.nextElementSibling;

                $container.insertBefore($taskSelected, $nextTaskToChange);
                $container.insertBefore($taskToChange, $nextTaskSelected);

                $taskSelected = "";
                saveTasks();
            }
            
            
            else{

                $taskSelected = btn.parentElement;
                $taskSelected.classList.add("selected");
                applyReplaceAnimation();
                $nextTaskSelected = $taskSelected.nextElementSibling;
            }
            
        }
    });
}

function applyReplaceAnimation(){
    $btnReplace.forEach(btn => {
        if(!btn.parentElement.classList.contains("selected")){
            btn.classList.add("rotate");
        }
    });
}

function removeReplaceAnimation(){
    $btnReplace.forEach(btn => {
        btn.classList.remove("rotate");
    });
}

//CHECKEAR TAREAS REALIZADAS
function check(){
    $btnCheck.forEach(btn => {
        btn.onclick = () =>{
            let p = btn.nextElementSibling;
            let parent = btn.parentElement;
            parent.classList.toggle("checked-parent");
            p.classList.toggle("cheked")
            saveTasks();
        }
    });
}

// RENDERIZAR FECHA ACTUAL
let months = ['January','February','March','April','May','June','July','August','September','October','November','December'
];

let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

let date = new Date();
let month = months[date.getMonth()];
let day = days[date.getDay()];
let year = date.getFullYear();
let number = date.getDate();

let textDate = `${day} ${number} ${month} ${year}`;

$date.innerHTML = textDate;


// GUARDAR EN EL STORAGE LAS TAREAS

const $quote = document.getElementById("quote");
const $author = document.getElementById("author");
const $divContainer = document.getElementById("div-container-quote");
const $titleQuote = document.getElementById("title-quote");
const $category = document.getElementById("category");

function saveTasks(){
    let tasks = $container.innerHTML;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(){
    let previusTasks = JSON.parse(localStorage.getItem("tasks"));
    $container.innerHTML = previusTasks;
}

// BOTON FRASE  MOTIVACIONAL 
const url = 'https://quotes-by-api-ninjas.p.rapidapi.com/v1/quotes';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '494ab8495fmshb4d94a00c835309p14e171jsn73655ccc162f',
		'X-RapidAPI-Host': 'quotes-by-api-ninjas.p.rapidapi.com'
	}
};


fetch(url, options)
    .then(respose => respose.json())
    .then(data => {
        const quotes = data;
        renderQuote(quotes);
    })


//COLOCAMOS LO EXTRAIDO DE LA API EN EL DOM
function renderQuote(quotes){
    let textQuote = `"${quotes[0].quote}"`;
    let author = quotes[0].author;
    let category = quotes[0].category;
    $quote.innerText = textQuote;
    $author.innerText = `Author: ${author}`;
    $category.innerText = `Category: ${quotes[0].category}`
}

//HACEMOS QUE CUANDO EL BOTON SEA CLICKEADO SE VEA LA CITA DEL DIA

const $divQuote = document.getElementById("div-quote");
const $buttonQuote = document.getElementById("idea")
const $closeButton = document.getElementById("button-quote");
const $body = document.getElementById("body");


function showQuote(){
        $divQuote.classList.toggle("not-hidden");

    let bodyChildren = Array.from($body.children);
    bodyChildren.forEach(element =>{
        if(!element.classList.contains("not-hidden")){
        element.classList.toggle("blur");
        $divQuote.classList.remove("blur");
        }
    });
}

function closeQuote(){
    
    $divQuote.classList.add("hidden");
    setTimeout(() => {
        $divQuote.classList.remove("not-hidden");
        $divQuote.classList.remove("hidden");
    }, 200);

    let bodyChildren = Array.from($body.children);
    bodyChildren.forEach(element =>{
        if(!element.classList.contains("not-hidden")){
        element.classList.toggle("blur");
        $divQuote.classList.remove("blur");
        }
    });
}

$idea.addEventListener("click", showQuote);
$closeButton.addEventListener("click", closeQuote);

// TOASTIFY

function undoTasks(tasks, element){
    element.innerHTML = tasks;
}

function undoTask(task, position){
    $container.insertBefore(task, position);
}

//SETTINGS
const $buttonSettings = document.getElementById("settings");
const $divSettings = document.getElementById("divSettings");
const $buttonCloseSettings = document.getElementById("buttonCloseSettings");

function showSettings(){
    $divSettings.classList.toggle("not-hidden");

    let bodyChildren = Array.from($body.children);
    bodyChildren.forEach(element =>{
        if(!element.classList.contains("not-hidden")){
        element.classList.toggle("blur");
        $divQuote.classList.remove("blur");
        }
    });
}

function closeSettings(){
    
    $divSettings.classList.add("hidden");
    setTimeout(() => {
        $divSettings.classList.remove("not-hidden");
        $divSettings.classList.remove("hidden");
    }, 200);

    let bodyChildren = Array.from($body.children);
    bodyChildren.forEach(element =>{
        if(!element.classList.contains("not-hidden")){
        element.classList.toggle("blur");
        $divQuote.classList.remove("blur");
        }
    });
}

$buttonSettings.addEventListener("click", showSettings)
$buttonCloseSettings.addEventListener("click", closeSettings);
