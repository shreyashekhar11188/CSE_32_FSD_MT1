const express = require('express');
const app = express();

app.use(express.json());

let products = [
    {
        id: 301,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 799,
        quantity: 25,
        inStock: true
    },
    {
        id: 302,
        name: "Notebook",
        category: "Stationery",
        price: 60,
        quantity: 100,
        inStock: true
    },
    {
        id: 303,
        name: "USB Keyboard",
        category: "Electronics",
        price: 999,
        quantity: 0,
        inStock: false
    }
];

function validateProduct(data) {
    return (
        data &&
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.category === "string" &&
        data.category.trim() !== "" &&
        typeof data.price === "number" &&
        Number.isFinite(data.price) &&
        data.price >= 0 &&
        typeof data.quantity === "number" &&
        Number.isFinite(data.quantity) &&
        data.quantity >= 0 &&
        typeof data.inStock === "boolean"
    );
}
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

app.post('/api/products', (req, res) => {

    const data = req.body;

    if (!validateProduct(data)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    const newProduct = {
        id: Math.max(300, ...products.map(p => p.id)) + 1,
        name: data.name.trim(),
        category: data.category.trim(),
        price: data.price,
        quantity: data.quantity,
        inStock: data.inStock
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});
app.get('/api/products/filter', (req, res) => {

    const category = req.query.category;

    if (!category || category.trim() === "") {
        return res.status(400).json({
            message: "Category is required"
        });
    }

    const result = products.filter(p =>
        p.category.toLowerCase() === category.trim().toLowerCase()
    );

    res.status(200).json(result);
});
app.get('/api/products/:id', (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!Number.isInteger(id) || !product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json(product);
});
app.put('/api/products/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const data = req.body;

    if (!validateProduct(data)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    products[index] = {
        id: id,
        name: data.name.trim(),
        category: data.category.trim(),
        price: data.price,
        quantity: data.quantity,
        inStock: data.inStock
    };

    res.status(200).json(products[index]);
});
app.delete('/api/products/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});