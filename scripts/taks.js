console.log("hola sisisi nonono");
if (
  !sessionStorage.getItem(
    "tokenAcceso" || sessionStorage.getItem("tokenAcceso") === null
  )
) {
  alert("debes iniciar sesión");
  window.location.href = "index.html";
}

const nombreUsuario = document.querySelector("#nombreUsuario");
const form = document.querySelector(".nueva-tarea");

const inputTareaNueva = document.querySelector("#nuevaTarea");

const contenedorTareasNoCompletas = document.querySelector("#skeleton");
const contenedorTareasCompletas = document.querySelector(".tareas-terminadas");
const nombreTarea = document.querySelector(".nombre");
const horaTarea = document.querySelector(".timestamp");

const cerrarSesion = document.querySelector("#closeApp");

///////////// constante GET para configurar las peticiones
const configuracionesGET = {
  method: "GET",
  headers: {
    authorization: sessionStorage.getItem("tokenAcceso"),
    "content-type": "application/json",
  },
};

/////////////// Imprimo en el banner de bienvenida el nombre del usuario

fetch("https://ctd-fe2-todo.herokuapp.com/v1/users/getMe", configuracionesGET)
  .then((response) => response.json())
  .then((datos) => {
    console.log(datos);
    console.log(datos.firstName);
    nombreUsuario.innerText += `Hola ${datos.firstName}`;
  });

///////////// Cerrar sesión
cerrarSesion.addEventListener("click", function (event) {
  sessionStorage.clear("tokenAcceso");
  window.location.href = "index.html";
});

///////////// pido a la API las tareas que hice antes y las imprimo

function getTasks(){

fetch("https://ctd-fe2-todo.herokuapp.com/v1/tasks", configuracionesGET)
  .then((response) => response.json())
  .then((lista) => {
    console.log(lista);
    contenedorTareasNoCompletas.innerHTML = "";
    lista.forEach((tarea) => imprimirTarea(tarea));

    let botonesCompletarTarea = document.querySelectorAll(".not-done");
    botonesCompletarTarea.forEach((elboton) => {
      elboton.addEventListener("click", function () {
        let tareaId = elboton.parentElement.dataset.id;
        fetch(`https://ctd-fe2-todo.herokuapp.com/v1/tasks/${tareaId}`, {
          method: "PUT",
          headers: {
            authorization: sessionStorage.getItem("tokenAcceso"),
            "content-type": "application/json",
          },
          body: JSON.stringify({
            completed: true,
          }),
        })
          .then((res) => res.json())
          .then((datos) => {
            getTasks()
          });
      });
    });
  });
}

getTasks();

////////// funcion para imprimir tareas en el HTML

function imprimirTarea(tarea) {
  const timeStamp = new Date(tarea.createdAt);
  if (tarea.completed == true) {
    contenedorTareasCompletas.innerHTML += `<li class="tarea" data-id="${
      tarea.id
    }">
        <div class="not-done"></div>
        <div class="descripcion">
        <p class="nombre">${tarea.description}</p>
        <p class="timestamp">Creada: ${timeStamp.toLocaleDateString()}</p>
        </div>
      </li>`;
  } else {
    contenedorTareasNoCompletas.innerHTML += `<li class="tarea" data-id="${
      tarea.id
    }">
        <div class="not-done"></div>
        <div class="descripcion">
        <p class="nombre">${tarea.description}</p>
        <p class="timestamp">Creada: ${timeStamp.toLocaleDateString()}</p>
        </div>
      </li>`;
  }
}

////////////////// Formulario para hacer nueva tarea
form.addEventListener("submit", (event) => {
  event.preventDefault();

  /////////////// Envío la tarea a la API y la imprimo en pantalla

  if (inputTareaNueva.value === "") {
    form.classList.add("tareaError");
    inputTareaNueva.setAttribute(
      "placeholder",
      "Debes escribir una tarea nueva"
    );
    inputTareaNueva.onkeypress = function () {
      form.classList.remove("tareaError");
      inputTareaNueva.setAttribute("placeholder", "Nueva tarea");
    };
  } else {
    //////// constante POST para configurar las peticiones
    const configuracionPOST = {
      method: "POST",
      headers: {
        authorization: sessionStorage.getItem("tokenAcceso"),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        description: inputTareaNueva.value,
        completed: false,
      }),
    };

    fetch("https://ctd-fe2-todo.herokuapp.com/v1/tasks", configuracionPOST)
      .then((response) => response.json())
      .then((tarea) => {        
        console.log(tarea);        
        imprimirTarea(tarea);

        let botonesCompletarTarea = document.querySelectorAll(".not-done");
        botonesCompletarTarea.forEach((elboton) => {
          elboton.addEventListener("click", function () {
            let tareaId = elboton.parentElement.dataset.id;
            fetch(`https://ctd-fe2-todo.herokuapp.com/v1/tasks/${tareaId}`, {
              method: "PUT",
              headers: {
                authorization: sessionStorage.getItem("tokenAcceso"),
                "content-type": "application/json",
              },
              body: JSON.stringify({
                completed: true,
              }),
            })
              .then((res) => res.json())
              .then((datos) => {
                console.log(datos);
                getTasks()
              });
          });
        });
      });
  }
});

// fetch("https://ctd-fe2-todo.herokuapp.com/v1/tasks", configuracionesGET)
//             .then((response) => response.json())
//             .then((lista) => {
//               console.log(lista);
//               lista.forEach((tarea) => imprimirTarea(tarea));
//             });
