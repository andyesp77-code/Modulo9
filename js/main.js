class Usuario {
    constructor(id, nombre, clave, saldoInicio, saldoActual, tipoCta){
        this.id = id;
        this.nombre = nombre;
        this.clave = clave;
        this.saldoInicio = saldoInicio;
        this.saldoActual = saldoActual;
        this.tipoCta = tipoCta;
        this.movimientos = [];
    }
}

// Usuarios iniciales del sistema (incluye al Administrador) - array de objetos literales.
// Se usan solo si localStorage todavía no tiene datos guardados
const usuariosRegistrados = [
  {
    id: 1,
    nombre: `JUAN`,
    clave: 1234,
    saldoInicio: 100000,
    saldoActual: 100000,
    tipoCta: `Sueldo`,
    movimientos: []
  },
  {
    id: 2,
    nombre: `PEDRO`,
    clave: 2345,
    saldoInicio: 150000,
    saldoActual: 150000,
    tipoCta: `Sueldo`,
    movimientos: []
  },
  {
    id: 3,
    nombre: `MARIA`,
    clave: 3456,
    saldoInicio: 180000,
    saldoActual: 180000,
    tipoCta: `Caja Ahorro`,
    movimientos: []
  },
  {
    id: 4,
    nombre: `ANA`,
    clave: 4567,
    saldoInicio: 200000,
    saldoActual: 200000,
    tipoCta: `Caja Ahorro`,
    movimientos: []
  },
  {
    id: 5,
    nombre: `ANDREA`,
    clave: 5678,
    saldoInicio: 300000,
    saldoActual: 300000,
    tipoCta: `Sueldo`,
    movimientos: []
  },
  {
    id: 6,
    nombre: `ADMIN`,
    clave: 2990,
    saldoInicio: 1,
    saldoActual: 1,
    tipoCta: `Administrador`,
    movimientos: []
  }
];

//Variables generales
let intentos = 0;
let idUsuarioActual = null;
let temporizadorAviso = null;
let temporizadorInactividad = null;
const tiempoInactividad = 5 * 60 * 1000; //5 minutos expresados en milisegundos
let proximoIdUsuario = usuariosRegistrados.reduce((maxId, usuario) => Math.max(maxId, usuario.id), 0) + 1;
const claveAlmacenamiento = `simuladorCajero`;

//Elementos del DOM - paneles de la aplicacion
const panelInicio = document.getElementById(`panel-inicio`);
const panelCliente = document.getElementById(`panel-cliente`);
const panelAdministrador = document.getElementById(`panel-administrador`);

//Elementos del DOM - panel de inicio
const bienvenidaInicio = document.getElementById(`bienvenida-inicio`);
const inputUsuario = document.getElementById(`input-usuario`);
const inputClave = document.getElementById(`input-clave`);
const btnIngresar = document.getElementById(`btn-ingresar`);
const mensajeInicio = document.getElementById(`mensaje-inicio`);
const intentosInicio = document.getElementById(`intentos-inicio`);

//Elementos del DOM - panel del cliente
const bienvenidaCliente = document.getElementById(`bienvenida-cliente`);
const btnConsultarSaldo = document.getElementById(`btn-consultar-saldo`);
const btnConsultarMovimientos = document.getElementById(`btn-consultar-movimientos`);
const btnDepositar = document.getElementById(`btn-depositar`);
const formularioDeposito = document.getElementById(`formulario-deposito`);
const inputImporteDeposito = document.getElementById(`input-importe-deposito`);
const btnCancelarDeposito = document.getElementById(`btn-cancelar-deposito`);
const btnExtraer = document.getElementById(`btn-extraer`);
const formularioExtraccion = document.getElementById(`formulario-extraccion`);
const inputImporteExtraccion = document.getElementById(`input-importe-extraccion`);
const btnCancelarExtraccion = document.getElementById(`btn-cancelar-extraccion`);
const btnCambiarClaveUsuario = document.getElementById(`btn-cambiar-clave`);
const formularioCambioClaveUsuario = document.getElementById(`formulario-cambio-clave-usuario`);
const inputNuevaClaveUsuario = document.getElementById(`input-nueva-clave-usuario`);
const btnCancelarCambioClaveUsuario = document.getElementById(`btn-cancelar-cambio-clave-usuario`);
const mensajeOperacion = document.getElementById(`mensaje-operacion`);
const saldoActualCliente = document.getElementById(`saldo-actual`);
const contenedorMovimientos = document.getElementById(`contenedor-movimientos`);
const saldoInicialMovimientos = document.getElementById(`saldo-inicial-movimientos`);
const saldoReferenciaMovimientos = document.getElementById(`saldo-referencia-movimientos`);
const listaMovimientos = document.getElementById(`lista-movimientos`);
const saldoActualMovimientos = document.getElementById(`saldo-actual-movimientos`);
const contenedorAvisoCliente = document.getElementById(`aviso-cliente`);
const mensajeAvisoCliente = document.getElementById(`mensaje-aviso-cliente`);
const btnSalirCliente = document.getElementById(`btn-salir-cliente`);

//Elementos del DOM - panel del administrador
const btnListarUsuarios = document.getElementById(`btn-listar-usuarios`);
const btnNuevoUsuario = document.getElementById(`btn-nuevo-usuario`);
const formularioRegistroUsuario = document.getElementById(`formulario-registro-usuario`);
const inputUsuarioRegistro = document.getElementById(`input-usuario-registro`);
const inputClaveRegistro = document.getElementById(`input-clave-registro`);
const selectTipoCuentaRegistro = document.getElementById(`select-tipo-cuenta-registro`);
const inputSaldoInicioRegistro = document.getElementById(`input-saldo-inicio-registro`);
const btnCancelarRegistro = document.getElementById(`btn-cancelar-registro`);
const btnBlanquearClave = document.getElementById(`btn-blanquear-clave`);
const formularioBlanqueoClave = document.getElementById(`formulario-blanqueo-clave`);
const inputUsuarioBlanqueoClave = document.getElementById(`input-usuario-blanqueo-clave`);
const mensajeUsuarioBlanqueoClave = document.getElementById(`mensaje-usuario-blanqueo-clave`);
const btnCancelarBlanqueoClave = document.getElementById(`btn-cancelar-blanqueo-clave`);
const btnCambiarClaveAdmin = document.getElementById(`btn-cambiar-clave-admin`);
const formularioCambioClave = document.getElementById(`formulario-cambio-clave`);
const inputUsuarioCambioClave = document.getElementById(`input-usuario-cambio-clave`);
const mensajeUsuarioCambioClave = document.getElementById(`mensaje-usuario-cambio-clave`);
const inputNuevaClave = document.getElementById(`input-nueva-clave`);
const btnCancelarCambioClave = document.getElementById(`btn-cancelar-cambio-clave`);
const btnEliminarUsuario = document.getElementById(`btn-eliminar-usuario`);
const formularioEliminacionUsuario = document.getElementById(`formulario-eliminacion-usuario`);
const inputUsuarioEliminacion = document.getElementById(`input-usuario-eliminacion`);
const mensajeUsuarioEliminacion = document.getElementById(`mensaje-usuario-eliminacion`);
const btnCancelarEliminacion = document.getElementById(`btn-cancelar-eliminacion`);
const btnSalirAdmin = document.getElementById(`btn-salir-admin`);
const contenedorUsuarios = document.getElementById(`contenedor-usuarios`);
const listaUsuarios = document.getElementById(`lista-usuarios`);
const btnBuscarUsuario = document.getElementById(`btn-buscar-usuario`);
const formularioBusquedaUsuario = document.getElementById(`formulario-busqueda-usuario`);
const inputUsuarioBusqueda = document.getElementById(`input-usuario-busqueda`);
const btnCancelarBusqueda = document.getElementById(`btn-cancelar-busqueda`);
const cantidadUsuarios = document.getElementById(`cantidad-usuarios`);
const mensajeAdministrador = document.getElementById(`mensaje-administrador`);


//****** PERSISTENCIA DE DATOS EN LOCAL STORAGE ******//
// Función que valida la consistencia del historial de movimientos de un usuario
function validarMovimientos(usuario) {
    //**si el usuario no tiene la propiedad movimientos, se puede incorporar al cargar los datos */
    if (usuario.movimientos === undefined) {
        return true;
    }

    const { movimientos } = usuario;
    //** valida que el historial sea un array y que ADMIN no tenga movimientos */
    if (!Array.isArray(movimientos) || (usuario.nombre === `ADMIN` && movimientos.length > 0)) {
        return false;
    }

    //** valida que cada movimiento sea depósito o extracción, con importe positivo y saldos finitos no negativos */
    const movimientosValidos = movimientos.every((movimiento, indice) => {
        if ((movimiento?.tipo !== `Depósito` && movimiento?.tipo !== `Extracción`) ||
            !Number.isFinite(movimiento.importe) || movimiento.importe <= 0 ||
            !Number.isFinite(movimiento.saldoAnterior) || movimiento.saldoAnterior < 0 ||
            !Number.isFinite(movimiento.saldoActual) || movimiento.saldoActual < 0) {
            return false;
        }

        //** calcula el saldo esperado según el tipo de movimiento */
        const saldoEsperado = movimiento.tipo === `Depósito`
            ? movimiento.saldoAnterior + movimiento.importe
            : movimiento.saldoAnterior - movimiento.importe;

        //** compara el saldo actual con el saldo esperado y la consistencia con el movimiento anterior */
        return movimiento.saldoActual === saldoEsperado &&
            (indice === 0 || movimiento.saldoAnterior === movimientos[indice - 1].saldoActual);
    });
    //** Obtiene el último movimiento del historial */
    const ultimoMovimiento = movimientos[movimientos.length - 1];

    //** Devuelve true si todos los movimientos son válidos y el último saldo coincide con el saldo actual de la cuenta */
    return movimientosValidos &&
        (ultimoMovimiento?.saldoActual ?? usuario.saldoActual) === usuario.saldoActual;
}

//Función que valida los datos del simulador antes de guardarlos y al recuperarlos de localStorage
function validarDatosGuardados(datos) {
    const usuarios = datos?.usuariosRegistrados;

    //** valida que existan un array de usuarios registrados */
    if (!Array.isArray(usuarios)) {
        return false;
    }

    //** valida que cada usuario tenga datos correctos y consistentes */
    const usuariosValidos = usuarios.every((usuario) =>
        Number.isSafeInteger(usuario?.id) && usuario.id > 0 &&
        typeof usuario.nombre === `string` && usuario.nombre !== `` &&
        usuario.nombre === usuario.nombre.trim().toUpperCase() &&
        typeof usuario.clave === `number` && validarClave(usuario.clave) &&
        Number.isFinite(usuario.saldoInicio) && usuario.saldoInicio >= 0 &&
        Number.isFinite(usuario.saldoActual) && usuario.saldoActual >= 0 &&
        (usuario.nombre === `ADMIN`
            ? usuario.tipoCta === `Administrador`
            : usuario.tipoCta === `Sueldo` || usuario.tipoCta === `Caja Ahorro`) &&
        validarMovimientos(usuario)
    );

    //** si no cumple todas las condiciones anteriores devuelve false */
    if (!usuariosValidos) {
        return false;
    }

    //** obtiene el mayor id de los usuarios registrados */
    const mayorId = usuarios.reduce((maxId, usuario) => Math.max(maxId, usuario.id), 0);

    //** devuelve true si existe el usuario ADMIN y el próximo id es válido */
    return usuarios.some((usuario) => usuario.nombre === `ADMIN`) &&
        Number.isSafeInteger(datos.proximoIdUsuario) &&
        datos.proximoIdUsuario > mayorId;
}

// Valida los datos, los guarda en localStorage y recién después actualiza el array en memoria
function guardarDatos(datos, mensajeResultado) {
    if (!validarDatosGuardados(datos)) {
        mensajeResultado.textContent = `La operación produce datos no válidos y no se guardó`;
        return false;
    }

    try {
        localStorage.setItem(claveAlmacenamiento, JSON.stringify(datos));
    } catch (error) {
        mensajeResultado.textContent = error.message;
        return false;
    }

    usuariosRegistrados.splice(0, usuariosRegistrados.length,...datos.usuariosRegistrados);
    proximoIdUsuario = datos.proximoIdUsuario;
    return true;
}

// Reemplaza un usuario modificado dentro de una copia del array y guarda el resultado
function guardarUsuario(usuarioActualizado, mensajeResultado) {
    const usuariosActualizados = usuariosRegistrados.map((usuario) =>
        usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario
    );

    return guardarDatos({
        usuariosRegistrados: usuariosActualizados,
        proximoIdUsuario
    }, mensajeResultado);
}

// Recupera los datos de localStorage. Si no existen, guarda los usuarios iniciales
// Si la lectura falla, informa el error y el ingreso queda deshabilitado
function cargarDatos() {
    let datosCargados = false;

    try {
        const datosGuardados = JSON.parse(
            localStorage.getItem(claveAlmacenamiento) ?? `null`
        );

        if (datosGuardados === null) {
            datosCargados = guardarDatos({ usuariosRegistrados, proximoIdUsuario }, mensajeInicio);
        } else {
            if (!validarDatosGuardados(datosGuardados)) {
                throw new Error(`Los datos guardados no tienen un formato válido`);
            }

            const usuariosActualizados = datosGuardados.usuariosRegistrados.map((usuario) => ({
                ...usuario, movimientos: usuario.movimientos ?? []
            }));

            datosCargados = guardarDatos({
                usuariosRegistrados: usuariosActualizados,
                proximoIdUsuario: datosGuardados.proximoIdUsuario
            }, mensajeInicio);
        }
    } catch (error) {
        mensajeInicio.textContent = error.message;
    } finally {
        deshabilitarIngreso(!datosCargados);
    }
}

//FUNCIONES DE INTERFAZ Y VALIDACIONES
//Funciones para alternar entre mostrar el panel administrador o de usuario
function mostrarPanelAdministrador() {
    panelInicio.classList.add(`oculto`);
    panelCliente.classList.add(`oculto`);
    panelAdministrador.classList.remove(`oculto`);
}

function mostrarPanelCliente() {
    panelInicio.classList.add(`oculto`);
    panelAdministrador.classList.add(`oculto`);
    panelCliente.classList.remove(`oculto`);
}

//Función que valida que la clave sea un número entero de 4 dígitos (entre 1000 y 9999)
function validarClave(clave) {
    const claveNumero = Number(clave);

    return Number.isInteger(claveNumero) && claveNumero >= 1000 && claveNumero <= 9999;
}


//FUNCIONES DEL PANEL ADMINISTRADOR
//Responsabilidad: las que realizan la gestión de usuarios
function listarUsuarios(usuarios = usuariosRegistrados) {
    listaUsuarios.innerHTML = ``;

    usuarios.forEach((usuario) => {
        const textoSaldoInicio = usuario.nombre === `ADMIN` ? `No aplica` : `$${usuario.saldoInicio}`;

        const contenedor = document.createElement(`div`);
        contenedor.className = `usuario`;
        contenedor.innerHTML = `<h4></h4>
                               <p>ID: ${usuario.id}</p>
                               <p>Clave: ${usuario.clave}</p>
                               <p>Tipo de Cuenta: ${usuario.tipoCta}</p>
                               <p>Saldo inicial: ${textoSaldoInicio}</p>`;
        contenedor.querySelector(`h4`).textContent = `Nombre: ${usuario.nombre}`;
        listaUsuarios.appendChild(contenedor);
    });

    cantidadUsuarios.textContent = `${usuarios.length} usuarios`;
    contenedorUsuarios.classList.remove(`oculto`);

    mensajeAdministrador.textContent = usuarios.length === 0
        ? `No hay usuarios para mostrar.`
        : `Listado de usuarios actualizado.`;
}

//Acepta búsqueda por nombres parciales y mostrará todos los que coincidan con el texto ingresado
function buscarUsuario(nombreUsuario) {
    nombreUsuario = nombreUsuario.trim().toUpperCase();

    const usuariosEncontrados = usuariosRegistrados.filter((usuario) => usuario.nombre.includes(nombreUsuario));

    listarUsuarios(usuariosEncontrados);

    mensajeAdministrador.textContent = usuariosEncontrados.length === 0
        ? `No se encontraron usuarios`
        : `Usuarios encontrados: ${usuariosEncontrados.length}`;
}

function buscarUsuarioPorId(inputIdUsuario, mensajeUsuario) {
    const idIngresado = inputIdUsuario.value.trim();
    mensajeUsuario.textContent = ``;

    if (idIngresado === `` && !inputIdUsuario.validity.badInput) {
        return;
    }

    const idUsuario = Number(idIngresado);
    const usuario = usuariosRegistrados.find((usuario) => usuario.id === idUsuario);

    mensajeUsuario.textContent = usuario
        ? `Nombre: ${usuario.nombre}`
        : `Usuario no encontrado`;
}

function blanquearClave(idUsuario) {
    const usuario = usuariosRegistrados.find((usuario) => usuario.id === idUsuario);

    if (!usuario) {
        mensajeAdministrador.textContent = `Usuario no encontrado`;
        return false;
    }

    if (!guardarUsuario({ ...usuario, clave: 1111 }, mensajeAdministrador)) {
        return false;
    }

    mensajeAdministrador.textContent = `La clave de ${usuario.nombre} fue blanqueada. Nueva clave: 1111`;
    return true;
}

function cambiarClaveDeUsuario(idUsuario, clave, mensajeResultado) {
    if (!validarClave(clave)) {
        mensajeResultado.textContent = `La clave debe ser un número entero entre 1000 y 9999`;
        return false;
    }

    const usuario = usuariosRegistrados.find((usuario) => usuario.id === idUsuario);

    if (!usuario) {
        mensajeResultado.textContent = `Usuario no encontrado`;
        return false;
    }

    if (!guardarUsuario({ ...usuario, clave }, mensajeResultado)) {
        return false;
    }

    mensajeResultado.textContent = `La clave de ${usuario.nombre} fue cambiada con éxito. Nueva clave: ${clave}`;
    return true;
}

function eliminarUsuario(idUsuario) {
    const usuario = usuariosRegistrados.find((usuario) => usuario.id === idUsuario);

    if (!usuario) {
        mensajeAdministrador.textContent = `Usuario no encontrado`;
        return false;
    }

    if (usuario.nombre === `ADMIN`) {
        mensajeAdministrador.textContent = `El usuario ADMIN no puede ser eliminado`;
        return false;
    }

    const usuariosActualizados = usuariosRegistrados.filter((usuario) => usuario.id !== idUsuario);

    if (!guardarDatos({
        usuariosRegistrados: usuariosActualizados,
        proximoIdUsuario
    }, mensajeAdministrador)) {
        return false;
    }

    mensajeAdministrador.textContent = `El usuario ${usuario.nombre} fue eliminado del sistema`;
    return true;
}

function registroUsuario(nombre, clave, saldoInicio, tipoCta) {
    nombre = nombre.trim().toUpperCase();

    if (!validarClave(clave)) {
        mensajeAdministrador.textContent = `La clave debe ser un número entero entre 1000 y 9999`;
        return false;
    }

    const usuarioYaRegistrado = usuariosRegistrados.some((usuario) => usuario.nombre === nombre);

    if (usuarioYaRegistrado) {
        mensajeAdministrador.textContent = `El usuario ya está registrado`;
        return false;
    }

    if (!Number.isFinite(saldoInicio) || saldoInicio < 0) {
        mensajeAdministrador.textContent = `El saldo inicial debe ser un número válido mayor o igual a cero`;
        return false;
    }

    if (tipoCta !== `Sueldo` && tipoCta !== `Caja Ahorro`) {
        mensajeAdministrador.textContent = `Seleccione Sueldo o Caja de Ahorro como tipo de cuenta`;
        return false;
    }

    const nuevoUsuario = new Usuario(proximoIdUsuario, nombre, clave, saldoInicio, saldoInicio, tipoCta);

    if (!guardarDatos({
        usuariosRegistrados: [...usuariosRegistrados, nuevoUsuario],
        proximoIdUsuario: proximoIdUsuario + 1
    }, mensajeAdministrador)) {
        return false;
    }

    mensajeAdministrador.textContent = `Nuevo usuario registrado: ${nombre} - ID: ${nuevoUsuario.id}`;
    return true;
}


//FUNCIONES DEL MENU ADMINISTRADOR
//Responsabilidades: Lectura del formulario, validaciones y limpieza de listados y campos
function limpiarListadoUsuarios() {
    listaUsuarios.innerHTML = ``;
    cantidadUsuarios.textContent = `0 usuarios`;
    contenedorUsuarios.classList.add(`oculto`);
}

function solicitarRegistroUsuario() {
    const nombreUsuario = inputUsuarioRegistro.value.trim();
    const clave = inputClaveRegistro.value.trim();
    const tipoCta = selectTipoCuentaRegistro.value;
    const saldoInicio = inputSaldoInicioRegistro.value.trim();

    limpiarListadoUsuarios();

    if (nombreUsuario === `` || clave === `` || tipoCta === `` || saldoInicio === ``) {
        mensajeAdministrador.textContent = `El dato es obligatorio`;
        return;
    }

    if (registroUsuario(nombreUsuario, Number(clave), Number(saldoInicio), tipoCta)) {
        inputUsuarioRegistro.value = ``;
        inputClaveRegistro.value = ``;
        selectTipoCuentaRegistro.value = ``;
        inputSaldoInicioRegistro.value = ``;
        formularioRegistroUsuario.classList.add(`oculto`);
    }
}

function solicitarBlanqueoClave() {
    const idUsuario = inputUsuarioBlanqueoClave.value.trim();

    limpiarListadoUsuarios();

    if (idUsuario === ``) {
        mensajeAdministrador.textContent = `El dato es obligatorio`;
        return;
    }

    if (blanquearClave(Number(idUsuario))) {
        inputUsuarioBlanqueoClave.value = ``;
        mensajeUsuarioBlanqueoClave.textContent = ``;
        formularioBlanqueoClave.classList.add(`oculto`);
    }
}

function solicitarCambioClave() {
    const idUsuario = inputUsuarioCambioClave.value.trim();
    const clave = inputNuevaClave.value.trim();

    limpiarListadoUsuarios();

    if (idUsuario === `` || clave === ``) {
        mensajeAdministrador.textContent = `El dato es obligatorio`;
        return;
    }

    if (cambiarClaveDeUsuario(Number(idUsuario), Number(clave), mensajeAdministrador)) {
        inputUsuarioCambioClave.value = ``;
        mensajeUsuarioCambioClave.textContent = ``;
        inputNuevaClave.value = ``;
        formularioCambioClave.classList.add(`oculto`);
    }
}

function solicitarEliminacionUsuario() {
    const idUsuario = inputUsuarioEliminacion.value.trim();

    limpiarListadoUsuarios();

    if (idUsuario === ``) {
        mensajeAdministrador.textContent = `El dato es obligatorio`;
        return;
    }

    if (eliminarUsuario(Number(idUsuario))) {
        inputUsuarioEliminacion.value = ``;
        mensajeUsuarioEliminacion.textContent = ``;
        formularioEliminacionUsuario.classList.add(`oculto`);
    }
}

//FUNCIONES DEL MENU DE INICIO
//Habilita o deshabilita los campos y el botón de ingreso
function deshabilitarIngreso(deshabilitado) {
    inputUsuario.disabled = deshabilitado;
    inputClave.disabled = deshabilitado;
    btnIngresar.disabled = deshabilitado;
}

//Función Salir compartida entre los dos menús (administrador y cliente)
function salir() {
    clearTimeout(temporizadorAviso);
    clearTimeout(temporizadorInactividad);
    idUsuarioActual = null;
    limpiarInterfaz();
    deshabilitarIngreso(true);
    panelInicio.classList.remove(`oculto`);
    bienvenidaInicio.textContent = `Gracias por utilizar el simulador`;
    mensajeInicio.textContent = `Simulador finalizado - Recargue la página para iniciar nuevamente`;
    intentosInicio.textContent = ``;
}

//Cierra la sesión del cliente cuando no usa el cajero durante el tiempo de inactividad (5 minutos)
function cerrarSesionPorInactividad() {
    salir();
    mensajeInicio.textContent = `Sesión finalizada por inactividad - Recargue la página para iniciar nuevamente`;
}

//Cancela el temporizador anterior y, si hay una sesión abierta, vuelve a contar el tiempo de inactividad desde cero
//El clic en Salir también llega al panel: como salir() deja idUsuarioActual en null, no se arranca otro temporizador
function reiniciarInactividad() {
    clearTimeout(temporizadorInactividad);

    if (idUsuarioActual === null) {
        return;
    }

    temporizadorInactividad = setTimeout(cerrarSesionPorInactividad, tiempoInactividad);
}

//Limpia campos, formularios, paneles y listados. No modifica los datos guardados ni la sesión
function limpiarInterfaz() {
    const aplicacion = document.querySelector(`#aplicacion`);

    aplicacion.querySelectorAll(`input, select`).forEach((input) => {
        input.value = ``;
    });

    aplicacion.querySelectorAll(`form`).forEach((formulario) => {
        formulario.classList.add(`oculto`);
    });

    aplicacion.querySelectorAll(`.panel`).forEach((panel) => {
        panel.classList.add(`oculto`);
    });

    mensajeUsuarioBlanqueoClave.textContent = ``;
    mensajeUsuarioCambioClave.textContent = ``;
    mensajeUsuarioEliminacion.textContent = ``;
    limpiarListadoUsuarios();

    listaMovimientos.innerHTML = ``;
    saldoInicialMovimientos.textContent = ``;
    saldoReferenciaMovimientos.textContent = ``;
    saldoActualMovimientos.textContent = ``;
    contenedorMovimientos.classList.add(`oculto`);

    mensajeAvisoCliente.textContent = ``;
    contenedorAvisoCliente.classList.add(`oculto`);
}

//FUNCIONES DE LA OPERACION DEL CAJERO AUTOMATICO
//Devuelve el número con dos dígitos (ej: 5 -> 05)
function dosDigitos(numero) {
    return numero < 10 ? `0${numero}` : `${numero}`;
}

//Devuelve la fecha y hora del sistema con formato DD-MM-AAAA hh:mm
function obtenerFechaMovimiento() {
    const fechaActual = new Date();
    const dia = dosDigitos(fechaActual.getDate());
    const mes = dosDigitos(fechaActual.getMonth() + 1);
    const anio = fechaActual.getFullYear();
    const horas = dosDigitos(fechaActual.getHours());
    const minutos = dosDigitos(fechaActual.getMinutes());

    return `${dia}-${mes}-${anio} ${horas}:${minutos}`;
}

//Responsabilidades: Las que realizan la gestión de la cuenta del usuario
function registrarMovimiento(usuario, tipo, importe, saldoAnterior) {
    const movimiento = {
        tipo,
        importe,
        saldoAnterior,
        saldoActual: usuario.saldoActual,
        fecha: obtenerFechaMovimiento()
    };

    usuario.movimientos.push(movimiento);
}

function extraccionDinero(usuario, valor) {
    if (valor > usuario.saldoActual) {
        mensajeOperacion.textContent = `Saldo Insuficiente`;
        saldoActualCliente.textContent = `Saldo actual: $${usuario.saldoActual}`;
        return false;
    }

    usuario = { ...usuario, movimientos: [...usuario.movimientos] };
    const saldoAnterior = usuario.saldoActual;
    usuario.saldoActual = usuario.saldoActual - valor;
    registrarMovimiento(usuario, `Extracción`, valor, saldoAnterior);

    if (!guardarUsuario(usuario, mensajeOperacion)) {
        return false;
    }

    mensajeOperacion.textContent = `Extracción realizada`;
    saldoActualCliente.textContent = `Saldo actual: $${usuario.saldoActual}`;

    if (!contenedorMovimientos.classList.contains(`oculto`)) {
        listarMovimientos(usuario);
    }

    return true;
}

function depositoDinero(usuario, valor) {
    usuario = { ...usuario, movimientos: [...usuario.movimientos] };
    const saldoAnterior = usuario.saldoActual;
    usuario.saldoActual = usuario.saldoActual + valor;
    registrarMovimiento(usuario, `Depósito`, valor, saldoAnterior);

    if (!guardarUsuario(usuario, mensajeOperacion)) {
        return false;
    }

    mensajeOperacion.textContent = `Depósito realizado`;
    saldoActualCliente.textContent = `Saldo actual: $${usuario.saldoActual}`;

    if (!contenedorMovimientos.classList.contains(`oculto`)) {
        listarMovimientos(usuario);
    }

    return true;
}

function consultarSaldo(usuario) {
    mensajeOperacion.textContent = `Consulta de saldo realizada`;
    saldoActualCliente.textContent = `Saldo actual: $${usuario.saldoActual}`;
}

function listarMovimientos(usuario) {
    const { saldoInicio, saldoActual, movimientos } = usuario;
    const saldoReferencia = movimientos[0]?.saldoAnterior ?? saldoActual;

    saldoInicialMovimientos.textContent = `Saldo inicial de la cuenta: $${saldoInicio}`;
    saldoReferenciaMovimientos.textContent = saldoReferencia === saldoInicio
        ? ``
        : `Saldo al comenzar el registro: $${saldoReferencia}`;

    listaMovimientos.innerHTML = movimientos.length === 0
        ? `<p>No hay movimientos registrados.</p>`
        : ``;

    movimientos.forEach(({ tipo, importe, saldoAnterior, saldoActual: saldoMovimiento, fecha }, indice) => {
        const contenedor = document.createElement(`div`);
        const signo = tipo === `Depósito` ? `+` : `-`;

        contenedor.className = `movimiento`;
        contenedor.innerHTML = `<h4>${indice + 1}. ${tipo}</h4>
                               <p>Fecha: ${fecha ?? `No registrada`}</p>
                               <p>Importe: ${signo}$${importe}</p>
                               <p>Saldo anterior: $${saldoAnterior}</p>
                               <p>Saldo después del movimiento: $${saldoMovimiento}</p>`;
        listaMovimientos.appendChild(contenedor);
    });

    saldoActualMovimientos.textContent = `Saldo actual: $${saldoActual}`;
    contenedorMovimientos.classList.remove(`oculto`);
}

//FUNCIONES DEL AVISO AL CLIENTE con temporizador
//Arma el aviso del cliente - clave blanqueada o su último movimiento
function obtenerAvisoCliente(usuario) {
    if (usuario.clave === 1111) {
        return `Su clave fue blanqueada. Le recomendamos cambiarla desde "Cambiar clave"`;
    }

    const ultimoMovimiento = usuario.movimientos[usuario.movimientos.length - 1];

    if (!ultimoMovimiento) {
        return `Aún no registra movimientos en su cuenta`;
    }

    const { tipo, importe, fecha } = ultimoMovimiento;
    return `Último movimiento: ${tipo} de $${importe} - Fecha: ${fecha ?? `No registrada`}`;
}

//Muestra el aviso 3 segundos después de ingresar, sin bloquear el uso del cajero
function programarAvisoCliente(idUsuario) {
    temporizadorAviso = setTimeout(() => {
        const usuario = usuariosRegistrados.find((usuario) => usuario.id === idUsuario);

        mensajeAvisoCliente.textContent = obtenerAvisoCliente(usuario);
        contenedorAvisoCliente.classList.remove(`oculto`);
    }, 3000);
}

//Al elegir una opción del menú, cancela el aviso pendiente y oculta el que ya se mostró
function ocultarAvisoCliente() {
    clearTimeout(temporizadorAviso);
    mensajeAvisoCliente.textContent = ``;
    contenedorAvisoCliente.classList.add(`oculto`);
}

//FUNCIONES DEL MENU DE USUARIO CAJERO AUTOMATICO
//Responsabilidades: Lectura del importe, validaciones y limpieza del formulario.
function solicitarExtraccion(usuario) {
    const datoValor = inputImporteExtraccion.value.trim();

    if (datoValor === ``) {
        mensajeOperacion.textContent = `El dato es obligatorio.`;
        return;
    }

    const valor = Number(datoValor);
    if (isNaN(valor) || valor <= 0) {
        mensajeOperacion.textContent = `Debe ingresar un importe válido mayor que cero.`;
    } else if (extraccionDinero(usuario, valor)) {
        inputImporteExtraccion.value = ``;
        formularioExtraccion.classList.add(`oculto`);
    }
}

function solicitarDeposito(usuario) {
    const datoValor = inputImporteDeposito.value.trim();

    if (datoValor === ``) {
        mensajeOperacion.textContent = `El dato es obligatorio.`;
        return;
    }

    const valor = Number(datoValor);
    if (isNaN(valor) || valor <= 0) {
        mensajeOperacion.textContent = `Debe ingresar un importe válido mayor que cero.`;
    } else if (depositoDinero(usuario, valor)) {
        inputImporteDeposito.value = ``;
        formularioDeposito.classList.add(`oculto`);
    }
}

function solicitarCambioClaveUsuario(idUsuario) {
    const claveNueva = inputNuevaClaveUsuario.value.trim();

    if (claveNueva === ``) {
        mensajeOperacion.textContent = `El dato es obligatorio.`;
        return;
    }

    if (cambiarClaveDeUsuario(idUsuario, Number(claveNueva), mensajeOperacion)) {
        inputNuevaClaveUsuario.value = ``;
        formularioCambioClaveUsuario.classList.add(`oculto`);
    }
}


//****ENTRADA DE DATOS PARA USUARIOS REGISTRADOS EN EL SISTEMA*****
// Valida usuario y clave. Si el usuario no logra ingresar en 3 intentos, no puede acceder al sistema
function ingresarAlSistema() {
    const nombreIngresado = inputUsuario.value.trim();
    const claveIngresada = inputClave.value.trim();

    if (nombreIngresado === `` || claveIngresada === ``) {
        mensajeInicio.textContent = `El dato es obligatorio`;
        return;
    }

    if (!validarClave(claveIngresada)) {
        mensajeInicio.textContent = `La clave debe ser un número entero entre 1000 y 9999`;
        return;
    }

    const nombre = nombreIngresado.toUpperCase();
    const clave = Number(claveIngresada);
    const usuarioActual = usuariosRegistrados.find((usuario) => usuario.nombre === nombre);

    //** usuario inexistente o clave incorrecta: suma un intento y bloquea al tercero */
    if (!usuarioActual || usuarioActual.clave !== clave) {
        intentos++;
        mensajeInicio.textContent = `Usuario o clave incorrecta. Intento ${intentos} de 3`;
        intentosInicio.textContent = `Intento ${intentos} de 3`;
        inputClave.value = ``;

        if (intentos === 3) {
            mensajeInicio.textContent = `Superó los 3 intentos permitidos. No puede acceder al sistema`;
            deshabilitarIngreso(true);
        }
        return;
    }

    idUsuarioActual = usuarioActual.id;
    inputUsuario.value = ``;
    inputClave.value = ``;

    if (usuarioActual.nombre === `ADMIN`) {
        mensajeAdministrador.textContent = `Hola, ADMIN. Bienvenido al panel administrativo`;
        mostrarPanelAdministrador();
    } else {
        bienvenidaCliente.textContent = `Hola, ${nombre}. Bienvenido al Simulador de Cajero Automático`;
        saldoActualCliente.textContent = `Saldo actual: $${usuarioActual.saldoActual}`;
        mostrarPanelCliente();
        programarAvisoCliente(usuarioActual.id);
        reiniciarInactividad();
    }
}

//SECCION DE EVENTOS DE LA APLICACION
// Capturo el click del boton para ***INGRESAR AL SISTEMA***
btnIngresar.addEventListener(`click`, ingresarAlSistema);

//Capturo el enter para simular presionar el boton de ingreso al sistema
panelInicio.addEventListener(`keydown`, (e) => {
    if (e.key === `Enter` && !btnIngresar.disabled) {
        e.preventDefault();
        ingresarAlSistema();
    }
});

// Capturo el click del boton para ***LISTAR USUARIOS***
btnListarUsuarios.addEventListener(`click`, () => {
    listarUsuarios();
});

// Capturo el click del boton para ***BUSCAR USUARIO***
btnBuscarUsuario.addEventListener(`click`, () => {
    formularioRegistroUsuario.classList.add(`oculto`);
    formularioBlanqueoClave.classList.add(`oculto`);
    formularioCambioClave.classList.add(`oculto`);
    formularioEliminacionUsuario.classList.add(`oculto`);
    formularioBusquedaUsuario.classList.remove(`oculto`);
    mensajeAdministrador.textContent = `Ingrese un nombre completo o parcial para buscar. Se mostrarán los que coincidan con el ingreso`;
});

formularioBusquedaUsuario.addEventListener(`submit`, (e) => {
    e.preventDefault();
    buscarUsuario(inputUsuarioBusqueda.value);
});

// Capturo el click del boton para cancelar busqueda de usuario
btnCancelarBusqueda.addEventListener(`click`, () => {
    inputUsuarioBusqueda.value = ``;
    formularioBusquedaUsuario.classList.add(`oculto`);
    mensajeAdministrador.textContent = `Operación cancelada`;
});

// Capturo el click del boton para ***REGISTRAR UN NUEVO USUARIO***
btnNuevoUsuario.addEventListener(`click`, () => {
    formularioBusquedaUsuario.classList.add(`oculto`);
    formularioCambioClave.classList.add(`oculto`);
    formularioBlanqueoClave.classList.add(`oculto`);
    formularioEliminacionUsuario.classList.add(`oculto`);
    formularioRegistroUsuario.classList.remove(`oculto`);
    mensajeAdministrador.textContent = `Ingrese el usuario, la clave de 4 dígitos, el tipo de cuenta y el saldo inicial`;
});

formularioRegistroUsuario.addEventListener(`submit`, (e) => {
    e.preventDefault();
    solicitarRegistroUsuario();
});

// Capturo el click del boton para cancelar el registro de un nuevo usuario
btnCancelarRegistro.addEventListener(`click`, () => {
    inputUsuarioRegistro.value = ``;
    inputClaveRegistro.value = ``;
    selectTipoCuentaRegistro.value = ``;
    inputSaldoInicioRegistro.value = ``;
    formularioRegistroUsuario.classList.add(`oculto`);
    mensajeAdministrador.textContent = `Operación cancelada`;
});

// Capturo el click del boton para ***SOLICITAR BLANQUEO DE CLAVE***
btnBlanquearClave.addEventListener(`click`, () => {
    formularioBusquedaUsuario.classList.add(`oculto`);
    formularioRegistroUsuario.classList.add(`oculto`);
    formularioCambioClave.classList.add(`oculto`);
    formularioEliminacionUsuario.classList.add(`oculto`);
    formularioBlanqueoClave.classList.remove(`oculto`);
    mensajeAdministrador.textContent = `Ingrese el ID del usuario a blanquear`;
    buscarUsuarioPorId(inputUsuarioBlanqueoClave, mensajeUsuarioBlanqueoClave);
});

inputUsuarioBlanqueoClave.addEventListener(`blur`, () => {
    buscarUsuarioPorId(inputUsuarioBlanqueoClave, mensajeUsuarioBlanqueoClave);
});

inputUsuarioBlanqueoClave.addEventListener(`input`, () => {
    mensajeUsuarioBlanqueoClave.textContent = ``;
});

formularioBlanqueoClave.addEventListener(`submit`, (e) => {
    e.preventDefault();
    solicitarBlanqueoClave();
});

// Capturo el click del boton para cancelar el blanqueo de clave
btnCancelarBlanqueoClave.addEventListener(`click`, () => {
    inputUsuarioBlanqueoClave.value = ``;
    mensajeUsuarioBlanqueoClave.textContent = ``;
    formularioBlanqueoClave.classList.add(`oculto`);
    mensajeAdministrador.textContent = `Operación cancelada`;
});

// Capturo el click del boton para ***SOLICITAR CAMBIO DE CLAVE***
btnCambiarClaveAdmin.addEventListener(`click`, () => {
    formularioBusquedaUsuario.classList.add(`oculto`);
    formularioRegistroUsuario.classList.add(`oculto`);
    formularioBlanqueoClave.classList.add(`oculto`);
    formularioEliminacionUsuario.classList.add(`oculto`);
    formularioCambioClave.classList.remove(`oculto`);
    mensajeAdministrador.textContent = `Ingrese el ID del usuario y la nueva clave de 4 dígitos`;
    buscarUsuarioPorId(inputUsuarioCambioClave, mensajeUsuarioCambioClave);
});

inputUsuarioCambioClave.addEventListener(`blur`, () => {
    buscarUsuarioPorId(inputUsuarioCambioClave, mensajeUsuarioCambioClave);
});

inputUsuarioCambioClave.addEventListener(`input`, () => {
    mensajeUsuarioCambioClave.textContent = ``;
});

// Capturo el submit del formulario para cambiar la clave de un usuario
formularioCambioClave.addEventListener(`submit`, (e) => {
    e.preventDefault();
    solicitarCambioClave();
});

// Capturo el click del boton para cancelar el cambio de clave
btnCancelarCambioClave.addEventListener(`click`, () => {
    inputUsuarioCambioClave.value = ``;
    mensajeUsuarioCambioClave.textContent = ``;
    inputNuevaClave.value = ``;
    formularioCambioClave.classList.add(`oculto`);
    mensajeAdministrador.textContent = `Operación cancelada`;
});

// Capturo el click del boton para ***SOLICITAR ELIMINACION DE USUARIO***
btnEliminarUsuario.addEventListener(`click`, () => {
    formularioBusquedaUsuario.classList.add(`oculto`);
    formularioRegistroUsuario.classList.add(`oculto`);
    formularioBlanqueoClave.classList.add(`oculto`);
    formularioCambioClave.classList.add(`oculto`);
    formularioEliminacionUsuario.classList.remove(`oculto`);
    mensajeAdministrador.textContent = `Ingrese el ID del usuario a eliminar`;
    buscarUsuarioPorId(inputUsuarioEliminacion, mensajeUsuarioEliminacion);
});

inputUsuarioEliminacion.addEventListener(`blur`, () => {
    buscarUsuarioPorId(inputUsuarioEliminacion, mensajeUsuarioEliminacion);
});

inputUsuarioEliminacion.addEventListener(`input`, () => {
    mensajeUsuarioEliminacion.textContent = ``;
});

formularioEliminacionUsuario.addEventListener(`submit`, (e) => {
    e.preventDefault();
    solicitarEliminacionUsuario();
});

// Capturo el click del boton para cancelar la eliminacion de usuario
btnCancelarEliminacion.addEventListener(`click`, () => {
    inputUsuarioEliminacion.value = ``;
    mensajeUsuarioEliminacion.textContent = ``;
    formularioEliminacionUsuario.classList.add(`oculto`);
    mensajeAdministrador.textContent = `Operación cancelada`;
});

// Capturo el click de cualquier boton del menu del cliente para ocultar el aviso
document.querySelectorAll(`#menu-cliente button`).forEach((boton) => {
    boton.addEventListener(`click`, ocultarAvisoCliente);
});

// Capturo los clics y lo que se escribe en el panel del cliente para reiniciar el tiempo de inactividad
panelCliente.addEventListener(`click`, reiniciarInactividad);
panelCliente.addEventListener(`input`, reiniciarInactividad);

// Capturo el click del boton para ***CONSULTAR SALDO***
btnConsultarSaldo.addEventListener(`click`, () => {
    const usuarioActual = usuariosRegistrados.find((usuario) => usuario.id === idUsuarioActual);
    consultarSaldo(usuarioActual);
});

// Capturo el click del boton para ***CONSULTAR  MOVIMIENTOS***
btnConsultarMovimientos.addEventListener(`click`, () => {
    const usuarioActual = usuariosRegistrados.find((usuario) => usuario.id === idUsuarioActual);
    listarMovimientos(usuarioActual);
    mensajeOperacion.textContent = `Consulta de movimientos realizada`;
});

// Capturo el click del boton para ***DEPOSITAR DINERO***
btnDepositar.addEventListener(`click`, () => {
    formularioExtraccion.classList.add(`oculto`);
    formularioCambioClaveUsuario.classList.add(`oculto`);
    formularioDeposito.classList.remove(`oculto`);
    mensajeOperacion.textContent = `Ingrese el importe a depositar`;
});

formularioDeposito.addEventListener(`submit`, (e) => {
    e.preventDefault();
    const usuarioActual = usuariosRegistrados.find((usuario) => usuario.id === idUsuarioActual);
    solicitarDeposito(usuarioActual);
});

// Capturo el click del boton para cancelar el deposito
btnCancelarDeposito.addEventListener(`click`, () => {
    inputImporteDeposito.value = ``;
    formularioDeposito.classList.add(`oculto`);
    mensajeOperacion.textContent = `Operación cancelada`;
});

// Capturo el click del boton para ***EXTRAER DINERO***
btnExtraer.addEventListener(`click`, () => {
    formularioDeposito.classList.add(`oculto`);
    formularioCambioClaveUsuario.classList.add(`oculto`);
    formularioExtraccion.classList.remove(`oculto`);
    mensajeOperacion.textContent = `Ingrese el importe a extraer`;
});

formularioExtraccion.addEventListener(`submit`, (e) => {
    e.preventDefault();
    const usuarioActual = usuariosRegistrados.find((usuario) => usuario.id === idUsuarioActual);
    solicitarExtraccion(usuarioActual);
});

// Capturo el click del boton para cancelar la extraccion
btnCancelarExtraccion.addEventListener(`click`, () => {
    inputImporteExtraccion.value = ``;
    formularioExtraccion.classList.add(`oculto`);
    mensajeOperacion.textContent = `Operación cancelada`;
});

// Capturo el click del boton para ***CAMBIAR CLAVE DEL USUARIO***
btnCambiarClaveUsuario.addEventListener(`click`, () => {
    formularioDeposito.classList.add(`oculto`);
    formularioExtraccion.classList.add(`oculto`);
    formularioCambioClaveUsuario.classList.remove(`oculto`);
    mensajeOperacion.textContent = `Ingrese su nueva clave de 4 dígitos`;
});

formularioCambioClaveUsuario.addEventListener(`submit`, (e) => {
    e.preventDefault();
    solicitarCambioClaveUsuario(idUsuarioActual);
});

// Capturo el click del boton para cancelar el cambio de clave del usuario
btnCancelarCambioClaveUsuario.addEventListener(`click`, () => {
    inputNuevaClaveUsuario.value = ``;
    formularioCambioClaveUsuario.classList.add(`oculto`);
    mensajeOperacion.textContent = `Operación cancelada`;
});

// Capturo el click de los botones para salir del simulador
btnSalirAdmin.addEventListener(`click`, salir);
btnSalirCliente.addEventListener(`click`, salir);

// Inicio del simulador - el finally de cargarDatos habilita el ingreso solo si los datos se cargan correctamente
cargarDatos();
