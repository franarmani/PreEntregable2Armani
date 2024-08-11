const productos = [
    { id: 1, nombre: 'Remera', precio: 500, imagen: '/img/productos/remera.jpeg' },
    { id: 2, nombre: 'Short', precio: 700, imagen: '/img/productos/short.jpeg' },
    { id: 3, nombre: 'Buzo', precio: 1200, imagen: '/img/productos/buzo.jpeg' },
    { id: 4, nombre: 'Joggin', precio: 300, imagen: '/img/productos/joggin.jpeg' }
];

function getValidJSONItem(key) {
    const item = localStorage.getItem(key);
    try {
        return JSON.parse(item);
    } catch (e) {
        return null;
    }
}

let carrito = getValidJSONItem('carrito') || [];
let totalAcumulado = parseFloat(localStorage.getItem('totalAcumulado')) || 0;

document.getElementById('carrito-total').textContent = `Total acumulado: $${totalAcumulado}`;

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        const productoEnCarrito = carrito.find(p => p.id === idProducto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        totalAcumulado += producto.precio;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('totalAcumulado', totalAcumulado.toString());
        mostrarMensaje(`${producto.nombre} agregado al carrito`);
        document.getElementById('carrito-total').textContent = `Total acumulado: $${totalAcumulado}`;
    }
}

function vaciarCarrito() {
    carrito = [];
    totalAcumulado = 0;
    localStorage.removeItem('carrito');
    localStorage.removeItem('totalAcumulado');
    document.getElementById('carrito-total').textContent = `Total acumulado: $${totalAcumulado}`;
    mostrarMensaje('Carrito vaciado');
}

function mostrarMensaje(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alert';
    mensajeDiv.textContent = mensaje;

    const existingMessage = document.querySelector('#carrito-info .alert');
    if (existingMessage) {
        existingMessage.remove();
    }

    const carritoInfo = document.getElementById('carrito-info');
    carritoInfo.appendChild(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.style.opacity = 0;
        setTimeout(() => mensajeDiv.remove(), 500);
    }, 3000);
}

function mostrarProductos() {
    const productosContainer = document.getElementById('productos-container');

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto'; 
        productoDiv.innerHTML = `
            <h2>${producto.nombre}</h2>
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
            <p>Precio: $${producto.precio}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        productosContainer.appendChild(productoDiv);
    });
}

document.addEventListener('DOMContentLoaded', mostrarProductos);
