const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const uploadImage = multer({ storage: storage });

app.post('/api/add-product', uploadImage.single('imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ninguna imagen.');
    }

    const { nombre, precio, categoria, subcategoria } = req.body;
    const imagePath = `/images/${req.file.filename}`;

    const newProduct = {
        nombre,
        precio: parseFloat(precio),
        categoria,
        subcategoria: subcategoria || undefined,
        imagen: imagePath
    };

    let productos = [];
    try {
        const data = fs.readFileSync('productos.json', 'utf8');
        productos = JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo de productos:', err);
    }

    productos.push(newProduct);

    try {
        fs.writeFileSync('productos.json', JSON.stringify(productos, null, 2));
        res.status(200).json({ message: 'Producto añadido con éxito', product: newProduct });
    } catch (err) {
        console.error('Error al escribir en el archivo de productos:', err);
        res.status(500).send('Error al guardar el producto');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});