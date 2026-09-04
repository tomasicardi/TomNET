# Tienda TomNET

Aplicacion web de e-commerce (celulares y accesorios), hecha para el Taller de
Integracion de Proyecto Web. Es la evolucion del proyecto que entregue en
Programacion 1, con las mejoras que pide la letra del taller.

Demo publicada: agregar el link de GitHub Pages una vez publicado
(https://usuario.github.io/repositorio/)

## Funcionalidad

- Registro e inicio de sesion (cliente y administrador)
- Catalogo de productos, con busqueda por nombre y filtro por categoria
- Cotizacion del dolar mostrada en el catalogo (API publica)
- Carrito de compras: agregar, modificar cantidad, eliminar, confirmar compra
- Calculo de IVA (basico 22%, minimo 10%, exento) y precio final
- Panel de administracion: alta de productos (con imagen), stock, baja de productos
- Historial de ventas
- Todo se guarda en localStorage (no hay backend)

## Estructura del proyecto

```
index.html               (registro)
login.html
menu.html                (menu cliente)
menu-admin.html          (menu administrador)
productos.html           (catalogo)
productos-admin.html     (catalogo, admin)
productos-crear.html
carrito.html
ventas.html
guia_uso.html
css/style.css
img/placeholder.svg
js/
  modelos/       -> clases Producto, Usuario, Venta
  servicios/     -> Storage, Seguridad, ApiCotizacion, y los gestores
  ui/            -> Notificador.js (notificaciones y confirmaciones)
  paginas/       -> un archivo js por cada pantalla
.github/workflows/deploy.yml   (publica solo en GitHub Pages)
```

## Requisitos del taller que se aplicaron

- **Clases y modulos ES6**: Producto, Usuario y Venta son clases. Los gestores
  (GestorProductos, GestorUsuarios, GestorCarrito, GestorVentas) tambien son
  clases con metodos estaticos. Todo usa import/export.
- **Bootstrap**: grilla, navbar, cards, formularios y el accordion de la pagina
  de ayuda. Los colores se cambiaron con variables CSS para no dejar el celeste
  por defecto de Bootstrap.
- **Delegacion de eventos**: en vez de poner un listener a cada tarjeta de
  producto, se pone uno solo en el contenedor y se fija que boton se apreto con
  `event.target.closest()`.
- **API publica + fetch + async/await**: se usa DolarApi
  (https://dolarapi.com/docs/uruguay/) para mostrar la cotizacion del dolar.
  Se guarda en localStorage por 30 minutos para no pedirla todo el tiempo.
- **Seguridad basica**: las contrasenas se guardan como hash SHA-256, no en
  texto plano. El texto que escribe el usuario se escapa antes de mostrarlo
  (para evitar XSS). El login se bloquea 30 segundos despues de 5 intentos
  fallidos.
- **Accesibilidad**: link para saltar al contenido, foco visible, aria-live en
  las zonas que cambian, alt en las imagenes, notificaciones propias en vez de
  alert()/confirm().
- **Responsive**: se ve bien en celular gracias a la grilla de Bootstrap y el
  navbar que se colapsa.

## Como probarlo

No hace falta instalar nada, es HTML/CSS/JS con modulos ES6. Como los modulos
no cargan bien abriendo el archivo directo (file://), hay que levantar un
servidor simple:

- VS Code con la extension Live Server, o
- `npx serve .`, o
- `python3 -m http.server`

Para probar el panel de administrador: correo `admin@tienda.com`, contrasena
`admin1234`.

## Publicar en GitHub Pages

El repositorio ya tiene el workflow en `.github/workflows/deploy.yml`.

1. Subir el proyecto a un repositorio de GitHub.
2. En Settings > Pages > Source, elegir "GitHub Actions".
3. Al hacer push a main se publica solo.
4. La URL queda en Settings > Pages.

## Lo que quedo pendiente

- Exportar el listado de ventas a CSV (queda para mas adelante).

## Equipo

Tomas Icardi

## Fuentes usadas

- Bootstrap 5: https://getbootstrap.com/
- DolarApi: https://dolarapi.com/
