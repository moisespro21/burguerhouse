
// Base de datos de los productos que tienes en el HTML
const productos = {
    'Clasica': { id: 'Clasica', nombre: 'Hamburguesa Clásica', precio: 8.99 },
    'Doble': { id: 'Doble', nombre: 'Hamburguesa Doble', precio: 12.99 },
    'BBQ': { id: 'BBQ', nombre: 'Hamburguesa BBQ', precio: 10.99 }
};

// Arreglo que funcionará como nuestro carrito
let carrito = [];

// Función para abrir y cerrar el menú lateral del carrito
function toggleCarrito() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

// Función principal para agregar productos desde los botones "Agregar"
function agregar(idProducto) {
    const producto = productos[idProducto];
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        // Si existe, solo sumamos 1 a la cantidad
        itemExistente.cantidad += 1;
    } else {
        // Si no existe, lo metemos al carrito con cantidad 1
        carrito.push({ 
            id: producto.id, 
            nombre: producto.nombre, 
            precio: producto.precio, 
            cantidad: 1 
        });
    }
    
    actualizarCarritoDOM();
    
    // Opcional: abre el carrito automáticamente al agregar algo
    const sidebar = document.getElementById('cart-sidebar');
    if(!sidebar.classList.contains('open')) {
        toggleCarrito();
    }
}

// Función para dibujar el carrito en la pantalla y sumar totales
function actualizarCarritoDOM() {
    const contenedorItems = document.getElementById('cart-items');
    const totalElemento = document.getElementById('cart-total');
    const contadorElemento = document.getElementById('cart-count');

    // Limpiamos el HTML previo
    contenedorItems.innerHTML = '';
    
    let total = 0;
    let cantidadTotal = 0;

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; color:#888;">Tu carrito está vacío.</p>';
    }

    // Recorremos el carrito y creamos el HTML para cada ítem
    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;

        contenedorItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)}</p>
                </div>
                <div class="cart-controls">
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    // Actualizamos el precio total y la burbuja del menú
    totalElemento.textContent = total.toFixed(2);
    contadorElemento.textContent = cantidadTotal;
}

// Función para sumar o restar cantidad desde el carrito
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    // Si la cantidad llega a 0, eliminamos el producto del carrito
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    actualizarCarritoDOM();
}

// Simular la compra
function comprar() {
    if(carrito.length === 0) {
        alert("Agrega unas ricas hamburguesas primero.");
        return;
    }
    
    const total = document.getElementById('cart-total').textContent;
    alert(`¡Gracias por tu compra! Tu total es $${total}. Tu pedido está en camino 🛵`);
    
    // Vaciar carrito
    carrito = [];
    actualizarCarritoDOM();
    toggleCarrito();
}

// Funciones extra que ya tenías definidas en tu HTML
function ordenar() {
    window.location.href = '#menu';
}

function enviarFormulario(event) {
    event.preventDefault();
    alert("¡Mensaje recibido! Nos comunicaremos contigo pronto.");
    event.target.reset(); // Limpia el formulario
}

// Inicializar visualmente el carrito vacío al cargar la página
actualizarCarritoDOM();
// Simular la compra con redirección a la página de pago
function comprar() {
    if(carrito.length === 0) {
        alert("Agrega unas ricas hamburguesas primero.");
        return;
    }
    
    // Obtenemos el total actual
    const total = document.getElementById('cart-total').textContent;
    
    // Elementos del modal
    const modal = document.getElementById('payment-modal');
    const barra = document.getElementById('progress-bar');
    const statusText = document.getElementById('payment-status');

    // Mostramos el modal
    modal.classList.remove('hidden');
    barra.style.width = '0%';
    statusText.textContent = "Preparando pasarela de pago...";

    // Simulamos el progreso
    let progreso = 0;
    const intervalo = setInterval(() => {
        progreso += 2;
        barra.style.width = progreso + '%';

        if (progreso === 50) {
            statusText.textContent = "Cargando entorno seguro...";
        } else if (progreso >= 100) {
            clearInterval(intervalo);
            statusText.textContent = "¡Redirigiendo! 🔒";

            setTimeout(() => {
                // 1. Guardamos el total en la memoria del navegador
                localStorage.setItem('totalBurgerHouse', total);
                
                // 2. Redirigimos a la nueva página de pago
                window.location.href = 'pago.html';
            }, 800); // Esperamos menos de un segundo y redirigimos
        }
    }, 30); // Un poco más rápido para no aburrir al usuario
}