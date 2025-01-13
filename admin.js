const ADMIN_PASSWORD = '1940';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    
    const adminPanel = document.getElementById('admin-panel');
    const productForm = document.getElementById('product-form');
    const productItems = document.getElementById('product-items');
    const addProductBtn = document.getElementById('add-product-btn');
    const viewProductsBtn = document.getElementById('view-products-btn');
    const deleteOldProductsBtn = document.getElementById('delete-old-products-btn');
    const addProductForm = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');
    const deleteOldProductsForm = document.getElementById('delete-old-products');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        if (password === ADMIN_PASSWORD) {
            document.getElementById('login-form').style.display = 'none';
            adminPanel.style.display = 'block';
        } else {
            showToast('Contraseña incorrecta', 'error');
        }
    });

    addProductBtn.addEventListener('click', () => {
        addProductForm.style.display = 'block';
        productList.style.display = 'none';
        deleteOldProductsForm.style.display = 'none';
        addProductBtn.classList.add('active');
        viewProductsBtn.classList.remove('active');
        deleteOldProductsBtn.classList.remove('active');
    });

    viewProductsBtn.addEventListener('click', () => {
        addProductForm.style.display = 'none';
        productList.style.display = 'block';
        deleteOldProductsForm.style.display = 'none';
        addProductBtn.classList.remove('active');
        viewProductsBtn.classList.add('active');
        deleteOldProductsBtn.classList.remove('active');
        loadProducts();
    });

    deleteOldProductsBtn.addEventListener('click', () => {
        addProductForm.style.display = 'none';
        productList.style.display = 'none';
        deleteOldProductsForm.style.display = 'block';
        addProductBtn.classList.remove('active');
        viewProductsBtn.classList.remove('active');
        deleteOldProductsBtn.classList.add('active');
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const categoria = document.getElementById('categoria').value;
        const subcategoria = document.getElementById('subcategoria').value;
        const descuento = document.getElementById('descuento').checked;
        const imagenInput = document.getElementById('imagen');
        const descripcion = document.getElementById('descripcion').value;

        if (imagenInput.files && imagenInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                const newProduct = {
                    id: Date.now(),
                    nombre,
                    precio: descuento ? precio * 0.9 : precio,
                    categoria,
                    subcategoria: subcategoria || undefined,
                    descripcion,
                    imagen: imageData,
                    descuento,
                    fechaCreacion: new Date().toISOString()
                };

                let productos = JSON.parse(localStorage.getItem('productos')) || [];
                productos.push(newProduct);
                localStorage.setItem('productos', JSON.stringify(productos));

                showToast('Producto añadido con éxito', 'success');
                productForm.reset();
                loadProducts();
            };
            reader.readAsDataURL(imagenInput.files[0]);
        } else {
            showToast('Por favor, seleccione una imagen para el producto.', 'error');
        }
    });

    function loadProducts() {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        productItems.innerHTML = '';
        productos.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}" onclick="openFullImage('${product.imagen}')">
                <div class="product-card-content">
                    <h3>${product.nombre}</h3>
                    <p>Precio: $${product.precio.toFixed(2)}</p>
                    <p>Categoría: ${product.categoria}</p>
                    ${product.subcategoria ? `<p>Subcategoría: ${product.subcategoria}</p>` : ''}
                    <p>Descripción: ${product.descripcion}</p>
                    ${product.descuento ? '<p>Descuento aplicado: 10%</p>' : ''}
                    <p>Fecha de creación: ${new Date(product.fechaCreacion).toLocaleDateString()}</p>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                </div>
            `;
            productItems.appendChild(productElement);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }

    function deleteProduct(productId) {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos = productos.filter(product => product.id !== productId);
        localStorage.setItem('productos', JSON.stringify(productos));
        loadProducts();
        showToast('Producto eliminado con éxito', 'success');
    }

    document.getElementById('confirm-delete').addEventListener('click', () => {
        const deleteDate = new Date(document.getElementById('delete-date').value);
        if (isNaN(deleteDate.getTime())) {
            showToast('Por favor, seleccione una fecha válida', 'error');
            return;
        }

        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        const initialCount = productos.length;
        productos = productos.filter(product => new Date(product.fechaCreacion) >= deleteDate);
        localStorage.setItem('productos', JSON.stringify(productos));

        const deletedCount = initialCount - productos.length;
        showToast(`Se han eliminado ${deletedCount} productos antiguos`, 'success');
        loadProducts();
    });
});

function openFullImage(src) {
    window.open(src, '_blank');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.style.backgroundColor = '#ff4136';
    } else if (type === 'success') {
        toast.style.backgroundColor = '#2ecc40';
    }

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

