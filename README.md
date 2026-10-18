# Simulador de cajero automático

## Descripción

Este proyecto representa un simulador de cajero automático desarrollado con HTML, CSS y JavaScript. Permite validar el acceso
de usuarios registrados y dirigirlos a uno de los dos perfiles disponibles:

- **Administrador:** gestiona los usuarios del sistema.
- **Usuario:** realiza operaciones básicas sobre su cuenta bancaria.

La información se utiliza en memoria dentro del arreglo `usuariosRegistrados`
y se guarda en `localStorage`. Los usuarios, las claves, los saldos y el
próximo ID se recuperan al recargar la página.

## Tecnologías utilizadas

- HTML5 para la estructura de la aplicación.
- CSS3 para los estilos de la interfaz.
- JavaScript para la validación, los menús y las operaciones del simulador.

## Persistencia de datos

El simulador utiliza únicamente la clave `simuladorCajero` de
`localStorage`. Guarda un objeto con `usuariosRegistrados` y `proximoIdUsuario`
mediante `setItem` y `JSON.stringify`. Al iniciar, lo recupera con `getItem`
y `JSON.parse`; si no existe, guarda los usuarios iniciales.

Cada usuario tiene un arreglo `movimientos` con sus depósitos y extracciones
exitosos. Cada registro contiene `tipo`, `importe`, `saldoAnterior`,
`saldoActual` y `fecha`.

La `fecha` se toma del sistema con `new Date()` en el momento en que se registra
la operación y se guarda como texto con formato `DD-MM-AAAA hh:mm` (24 horas),
por ejemplo `12-10-2026 14:35`. La genera el programa: no existe ningún campo
para ingresarla ni modificarla. Los movimientos registrados antes de incorporar
este dato no tienen fecha y se muestran como **No registrada**; no se les
asigna una fecha inventada. El formato de la fecha no se valida al recuperar
los datos.

El saldo y el nuevo movimiento se preparan en una copia del usuario
y de su historial. Solo se incorporan al estado del simulador después de guardar
correctamente los datos; no es necesario deshacer cambios sobre el original.
Las consultas, los cambios de clave, las cancelaciones y las operaciones
rechazadas no generan movimientos.

Los usuarios guardados antes de incorporar el historial reciben un arreglo
vacío sin cambiar sus IDs, claves ni saldos. Al iniciar, los datos recuperados
se vuelven a guardar con `guardarDatos`, que también actualiza el estado del
simulador. No se reconstruyen operaciones anteriores: el primer movimiento
parte del saldo que tenga la cuenta en ese momento, que puede ser distinto de
su saldo inicial.

Cada registro, eliminación, blanqueo, cambio de clave, depósito y extracción
prepara sus cambios con arrays y spread. Primero se valida y guarda el estado
propuesto; después se actualizan `usuariosRegistrados` y `proximoIdUsuario`
y se muestra la confirmación. Si la escritura no termina, los datos anteriores
del simulador no se modifican.

Se valida la estructura de los datos, los IDs y nombres, las claves,
los tipos de cuenta, los saldos finitos y la presencia de `ADMIN`. También se
comprueba que los movimientos tengan importes positivos, saldos consecutivos
y un saldo final igual al de la cuenta. `ADMIN` no tiene movimientos de cajero.
La validación del historial usa `every`: cada movimiento devuelve `true` si es
válido y `false` si es inválido.
La validación de usuarios también usa `every` para comprobar que todos sean
válidos. `some` comprueba que exista `ADMIN`. El registro de usuarios sigue
rechazando nombres ya registrados y asignando IDs con el contador, pero la
validación de los datos guardados no detecta IDs o nombres repetidos que ya
estén presentes en el almacenamiento.
Las validaciones con `if` de las operaciones conservan sus mensajes en pantalla.
Si al iniciar los datos guardados no se pueden leer o no tienen el formato
esperado, se informa el error en el panel de inicio sin borrar ni reemplazar
el almacenamiento. El ingreso solo se habilita después de completar
correctamente la carga. Los cambios se guardan antes de aplicarse para
conservar los datos anteriores aun cuando una escritura falla. El detalle de
estos errores se describe en **Manejo de errores**.

La lectura utiliza `??` para el primer uso y spread para completar el
arreglo `movimientos` de cada usuario. La validación utiliza `?.` y un ternario para
distinguir el tipo de cuenta del administrador.

F5 vuelve a la pantalla de ingreso, pero conserva los datos. No se almacenan
la sesión de ingreso, los intentos, los formularios ni los mensajes de pantalla.
Después de ingresar, **Listar usuarios** y las operaciones de la cuenta usan
los datos recuperados. No se utiliza `localStorage.clear()` ni se modifican
otras claves de almacenamiento.

## Manejo de errores

La lectura y la escritura en `localStorage` utilizan `try`, `catch` y
`finally` para que un error del navegador o de los datos no detenga el
simulador sin aviso.

### Carga de datos al iniciar

La función `cargarDatos()` coloca dentro de `try` las instrucciones que pueden
fallar:

- `localStorage.getItem`, si el navegador bloquea el almacenamiento.
- `JSON.parse`, si el texto guardado no es un JSON válido.
- La validación con `validarDatosGuardados`. Si los datos no tienen el formato
  esperado, se lanza un error con
  `throw new Error("Los datos guardados no tienen un formato válido")`.

Si ocurre alguno de estos errores, el control pasa a `catch`, que muestra
`error.message` en el panel de inicio. Para la validación se muestra
**Los datos guardados no tienen un formato válido**; para los errores de
`getItem` o `JSON.parse` se muestra el mensaje que genera el navegador.

Si la lectura es correcta, los datos se vuelven a guardar con `guardarDatos()`.
Si esa escritura falla, no se pasa por el `catch` de `cargarDatos()`: el
mensaje lo muestra `guardarDatos()` en el panel de inicio (ver **Escritura de
datos**), y la carga se considera fallida.

El bloque `finally` se ejecuta siempre, haya habido éxito o error. Llama a
`deshabilitarIngreso(!datosCargados)`: el ingreso se habilita solo si la carga
terminó correctamente y queda deshabilitado en cualquier otro caso. El
almacenamiento no se borra ni se reemplaza cuando la carga falla.

### Escritura de datos

Antes de escribir, `guardarDatos()` valida el estado propuesto con
`validarDatosGuardados` mediante un `if`. Si no es válido, por ejemplo cuando
un depósito llevaría el saldo a `Infinity`, muestra **La operación produce
datos no válidos y no se guardó** y no intenta escribir.

La función `guardarDatos()` coloca `localStorage.setItem` dentro de `try`.
Si el navegador bloquea el almacenamiento o se queda sin espacio, `catch`
muestra `error.message`, el mensaje que genera el navegador, en el panel donde
se ejecutó la operación.

Como `usuariosRegistrados` y `proximoIdUsuario` se actualizan solo después de
guardar correctamente, una escritura fallida no aplica registros, eliminaciones,
cambios de clave, depósitos ni extracciones. El formulario permanece abierto,
como ante cualquier otro error.

### Cómo probar los errores de carga

Desde las herramientas de desarrollo del navegador (F12), en
*Application → Local Storage*:

1. **JSON mal formado:** reemplazar el valor de `simuladorCajero` por `{abc`
   y recargar. El panel de inicio muestra el mensaje que genera el navegador
   y el ingreso queda deshabilitado.
2. **Formato no válido:** cambiar alguna `"clave"` por `"pepe"` y recargar.
   El panel de inicio muestra **Los datos guardados no tienen un formato
   válido** y el ingreso queda deshabilitado.

Para volver a la normalidad, se debe borrar la clave `simuladorCajero` y
recargar. Se cargan nuevamente los usuarios iniciales y se pierden los
cambios guardados.

## Cómo ejecutar el simulador

1. Abrir [index.html](index.html) en un navegador web.
2. Completar los campos **Usuario** y **Clave** del panel de inicio y pulsar
   **Ingresar** o presionar **Enter** desde cualquiera de esos campos.
3. Para probar el listado, ingresar como `ADMIN` y pulsar **Listar usuarios**.
4. Consultar los datos y la cantidad de registros en **Usuarios**, y el
   mensaje de la acción en **Resultado**.
5. Para crear un usuario, pulsar **Nuevo usuario**, completar nombre, clave,
   tipo de cuenta y saldo inicial, y pulsar **Registrar usuario** o presionar
   **Enter** desde un campo de texto.
6. Para buscar usuarios, pulsar **Buscar usuario**, escribir un nombre completo
   o parcial y pulsar **Buscar** o presionar **Enter**.
7. Para consultar movimientos, salir, recargar e ingresar con una cuenta de
   cliente. Pulsar **Consulta movimientos** para ver su historial y sus saldos.

El sistema permite hasta tres intentos de inicio de sesión. Las claves deben
ser números enteros de cuatro dígitos, entre `1000` y `9999`.

### Usuarios de prueba

| ID | Usuario | Clave | Perfil | Saldo inicial |
| ---: | --- | ---: | --- | ---: |
| 1 | JUAN | 1234 | Usuario | $100000 |
| 2 | PEDRO | 2345 | Usuario | $150000 |
| 3 | MARIA | 3456 | Usuario | $180000 |
| 4 | ANA | 4567 | Usuario | $200000 |
| 5 | ANDREA | 5678 | Usuario | $300000 |
| 6 | ADMIN | 2990 | Administrador | No aplica |

> **Importante:** `ADMIN` es una cuenta exclusiva para acceder al panel
> administrador. No es un usuario de cajero y no puede realizar operaciones
> sobre un saldo, como consultar, depositar o extraer dinero.

## Interacción con la pantalla según el perfil

La página contiene tres paneles: `panel-inicio`, `panel-cliente` y
`panel-administrador`. Inicialmente solo se muestra el panel de inicio.
Al ingresar correctamente, se oculta el inicio y se muestra únicamente el
panel correspondiente al perfil.

### Perfil administrador

Con los datos iniciales, para acceder se debe ingresar:

- Usuario: `ADMIN`
- Clave: `2990`

El usuario `ADMIN` solo permite acceder al panel administrador. Su saldo no
está disponible para operaciones de cajero.

Para blanquear una clave, cambiarla o eliminar una cuenta, se utiliza su ID
numérico, visible en **Listar usuarios** y en los resultados de **Buscar usuario**.
El inicio de sesión continúa utilizando el nombre y la clave.

El perfil administrativo conserva las siguientes operaciones, todas conectadas
a sus botones:

1. **Listar usuarios:** recorre el arreglo de usuarios y genera un bloque
   HTML por registro, con su nombre, ID, clave, tipo de cuenta y saldo inicial,
   en ese orden. Para `ADMIN`, el saldo inicial indica **No aplica**, porque
   es una cuenta administrativa y no una cuenta de cajero.
2. **Buscar usuario:** muestra todos los usuarios cuyos nombres contienen el
   texto ingresado, con el mismo formato del listado completo.
3. **Nuevo usuario:** abre un formulario para ingresar un nombre, una clave
   de cuatro dígitos y un saldo inicial, y elegir entre **Sueldo** y
   **Caja de Ahorro** para el tipo de cuenta. Crea una instancia de `Usuario` con un ID asignado
   automáticamente.
4. **Blanquear clave:** abre un formulario para ingresar el ID de un usuario y
   asignarle la clave `1111`, mostrando el resultado de la operación en la página.
5. **Cambiar clave:** abre un formulario para ingresar el ID de un usuario y una
   nueva clave válida. Al enviar el formulario, limpia y oculta el listado anterior y
   muestra la confirmación o el error en **Resultado**.
6. **Eliminar usuario:** abre un formulario para ingresar el ID del usuario que se
   eliminará del arreglo y muestra el resultado en la página. El usuario
   `ADMIN` no puede eliminarse.
7. **Salir:** finaliza el simulador y bloquea el ingreso hasta recargar la página.

En la pantalla, estas acciones se corresponden con los controles del panel
**Menú Administrador**:

- **Listar usuarios**
- **Buscar usuario**
- **Nuevo usuario**
- **Blanquear clave**
- **Cambiar clave**
- **Eliminar usuario**
- **Salir**

El bloque **Usuarios** muestra el listado y la cantidad de registros al
pulsar **Listar usuarios**. Cada clic reemplaza el listado anterior para no
duplicar elementos. El párrafo de **Resultado** informa que el listado se
actualizó o que no hay usuarios para mostrar. Ese mensaje y el texto
**No aplica** del saldo de `ADMIN` se eligen con ternarios. El bloque permanece
oculto hasta pulsar **Listar usuarios** o realizar una búsqueda.

#### Buscar usuarios por nombre

1. Pulsar **Buscar usuario** para abrir el formulario del administrador.
2. Escribir un nombre completo o una parte del nombre.
3. Pulsar **Buscar** o presionar **Enter** desde el campo.
4. Consultar las coincidencias y su cantidad en **Usuarios**.

La función `buscarUsuario(nombreUsuario)` normaliza el texto quitando espacios
al principio y al final y convirtiéndolo a mayúsculas. Usa `filter` e `includes`
para encontrar todas las coincidencias, aunque el texto aparezca en el medio
o al final del nombre. Por ejemplo, `an` encuentra a `JUAN`, `ANA` y `ANDREA`.
Si el campo está vacío o solo contiene espacios, se muestran todos los usuarios.

La búsqueda reutiliza `listarUsuarios` pasando el arreglo de coincidencias:
cada registro muestra nombre, ID, clave, tipo de cuenta y saldo inicial, sin
duplicar el código de armado del listado. Para `ADMIN`, el saldo inicial indica
**No aplica**. Cada consulta reemplaza los resultados anteriores.
Si no hay coincidencias, el listado queda vacío, el contador indica cero y
**Resultado** informa que no se encontraron usuarios.

El formulario permanece abierto para realizar otra búsqueda. **Cancelar**
limpia el campo y cierra el formulario sin modificar los registros.
**Listar usuarios** permite volver a mostrar la colección completa.
Al elegir otra operación del administrador se oculta el formulario de búsqueda,
conservando el texto pendiente, como en los demás formularios.

Esta búsqueda solo consulta datos. El inicio de sesión utiliza `find`
directamente sobre `usuariosRegistrados` para obtener la cuenta por nombre,
verificar su clave y mostrar el panel sin repetir la búsqueda. Las operaciones
de blanqueo, cambio de clave y eliminación utilizan `find` por ID para obtener
una sola cuenta y trabajar con ese objeto.

#### Nuevo usuario desde el panel administrador

1. Pulsar **Nuevo usuario** para mostrar el formulario dentro del panel.
2. Completar **Usuario** y **Clave de 4 dígitos**, elegir **Tipo de cuenta**
   e ingresar el **Saldo inicial**.
3. Pulsar **Registrar usuario** o presionar **Enter** desde un campo de texto.
4. Leer la confirmación o el error en el párrafo de **Resultado**.

Se conservan las validaciones existentes del nombre y la clave: la
clave debe ser un número entero entre `1000` y `9999`, y el usuario no debe
estar registrado. El nombre se normaliza quitando espacios al principio y al
final y convirtiéndolo a mayúsculas. Todos los campos son obligatorios.

El tipo de cuenta solo puede ser **Sueldo** o **Caja de Ahorro**. Esta última
se guarda como `Caja Ahorro`, conservando el valor que ya usan los usuarios
del arreglo.

El saldo inicial se convierte con `Number` y debe ser un número finito mayor
o igual a cero. Se permiten cero y decimales con punto; se rechazan los importes
negativos, el texto no numérico y valores como `Infinity`. El campo vacío no
se interpreta como cero.

Cuando el registro es correcto, se crea el objeto con el constructor de la
clase mediante `new Usuario(proximoIdUsuario, nombre, clave, saldoInicio, saldoInicio, tipoCta)`.
El saldo inicial y el saldo actual parten del mismo importe ingresado.
La instancia se agrega al arreglo sin modificar a los usuarios anteriores.

El identificador se asigna automáticamente a partir del mayor ID inicial.
El contador se guarda junto con los usuarios, avanza solo cuando el registro
es correcto y no retrocede al eliminar usuarios ni al recargar la página.
La confirmación muestra el ID asignado.

Los campos se limpian, el selector vuelve a **Seleccione un tipo de cuenta**
y el formulario se oculta. **Cancelar** también limpia y oculta el formulario,
pero no agrega usuarios. Si hay un error, no se registra ninguna cuenta y se
conservan los datos ingresados para corregirlos.

Al intentar registrar, el listado anterior se limpia y se oculta, como en
**Cambiar clave**. Para ver la colección actualizada y su cantidad de registros,
se debe pulsar **Listar usuarios**. Al alternar entre **Buscar usuario**, **Nuevo registro**,
**Blanquear clave**, **Cambiar clave** y **Eliminar usuario**, solo se muestra
el formulario elegido.

#### Blanquear clave desde el panel administrador

1. Pulsar **Blanquear clave** para mostrar el formulario dentro del panel.
2. Completar el campo **ID del usuario**.
3. Salir del campo con **Tab** o haciendo clic fuera para consultar el nombre
   de la cuenta debajo del ID.
4. Pulsar **Blanquear clave** en el formulario o presionar **Enter** desde el
   campo.
5. Leer la confirmación o el error en el párrafo de **Resultado**.

Al perder el foco, `buscarUsuarioPorId` consulta el arreglo con `find` y muestra
**Nombre: JUAN**, por ejemplo, o **Usuario no encontrado**. Esta consulta no
modifica la clave ni el listado. Un campo vacío limpia la consulta; al confirmar
se conserva la validación de dato obligatorio.

El mensaje debajo del ID tiene un espacio fijo para que su aparición no
desplace los botones al hacer clic. Los nombres largos pueden desplazarse dentro de ese espacio.

Al editar el ID se borra la consulta anterior. También se limpia al cancelar,
completar la operación o salir. Si se reabre el formulario con un ID pendiente,
se vuelve a consultar para no mostrar información desactualizada. Este criterio
también se aplica a los formularios de **Cambiar clave** y **Eliminar usuario**.

El ID es obligatorio y debe ser un número entero mayor que cero. El formulario
lo convierte con `Number` y la operación busca la cuenta con `find` por ID.
Si no existe, se muestra **Usuario no encontrado**. Ante un error no se modifica
ninguna clave y el formulario permanece abierto para corregir el dato.

Cuando la operación es correcta, se asigna la clave `1111` al usuario indicado,
se limpia el campo y se oculta el formulario. Los demás datos del usuario no
cambian. Se permite blanquear también la clave de `ADMIN`, como en la función
original. **Cancelar** limpia y oculta el formulario sin modificar usuarios.

Al enviarse el formulario, el listado anterior se limpia y se oculta, tanto si la
operación es correcta como si falla una validación. Para consultar las claves
actualizadas, se debe pulsar **Listar usuarios**. Los cambios se guardan en
`localStorage` y se recuperan al recargar la página.

#### Cambiar clave desde el panel administrador

1. Pulsar **Cambiar clave** para mostrar el formulario dentro del panel.
2. Completar **ID del usuario** y salir del campo con **Tab** o haciendo clic
   fuera para ver el nombre de la cuenta o **Usuario no encontrado** debajo del ID.
3. Completar **Nueva clave de 4 dígitos**.
4. Pulsar **Guardar clave** o presionar **Enter** desde uno de los campos.
5. Leer la confirmación o el error en el párrafo de **Resultado**.

La consulta previa usa la misma función `buscarUsuarioPorId` que el blanqueo.
Solo muestra la cuenta encontrada: la clave no cambia hasta confirmar.
La operación vuelve a buscar al usuario al guardar, sin depender de la consulta
previa.

Ambos datos son obligatorios. El ID debe ser un número entero mayor que cero
y se convierte con `Number` para buscar la cuenta con `find` por ID.
La clave debe ser un número entero entre `1000` y `9999`, y el usuario debe
estar registrado. No se modifica ninguna clave si los datos no son válidos.

Al enviarse el formulario, el listado anterior se limpia y se oculta tanto si el
cambio es correcto como si falla alguna validación. El mensaje de la operación
se muestra en **Resultado**, sin volver a generar el listado.
Para consultarlo de nuevo con los datos actuales, se debe pulsar
**Listar usuarios**. Limpiar el listado no elimina usuarios del arreglo.

Cuando el cambio es correcto, se limpian los campos y se oculta el formulario.
Si hay un error, el formulario permanece abierto para corregir los datos.
**Cancelar** limpia y oculta el formulario, pero no modifica los usuarios.

Esta operación permite cambiar la clave de cualquier usuario registrado,
incluido `ADMIN`, sin habilitarle operaciones de cajero. Los cambios se
guardan en `localStorage` y se recuperan al recargar la página.

#### Eliminar usuario desde el panel administrador

1. Pulsar **Eliminar usuario** para mostrar el formulario dentro del panel.
2. Completar **ID del usuario** y salir del campo con **Tab** o haciendo clic
   fuera para ver el nombre de la cuenta o **Usuario no encontrado** debajo del ID.
3. Pulsar **Eliminar usuario** en el formulario o presionar **Enter** desde
   el campo.
4. Leer la confirmación o el error en el párrafo de **Resultado**.

La consulta previa usa la misma función `buscarUsuarioPorId` que el blanqueo y
el cambio de clave. Solo muestra la cuenta encontrada: el usuario no se elimina
hasta confirmar, y la operación vuelve a buscarlo sin depender de la consulta.

El ID es obligatorio y debe ser un número entero mayor que cero. Se convierte
con `Number` y se busca la cuenta con `find` por ID. El usuario debe estar
registrado y `ADMIN` no puede eliminarse, aunque se ingrese su ID.
Si hay un error, no se modifica el arreglo y el formulario permanece abierto
para corregir el dato.

Cuando la operación es correcta, se elimina únicamente el usuario indicado,
se limpia el campo y se oculta el formulario. Los demás usuarios conservan sus
datos. **Cancelar** limpia y oculta el formulario sin eliminar usuarios.

Al enviarse el formulario, el listado anterior se limpia y se oculta, tanto si la
operación es correcta como si falla una validación. Para consultar los usuarios
restantes y la cantidad actualizada, se debe pulsar **Listar usuarios**. La
eliminación también se guarda en `localStorage`: el usuario eliminado no
vuelve a aparecer al recargar la página.

#### Limpieza reutilizable de la interfaz

La función `limpiarInterfaz()` vacía los inputs y las selecciones de la aplicación,
oculta sus formularios y todos los paneles, incluido el de inicio. También limpia el
listado visible de usuarios, pone su contador en cero y oculta su contenedor,
sin eliminar registros del arreglo. También vacía y oculta el aviso del cliente.

Los elementos se seleccionan dentro de `#aplicacion` en cada llamada, por lo
que también se incluyen los inputs, selectores, formularios y paneles que se agreguen allí
más adelante. No se elimina la estructura HTML de los formularios ni sus eventos.

Esta función solo realiza la limpieza visual: no modifica la sesión, los
intentos, los datos de los usuarios ni la habilitación de los controles.
La acción que la llama decide qué panel mostrar y qué mensajes comunicar.

#### Salir desde ambos paneles

Los botones **Salir** del administrador y del cliente llaman a la misma función
`salir`. Esta cancela con `clearTimeout` el aviso del cliente si todavía no se
mostró y el temporizador de inactividad, cierra la sesión y llama a `limpiarInterfaz()` para limpiar los
campos y el listado y ocultar los formularios y paneles. Después vuelve a
mostrar únicamente el panel de inicio con el mensaje
**Simulador finalizado - Recargue la página para iniciar nuevamente**.

Los campos de ingreso y el botón **Ingresar** quedan deshabilitados.
Presionar **Enter** tampoco permite iniciar otra sesión: para volver a usar
el simulador es necesario recargar la página. No se habilitan otros tres
intentos al salir.

La salida no modifica el arreglo de usuarios ni los datos guardados. Al
recargar, se recupera el último estado de `localStorage`, no los datos
iniciales. Se debe ingresar con la última clave guardada de la cuenta.

### Perfil usuario

Para acceder se debe ingresar uno de los usuarios comunes de la tabla de
prueba y su clave correspondiente. Se muestra el panel del cliente con el saldo
actual de esa cuenta, sin necesidad de pulsar primero **Consultar saldo**.
Tres segundos después aparece un **Aviso** con información complementaria
(ver **Aviso al ingresar**). Si el cliente no usa el cajero durante 5 minutos,
la sesión se cierra (ver **Cierre por inactividad**).

El ingreso guarda el identificador de la cuenta en `idUsuarioActual`. Las
consultas de saldo y movimientos, los depósitos y las extracciones usan `find`
directamente sobre `usuariosRegistrados` para obtener el objeto por ese ID.
La clase `Usuario` se utiliza para crear usuarios nuevos, no para buscarlos.

Todas las opciones del panel están conectadas a sus botones:

1. **Consultar saldo:** muestra la confirmación de la consulta y el saldo actual
   del usuario que inició sesión, sin modificarlo.
2. **Consulta movimientos:** muestra el saldo inicial, los depósitos y
   extracciones registrados en orden y el saldo actual de esa cuenta.
3. **Extraer:** abre un formulario para ingresar un importe positivo y lo
   descuenta del saldo actual si hay fondos suficientes, mostrando el resultado.
4. **Depositar:** abre un formulario para ingresar un importe positivo, lo suma
   al saldo actual y muestra el resultado en la página.
5. **Cambiar clave:** abre un formulario para establecer una nueva clave válida
   únicamente para la cuenta del usuario que inició sesión.
6. **Salir:** finaliza el simulador hasta recargar la página, con la misma
   función utilizada por el administrador.

Después de cada operación se puede elegir otra opción del panel o pulsar
**Salir**, sin preguntas mediante cuadros de diálogo.

En la pantalla, estas acciones se corresponden con los controles del panel
**Simulador de Cajero Automático**:

- **Consultar saldo**
- **Consulta movimientos**
- **Depositar**
- **Extraer**
- **Cambiar clave**
- **Salir**

El bloque **Resultado** muestra los mensajes de las operaciones. El saldo actual
se carga al ingresar y se actualiza al consultar, depositar o extraer.
Cambiar la clave no modifica el saldo ni cierra la sesión.

#### Aviso al ingresar

Al ingresar un cliente, `programarAvisoCliente` utiliza `setTimeout` para
mostrar el bloque **Aviso** tres segundos después, debajo de **Resultado**.
El aviso es asincrónico: el panel se puede usar de inmediato, sin esperar a
que aparezca el mensaje. Se ubica debajo de los formularios para no desplazar
los botones del menú al aparecer.

El texto lo arma `obtenerAvisoCliente`:

- Si la clave de la cuenta es `1111`, la clave asignada en un blanqueo, indica
  **Su clave fue blanqueada. Le recomendamos cambiarla desde "Cambiar clave"**.
- Si no, muestra el último movimiento con su tipo, importe y fecha, por ejemplo
  **Último movimiento: Depósito de $5000 - Fecha: 12-10-2026 14:35**.
- Si la cuenta no tiene movimientos, indica
  **Aún no registra movimientos en su cuenta**.

La cuenta se busca con `find` cuando se cumplen los tres segundos, no al
ingresar.

El simulador no registra si una clave fue blanqueada: solo compara su valor con
`1111`. Una cuenta que tenga esa clave por haberla elegido también recibe el
aviso.

El identificador del temporizador se guarda en `temporizadorAviso`. Al pulsar
cualquier botón del menú del cliente, `ocultarAvisoCliente` lo cancela con
`clearTimeout` y oculta el aviso:

- Si se pulsa antes de los tres segundos, el aviso no llega a mostrarse.
- Si ya se mostró, desaparece.

En ambos casos el aviso no vuelve a aparecer durante esa sesión. Los botones
se recorren con `querySelectorAll` y `forEach`, sin modificar sus eventos
propios. **Salir** también cancela el temporizador con `clearTimeout`. El panel
administrador no tiene aviso.

#### Cierre por inactividad

Al ingresar un cliente, `reiniciarInactividad` utiliza `setTimeout` para
programar el cierre de la sesión a los 5 minutos. El tiempo se define en
`tiempoInactividad`, expresado en milisegundos (`5 * 60 * 1000`).

Cualquier uso del panel del cliente reinicia la cuenta desde cero: cualquier
clic dentro del panel (en los botones del menú, en los de los formularios o en
cualquier otra parte) y la escritura en sus campos. Para eso, el panel escucha
los eventos `click` e `input`. Cada vez,
`reiniciarInactividad` cancela el temporizador anterior con `clearTimeout` y
arranca uno nuevo. Así, una operación que lleva tiempo, como escribir un
importe, no se interrumpe.

Si pasan 5 minutos sin uso, `cerrarSesionPorInactividad` llama a `salir()`.
La sesión se cierra igual que con **Salir** y la pantalla de inicio muestra
**Sesión finalizada por inactividad - Recargue la página para iniciar
nuevamente**. El ingreso queda bloqueado hasta recargar la página.

Si el cliente pulsa **Salir** antes, `salir()` cancela el temporizador. Ese
clic también llega al panel del cliente, pero `reiniciarInactividad` solo
arranca un temporizador si hay una sesión abierta (`idUsuarioActual` distinto
de `null`). Por eso no queda un cierre pendiente después de salir.

El panel administrador no tiene cierre por inactividad.

Para probarlo sin esperar 5 minutos, se puede cambiar temporalmente
`tiempoInactividad` a `10 * 1000` (10 segundos).

#### Consultar saldo desde el panel del usuario

1. Ingresar con un usuario común de la tabla de prueba y su clave.
2. Pulsar **Consultar saldo**.
3. Leer **Consulta de saldo realizada** y el importe en **Saldo actual**.

Cada consulta vuelve a leer el saldo actual de la cuenta del usuario que inició
sesión, no su saldo inicial. La consulta no modifica saldos, claves ni registros.

#### Consulta de movimientos desde el panel del usuario

1. Pulsar **Consulta movimientos**.
2. Leer el saldo inicial de la cuenta y los movimientos en orden de realización.
3. Consultar la fecha y hora, el importe con signo, el saldo anterior y el
   saldo posterior de cada depósito o extracción, y el saldo actual al final
   del listado.

La consulta utiliza únicamente el historial del usuario que inició sesión.
Si está vacío, muestra **No hay movimientos registrados**. Cada consulta
reemplaza el listado anterior para no duplicar registros.

Si el registro comenzó cuando la cuenta ya tenía un saldo distinto del inicial,
se muestra también **Saldo al comenzar el registro**. Se obtiene del saldo
anterior del primer movimiento o del saldo actual cuando aún no hay movimientos.
No se inventan operaciones para explicar saldos anteriores a esta función.

Consultar no modifica los datos ni limpia u oculta formularios pendientes.
Mientras el historial está visible, cada depósito o extracción exitoso actualiza
el listado y el saldo final automáticamente, conservando el mensaje de la
operación en **Resultado**. Los errores y las cancelaciones no agregan registros.

**Salir** limpia y oculta esta consulta, pero no borra el historial guardado.
Después de F5 se debe ingresar nuevamente y pulsar **Consulta movimientos**.
Los registros de cada cuenta se conservan entre ingresos. Al eliminar un
usuario también se elimina su historial del estado guardado.

El listado utiliza `forEach`, destructuring con alias, ternarios, `?.`, `??`
y templates con backticks. El saldo cero se conserva como un valor válido.

#### Depositar desde el panel del usuario

1. Pulsar **Depositar** para mostrar el formulario dentro del panel.
2. Completar **Importe a depositar**.
3. Pulsar **Depositar** en el formulario o presionar **Enter** desde el campo.
4. Leer **Depósito realizado** y el importe actualizado en **Saldo actual**.

Se mantienen las validaciones existentes: el campo es obligatorio, se convierte
el dato con `Number` y se rechazan los valores que resultan `NaN` o son
menores o iguales a cero. Un texto que `Number` no puede convertir, como
`100abc`, resulta `NaN` y se rechaza. Algunos textos con letras sí se
convierten y se aceptan: por ejemplo, `0x10` (hexadecimal) se interpreta como
`16` y `1e3` (notación científica) como `1000`. Además, el estado solo se guarda si el saldo resultante
es finito: valores como `Infinity` se rechazan sin modificar el saldo, porque
JSON no puede conservarlos como números. En ese caso se muestra **La operación
produce datos no válidos y no se guardó**.

El depósito actualiza el saldo actual y agrega un movimiento al historial del
usuario que inició sesión. El saldo inicial, las claves y los demás usuarios
no cambian. Cuando la operación es correcta, se limpia el importe y se oculta
el formulario. Si hay un error, el formulario permanece abierto con el dato
ingresado para corregirlo.

**Cancelar** limpia y oculta el formulario sin modificar el saldo.
**Consultar saldo** permite comprobar el saldo mientras se completa el formulario,
sin confirmar el importe pendiente. **Salir** también limpia y oculta el
formulario, sin ejecutar depósitos pendientes ni deshacer los ya realizados.
Los depósitos confirmados se guardan en `localStorage` y se recuperan al
recargar la página.

Al alternar entre **Depositar**, **Extraer** y **Cambiar clave**, solo se muestra
el formulario elegido y se conservan los datos que todavía no se confirmaron.

#### Extraer desde el panel del usuario

1. Pulsar **Extraer** para mostrar el formulario dentro del panel.
2. Completar **Importe a extraer**.
3. Pulsar **Extraer** en el formulario o presionar **Enter** desde el campo.
4. Leer la confirmación o el error en **Resultado**, junto al saldo actual.

Se mantienen las validaciones existentes: el campo es obligatorio, se convierte
el dato con `Number` y se rechazan los valores que resultan `NaN` o son
menores o iguales a cero. El importe no puede superar el saldo actual.
No se agregan límites ni validaciones adicionales.

Si hay saldo suficiente, se descuenta únicamente el importe de la cuenta del
usuario que inició sesión y se muestra **Extracción realizada**. Se permite
retirar un importe igual al saldo disponible y dejar la cuenta en cero.
Se agrega el movimiento al historial de esa cuenta. El saldo inicial, las
claves y las demás cuentas no se modifican.

Si el importe supera el saldo, se muestra **Saldo Insuficiente** y el saldo
disponible, sin descontar dinero. Ante errores, el formulario permanece abierto
con el dato ingresado para corregirlo. Solo una extracción correcta limpia el
campo y oculta el formulario.

**Cancelar** limpia y oculta el formulario sin extraer dinero. **Consultar saldo**
permite comprobar los fondos sin ejecutar ni borrar el importe pendiente.
**Salir** limpia y oculta los formularios del cajero, sin ejecutar operaciones
pendientes ni deshacer las confirmadas. Las extracciones confirmadas se guardan
en `localStorage` y se recuperan al recargar la página.

#### Cambiar clave desde el panel del usuario

1. Pulsar **Cambiar clave** para mostrar el formulario.
2. Completar **Nueva clave de 4 dígitos**.
3. Pulsar **Guardar clave** o presionar **Enter** desde el campo.
4. Leer la confirmación o el error en **Resultado**.

Se conserva la validación existente: el dato es obligatorio y, tras convertirlo
con `Number`, debe ser un número entero entre `1000` y `9999`. No se solicitan
la clave anterior ni una repetición de la nueva, ni se agregan otras reglas.

La cuenta se obtiene usando el ID guardado al iniciar sesión: el usuario no
puede elegir otra cuenta en este formulario. La función de cambio de clave se
comparte con el administrador, pero cada formulario indica en qué panel deben
mostrarse sus mensajes.

Si el cambio es correcto, se limpia el campo y se oculta el formulario. Ante
errores, permanece abierto para corregir el dato. Los saldos, las demás cuentas
y el estado de la sesión no se modifican.

**Cancelar** limpia y oculta el formulario sin cambiar la clave.
**Consultar saldo** no ejecuta ni borra un cambio de clave pendiente.
**Salir** también descarta el dato sin confirmar y finaliza el simulador hasta
recargar la página.

La clave modificada se guarda en `localStorage`. Al recargar la página se
debe ingresar con esa nueva clave, no con la clave inicial de la tabla de prueba.

## Estructura del proyecto

```text
Modulo 9/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
```
