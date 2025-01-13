function cargarProductos(productosAMostrar) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    
    productosAMostrar.forEach(producto => {
        const productoHTML = `
            <div class="product-card">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" onclick="openFullImage('${producto.imagen}')">
                <div class="product-info">
                    <div class="product-name">${producto.nombre}</div>
                    <div class="price-heart-container">
                        <div class="product-price">
                            ${producto.descuento 
                                ? `<span class="original-price">$${(producto.precio / 0.9).toFixed(2)}</span> `
                                : ''}
                            $${producto.precio.toFixed(2)}
                        </div>
                        <span class="heart-icon" onclick="toggleLike(this)">♡</span>
                    </div>
                    <div class="product-description">${producto.descripcion}</div>
                    <a href="https://wa.me/5353160585?text=Estoy%20interesado%20en%20comprar%20el%20producto%20${encodeURIComponent(producto.nombre)}" class="buy-button">Comprar</a>
                </div>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });
}

function openFullImage(src) {
    window.open(src, '_blank');
}

function filtrarProductos(categoria) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    console.log('Productos cargados:', productos);
    if (categoria === 'inicio') {
        return productos;  // Retorna todos los productos en lugar de solo los primeros 20
    } else {
        return productos.filter(producto => producto.categoria === categoria || producto.subcategoria === categoria);
    }
}

function handleNavClick(event) {
    event.preventDefault();
    const categoria = event.target.getAttribute('data-categoria');
    const productosFiltrados = filtrarProductos(categoria);
    cargarProductos(productosFiltrados);
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', handleNavClick);
});

function toggleLike(element) {
    element.classList.toggle('liked');
    element.textContent = element.classList.contains('liked') ? '♥' : '♡';
}

function buscarProductos() {
    const searchTerm = document.querySelector('.search-container input').value.toLowerCase();
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) || 
        producto.categoria.toLowerCase().includes(searchTerm)
    );
    cargarProductos(productosFiltrados);
}

document.querySelector('.search-container button').addEventListener('click', buscarProductos);
document.querySelector('.search-container input').addEventListener('input', buscarProductos);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cargando productos iniciales...');
    cargarProductos(filtrarProductos('inicio'));
});

