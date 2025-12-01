function registrarUsuario(){
//crear variable: nombre, apellido, correo, clave,confirmacion de clave,
let nombre=document.getElementById("nombres").value;
let apellido=document.getElementById("apellidos").value;
let correo=document.getElementById("correo").value;
let clave=document.getElementById("clave").value;
let confimacionClave=document.getElementById("confirmarClave").value;
let fechaNcimiento=document.getElementById("fechaNacimiento").value;
//validar que los campos no esten vacios
if(nombre=="" || apellido=="" || correo==""||clave==""||confimacionClave==""||fechaNcimiento==""){
    alert("Por favor complete todos los campos");
    return;
}
if(clave!=confimacionClave){
    alert("Las contraseñas no coinciden");
    document.getElementById("clave").style.border="1px solid red";
    document.getElementById("confirmarClave").style.border="1px solid red";
    return;
}
// Validar mínima longitud de contraseña
if (clave.length < 8) {
    alert("La clave debe tener mínimo 8 caracteres. 🔐");
    document.getElementById('clave').style.borderColor = 'red';
    return;
}

// Validar que el usuario no este registrado
if (localStorage.getItem('usuario_' + correo)) {
    alert('El correo ya está registrado');
    return;
}

// se crea el objeto para guardarlo en localstorage
let usuario = {
    nombres: nombre,
    apellidos: apellido,
    correo: correo,
    clave: clave,
    fechaNacimiento: fechaNcimiento,
};

//Guardar los datos en localstorage
localStorage.setItem('usuario_' + correo, JSON.stringify(usuario));
alert('Registro exitoso');
window.location.href = 'index.html';
}

function iniciarSesion(){
    let correo=document.getElementById("correo").value;
    let clave=document.getElementById("clave").value;   
    let datos=localStorage.getItem('usuario_' + correo);
    if(!datos){
        alert("Usuario no encontrado");
        return;
    }

    let usuario=JSON.parse(datos);
    if(usuario.clave!=clave){
        alert("Clave incorrecta");
        return;
    }

localStorage.setItem("usuarioActivo", correo);
window.location.href="inicio.html";


}

function mostrarBienvenida() {
    let correoActivo = localStorage.getItem('usuarioActivo');
    if (!correoActivo) { // Si no hay usuario activo, redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
        return;
    }
    let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
    // Obtener los datos del usuario activo
    if (!datos) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('mensajeBienvenida').innerHTML = `¡Bienvenido/a, <a href="perfil.html">${datos.nombres}</a>!`;

    mostrarTareas(); // Mostrar tareas al cargar
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo'); // Eliminar el usuario activo del almacenamiento local
    const confirmar = confirm("¿Deseas salir del sitio?");

    if (confirmar) {
        alert("Gracias por visitar la página. ¡Hasta pronto!");

        setTimeout(() => {
            window.location.href = "https://www.google.com";
        }, 500);

    } else {
        alert(" Qué bueno que decidiste quedarte.");
    }
}

function guardarTarea() {
let tarea = document.getElementById('nuevaTarea').value;

  if (!tarea.trim()) { // Validar que la tarea no esté vacía o solo contenga espacios
    alert('Por favor, ingresa una tarea válida');
    return;
}

let correoActivo = localStorage.getItem('usuarioActivo');
let listaTareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];
  // Obtener tareas del usuario activo o inicializar un array vacio

  listaTareas.push(tarea); // Agregar la nueva tarea al array de tareas
localStorage.setItem('tareas_' + correoActivo, JSON.stringify(listaTareas));
  // Guardar el array actualizado en el almacenamiento local
  // stringify convierte el array de tareas en una cadena JSON y lo guarda en el almacenamiento local

document.getElementById('nuevaTarea').value = '';

alert('Tarea guardada correctamente');
mostrarTareas();
}

function mostrarTareas() {
let correoActivo = localStorage.getItem('usuarioActivo');
let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

let lista = document.getElementById('listaTareas');
lista.innerHTML = '';

tareas.forEach((tarea, indice) => {
    lista.innerHTML += `
    <tr>
        <td>${tarea}</td>
        <td><button onclick="irAEditar(${indice})">Editar</button></td>
        <td><button onclick="eliminarTarea(${indice})">Eliminar</button></td>
    </tr>
    `;
});
}

function eliminarTarea(indice) {
let confirmacion = confirm('¿Estás seguro de que deseas eliminar esta tarea?');

  if (confirmacion) { // Si el usuario confirma la eliminación
    let correoActivo = localStorage.getItem('usuarioActivo');
    let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

    tareas.splice(indice, 1); // Eliminar la tarea del array
    localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));
    // stringify convierte el array de tareas en una cadena JSON y lo guarda en el almacenamiento local
    alert('Tarea eliminada correctamente');
    mostrarTareas();
}
}

let indiceTareaEditando = null;

function irAEditar(indice) {
let correoActivo = localStorage.getItem('usuarioActivo');
let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

let tarea = tareas[indice];
document.getElementById('tareaEditada').value = tarea;
indiceTareaEditando = indice;

  // Mostrar el modal
document.getElementById('editarModal').style.display = 'block';
}

function guardarEdicion() {
if (indiceTareaEditando === null) return;

let nuevaTarea = document.getElementById('tareaEditada').value.trim();
if (!nuevaTarea) {
    alert('La tarea no puede estar vacía');
    return;
}

let correoActivo = localStorage.getItem('usuarioActivo');
let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

tareas[indiceTareaEditando] = nuevaTarea;
localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));

  // Cerrar el modal y actualizar la lista
cerrarModal();
mostrarTareas();
}

function cerrarModal() {
document.getElementById('editarModal').style.display = 'none';
indiceTareaEditando = null;
}

// Cerrar modal al hacer clic en la X
document.addEventListener('DOMContentLoaded', function() {
document.querySelector('.close').addEventListener('click', cerrarModal);

  // Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('editarModal')) {
cerrarModal();
    }
});
});
function cargarDatosUsuario() {
let correoActivo = localStorage.getItem('usuarioActivo');
if (!correoActivo) {
window.location.href = 'index.html';
    return;
}

let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
if (!datos) {
    window.location.href = 'index.html';
    return;
}

  // llenar el formulario con los datos del usuario
document.getElementById('nombres').value = datos.nombres || '';
document.getElementById('apellidos').value = datos.apellidos || '';
document.getElementById('correo').value = datos.correo || '';
document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';
}

function showMessage(text, isError = false) {
    const el = document.getElementById('mensaje');
    if (el) {
        el.textContent = text;
        el.style.color = isError ? 'red' : 'green';
        setTimeout(() => { el.textContent = ''; }, 4000);
    } else {
        alert(text);
    }
}

function actualizarPerfil() {
    let correoActivo = localStorage.getItem('usuarioActivo');
    if (!correoActivo) {
        window.location.href = 'index.html';
        return;
    }

    let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
    if (!datos) {
        window.location.href = 'index.html';
        return;
    }

    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const claveActual = document.getElementById('claveActual').value;
    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarNuevaClave = document.getElementById('confirmarNuevaClave').value;

    // Si se solicita cambiar la contraseña, validar correctamente
    if (nuevaClave || confirmarNuevaClave) {
        if (!claveActual) {
            showMessage('Ingresa la contraseña actual para cambiar la contraseña', true);
            return;
        }
        if (claveActual !== datos.clave) {
            showMessage('La contraseña actual es incorrecta', true);
            return;
        }
        if (nuevaClave.length < 8) {
            showMessage('La nueva contraseña debe tener al menos 8 caracteres', true);
            return;
        }
        if (nuevaClave !== confirmarNuevaClave) {
            showMessage('La nueva contraseña y su confirmación no coinciden', true);
            return;
        }
        datos.clave = nuevaClave;
    }

    // Actualizar otros campos
    datos.nombres = nombres || datos.nombres;
    datos.apellidos = apellidos || datos.apellidos;
    datos.fechaNacimiento = fechaNacimiento || datos.fechaNacimiento;

    // Guardar cambios
    localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));

    // Limpiar campos de contraseña en el formulario
    document.getElementById('claveActual').value = '';
    document.getElementById('nuevaClave').value = '';
    document.getElementById('confirmarNuevaClave').value = '';

    showMessage('Perfil actualizado correctamente', false);

    // Actualizar bienvenida si existe en la página actual
    const mensajeBienvenida = document.getElementById('mensajeBienvenida');
    if (mensajeBienvenida) {
        mensajeBienvenida.innerHTML = `¡Bienvenido/a, <a href="perfil.html">${datos.nombres}</a>!`;
    }
}