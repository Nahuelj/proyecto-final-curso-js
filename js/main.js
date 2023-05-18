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
        <button id="btn-check">check</button>
        <p contenteditable="true" id="taskText">${inputValue}</p>
        <button id="btn-delete">delete</button>
        <button id="btn-replace">replace</button>
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
function cleanTasks(e){
    e.preventDefault();
    $container.classList.add("deleted");

    setTimeout(() => {
        $container.innerHTML = "";
        $container.classList.remove("deleted");
        updateElements();
        saveTasks();
    }, 95);
}
$cleanTasks.addEventListener("click", cleanTasks);

// ELIMINAR TAREAS INDIVIDUALMENTE (DELETE)

function deleteTask(){
    // creamos un foreach para iterar en el array de botones y cuando clickeamos en uno se remueva eliminandose con su padre

    $btnDelete.forEach(btn => {
    btn.onclick = (e) =>{
        e.preventDefault();
        btn.parentElement.classList.remove("created");
        btn.parentElement.classList.add("deleted");
        setTimeout(() => {
            btn.parentElement.remove();
            saveTasks();
        }, 90);
        
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
            p.classList.toggle("cheked")
            saveTasks();
        }
    });
}

// RENDERIZAR FECHA ACTUAL
let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

let days = ["Domingo",'Lunes', 'Martes', 'Martes', "Miercoles", "Jueves", "Viernes", "Sabado"];

let date = new Date();
let month = months[date.getMonth()];
let day = days[date.getDay()];
let year = date.getFullYear();
let number = date.getDate();

let textDate = `${day} ${number} de ${month} ${year}`;

$date.innerHTML = textDate;


// GUARDAR EN EL STORAGE LAS TAREAS
function saveTasks(){
    let tasks = $container.innerHTML;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(){
    let previusTasks = JSON.parse(localStorage.getItem("tasks"));
    $container.innerHTML = previusTasks;
}

