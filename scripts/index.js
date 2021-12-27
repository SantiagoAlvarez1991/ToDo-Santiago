// if(sessionStorage.getItem("tokenAcceso")=== null){
//   window.location.href = "mis-tareas.html";
// };
// esto es para la pagina de tareas
// para cerrar sesión primero debo limpiar el sessionStorage porque tiene el token

const form = document.querySelector("form");
const email = document.querySelector("#inputEmail");
const pass = document.querySelector("#inputPassword");
const verPass = document.querySelector("#verPass");
const errorEmail = document.querySelector("#errorEmail");
const errorPass = document.querySelector("#errorPass");


form.addEventListener("submit", function (event) {
  event.preventDefault();

  console.log(email.value);
  console.log(pass.value);

  errorEmail.innerText = "";
  errorPass.innerText = "";

  const validacionInicial = [];
  const validacionFinal = []

  const mensajes = {
    emailIncorrecto: "El usuario no existe",
    passIncorrecto: "Contraseña incorrecta",
    emailVacio: "Ingresa el email con el que te registraste",
    passVacio: "Debes ingresar tu contraseña",
    errorServidor: "Estamos solucionando un problema en el servidor, intenta ingresar más tarde"    
  };

  if (email.value.trim() === "") {
    validacionInicial.push(mensajes.emailVacio);
    errorEmail.innerText = mensajes.emailVacio;
  }

  if (pass.value.trim() === "") {
    validacionInicial.push(mensajes.passlVacio);
    errorPass.innerText = mensajes.passVacio;
  }

  console.log(validacionInicial.length);

  // Petición a la Api cuando la validación inicial es correcta

  if (validacionInicial.length === 0) {
    const datos = {
      email: email.value,
      password: pass.value,
    };

    const configuraciones = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(datos),
    };

    fetch("https://ctd-fe2-todo.herokuapp.com/v1/users/login", configuraciones)
      .then((response) => {
        console.log("error "+ response.status);
        switch (response.status) {
          case 404:
            validacionFinal.push(mensajes.emailIncorrecto);
            errorEmail.innerText = mensajes.emailIncorrecto;                        
            break;
          case 400:
            validacionFinal.push(mensajes.passIncorrecto);
            errorPass.innerText = mensajes.passIncorrecto;                       
            break;
          case 500:
            alert(mensajes.errorServidor);
          case 201:
            window.location.href = "mis-tareas.html"        
          default:
            break;            
        }      
        console.log("cantidad errores "+validacionFinal.length);   
        return response.json(); // json() me trae el body de la petición y también los parsea
      })
      .then((datoAcceso) => {
        console.log(datoAcceso)
        sessionStorage.setItem("tokenAcceso", datoAcceso.jwt);
      })
      .catch(function (e) {
        console.log(e);
      });
  }
});

verPass.addEventListener("change", function (event) {
  if (this.checked) {
    pass.setAttribute("type", "text");
  } else {
    pass.setAttribute("type", "password");
  }
});
