let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalAcumulado = JSON.parse(localStorage.getItem('totalAcumulado')) || 0;

function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.innerHTML = '';

    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        return;
    }

    let resumenCarrito = '<h2>Productos en tu Carrito</h2><ul class="list-group mb-4">';
    carrito.forEach((producto, index) => {
        resumenCarrito += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${index + 1}. ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
                <div>
                    <button class="btn btn-sm btn-secondary" onclick="disminuirCantidad(${index})">-</button>
                    <button class="btn btn-sm btn-secondary" onclick="aumentarCantidad(${index})">+</button>
                    <button class="btn btn-sm btn-success" onclick="eliminarProducto(${index})">🗑️</button>
                </div>
            </li>`;
    });
    resumenCarrito += `</ul><h4>Total: $${totalAcumulado}</h4>`;
    carritoContainer.innerHTML = resumenCarrito;
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
        totalAcumulado -= carrito[index].precio;
        actualizarCarrito();
    }
}

function aumentarCantidad(index) {
    carrito[index].cantidad += 1;
    totalAcumulado += carrito[index].precio;
    actualizarCarrito();
}

function eliminarProducto(index) {
    totalAcumulado -= carrito[index].precio * carrito[index].cantidad;
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('totalAcumulado', totalAcumulado);
    mostrarCarrito();
}

async function finalizarCompra() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;

    if (!nombre || !apellido || !correo || !direccion || !pais || !ciudad) {
        mostrarMensaje('Por favor, complete todos los campos del formulario.');
        return;
    }

    let resumen = `Resumen de Compra:\n\n`;
    resumen += `Nombre: ${nombre} ${apellido}\n`;
    resumen += `Correo: ${correo}\n`;
    resumen += `Dirección: ${direccion}, ${ciudad}, ${pais}\n\n`;
    resumen += `Productos:\n`;

    carrito.forEach(producto => {
        resumen += `${producto.nombre} - $${producto.precio} x ${producto.cantidad}\n`;
    });
    resumen += `\nTotal: $${totalAcumulado}`;

    mostrarMensaje('Compra finalizada. Se descargará el resumen en PDF.');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(resumen, 10, 10);

    doc.text('Proyecto realizado por', 200, 280, { align: 'right' });
    doc.text('Franco Tomás Armani', 200, 287, { align: 'right' });

    doc.save('resumen_compra.pdf');

    vaciarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    totalAcumulado = 0;
    localStorage.removeItem('carrito');
    localStorage.removeItem('totalAcumulado');
    mostrarCarrito();
    mostrarMensaje('Carrito vaciado');
}

function mostrarMensaje(mensaje) {
    const mensajeContainer = document.getElementById('mensaje-container');
    mensajeContainer.innerHTML = ''; // Limpiar mensajes anteriores
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alert alert-success mt-3';
    mensajeDiv.textContent = mensaje;
    mensajeContainer.appendChild(mensajeDiv);
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', mostrarCarrito);
