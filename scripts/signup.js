const form = document.querySelector("form");
const nombre = document.querySelector("#name");
const errorNombre = document.querySelector("#errorName");

const apellido = document.querySelector("#lastName");
const errorApellido = document.querySelector("#errorLastName");

const email = document.querySelector("#email");
const errorEmail = document.querySelector("#errorEmail");

const pass = document.querySelector("#pass");
const errorPass = document.querySelector("#errorPass");
const verPass = document.querySelector("#verPass");

const repeatPass = document.querySelector("#repeatPass");
const errorRepeatPass = document.querySelector("#errorRepeatPass");

const exRegEmail =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const exRegPass =
  /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  errorNombre.innerText = "";
  errorApellido.innerText = "";
  errorEmail.innerText = "";
  errorPass.innerText = "";
  errorRepeatPass.innerText = "";

  const errores = [];

  const mensajes = {
    inputVacio: "Este campo no debe quedar vacío",
    passNoCoinciden: "Las contraseñas no coniciden",
    valoresPass:
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una minúscula, una mayúscula y un caracter no alfanumérico.",
    valoresEmail: "Escribe un correo eltrónico válido",
  };

  //Validacion nombre
  switch (nombre.value.trim()) {
    case "":
      errores.push(mensajes.inputVacio);
      errorNombre.innerText = mensajes.inputVacio;
      break;
  }

  //Validacion apellido
  switch (apellido.value.trim()) {
    case "":
      errores.push(mensajes.inputVacio);
      errorApellido.innerText = mensajes.inputVacio;
      break;
  }

  //Validacion correo
  // switch (true) {
  //   case email.value.trim() === "":
  //     errores.push(mensajes.inputVacio);
  //     errorEmail.innerText = mensajes.inputVacio;
  //     break;
  //   case !email.value.match(exRegEmail):
  //     errores.push(mensajes.valoresEmail);
  //     errorEmail.innerText = mensajes.valoresEmail;
  //     break;
  // }

  //Validacion contraseña
  switch (true) {
    case pass.value.trim() === "":
      errores.push(mensajes.inputVacio);
      errorPass.innerText = mensajes.inputVacio;
      break;
    case !pass.value.match(exRegPass):
      errores.push(mensajes.valoresPass);
      errorPass.innerText = mensajes.valoresPass;
      break;
  }

  //Validacion repetir contraseña
  switch (true) {
    case repeatPass.value === "":
      errores.push(mensajes.inputVacio);
      errorRepeatPass.innerText = mensajes.inputVacio;
      break;
    case pass.value !== repeatPass.value:
      errores.push(mensajes.passNoCoinciden);
      errorRepeatPass.innerText = mensajes.passNoCoinciden;
      break;
  }

  nombre.addEventListener("keydown", function (evento) {
    errorNombre.innerText = "";
  });

  apellido.addEventListener("keydown", function (evento) {
    errorApellido.innerText = "";
  });

  email.addEventListener("keydown", function (evento) {
    errorEmail.innerText = "";
  });

  console.log(errores);
  console.log(errores.length);

  //Validar formulario

  if (errores.length === 0) {
    const datos = {
      firstName: nombre.value,
      lastName: apellido.value,
      email: email.value,
      password: pass.value,
    };

    fetch("https://ctd-fe2-todo.herokuapp.com/v1/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then(function (res) {
        console.log(res.status);
        switch (res.status) {
          case 201:
            alert("usuario creado correctamente");
            window.location.href = "index.html";
            break;
          case 400:
            alert("El usuario ya se encuentra registrado");
            break;
        }
        return res.json();
      })
      .then(function (usuarioCreado) {
        console.log(usuarioCreado);
        //form.reset()// limpia los datos del formulario
        sessionStorage.setItem("token", usuarioCreado.jwt); //Guardo el token que se hizo cuando cree el formulario
        
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
