const ADMIN_PASSWORD = '1940';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const adminPanel = document.getElementById('admin-panel');
    const productForm = document.getElementById('product-form');
    const productItems = document.getElementById('product-items');
    const addProductBtn = document.getElementById('add-product-btn');
    const viewProductsBtn = document.getElementById('view-products-btn');
    const addProductForm = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        if (password === ADMIN_PASSWORD) {
            document.getElementById('login-form').style.display = 'none';
            adminPanel.style.display = 'block';
        } else {
            alert('Contraseña incorrecta');
        }
    });

    addProductBtn.addEventListener('click', () => {
        addProductForm.style.display = 'block';
        productList.style.display = 'none';
    });

    viewProductsBtn.addEventListener('click', () => {
        addProductForm.style.display = 'none';
        productList.style.display = 'block';
        loadProducts();
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const categoria = document.getElementById('categoria').value;
        const subcategoria = document.getElementById('subcategoria').value;
        const descuento = document.getElementById('descuento').checked;
        const imagenInput = document.getElementById('imagen');

        if (imagenInput.files && imagenInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                const imageName = `product_${Date.now()}.${imagenInput.files[0].name.split('.').pop()}`;
                
                // Simular guardado de imagen en public/images
                console.log(`Guardando imagen: public/images/${imageName}`);
                
                const newProduct = {
                    id: Date.now(),
                    nombre,
                    precio: descuento ? precio * 0.9 : precio,
                    categoria,
                    subcategoria: subcategoria || undefined,
                    imagen: `images/${imageName}`,
                    descuento
                };

                let productos = JSON.parse(localStorage.getItem('productos')) || [];
                productos.push(newProduct);
                localStorage.setItem('productos', JSON.stringify(productos));

                alert('Producto añadido con éxito');
                productForm.reset();
                loadProducts();
            };
            reader.readAsDataURL(imagenInput.files[0]);
        } else {
            alert('Por favor, seleccione una imagen para el producto.');
        }
    });

    function loadProducts() {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        productItems.innerHTML = '';
        productos.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>Precio: $${product.precio.toFixed(2)}</p>
                <p>Categoría: ${product.categoria}</p>
                ${product.subcategoria ? `<p>Subcategoría: ${product.subcategoria}</p>` : ''}
                ${product.descuento ? '<p>Descuento aplicado: 10%</p>' : ''}
                <button class="delete-btn" data-id="${product.id}">Eliminar</button>
            `;
            productItems.appendChild(productElement);
        });

        // Agregar event listeners a los botones de eliminar
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
    }
});