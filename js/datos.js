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
