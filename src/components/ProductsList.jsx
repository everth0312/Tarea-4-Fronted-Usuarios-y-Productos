// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../config/sockets";
import ProductItem from "./ProductItem";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(""); // este me muestra el mensaje en pantalla

    useEffect(() => {
        const getProducts = async () => {
            const resp = await axios.get("http://localhost:8000/api/products");
            console.log(resp);
            setProducts(resp.data.data);
        };
        getProducts();

        socket.on("stock-updated", (updatedProduct) => {
            console.log("Inventario actualizado:", updatedProduct.message, updatedProduct.product); // se añade este console log

            if (!updatedProduct.product) {
                console.error("Error: Producto recibido es undefined");
                return;
            }

            setMessage(` ${updatedProduct.message} - Producto ID: ${updatedProduct.product.id}`); // guardo el mensaje

          setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === updatedProduct.product.id
                        ? { ...product, stock: updatedProduct.product.stock }
                        : product
                )
            ); // se añade esta actualización para escuchar los eventos del stock

            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
                setMessage("");
            }, 3000);
            
        });

// Escuchar advertencia de stock agotado
socket.on("stock-warning", (warning) => {
    alert(warning.message);
});

// Manejar errores y se añade el código desde aquí
socket.on("error", (error) => {
    setMessage(` ${error.message}`);
    setTimeout(() => setMessage(""), 3000);
});

return () => {
    socket.off("stock-updated");
    socket.off("stock-warning");
    socket.off("error");
};
}, []);

const handleUpdateStock = (productId) => {
console.log(" Reduciendo stock del producto:", productId);
socket.emit("update-stock", { productId });
};

return (
<div>
    <h2>Lista de Productos</h2>

    {/* Muestra mensaje en la pantalla */}
    {message && (
        <div style={{
            background: "#fffae6",
            padding: "10px",
            border: "1px solid #ffcc00",
            color: "#333",
            marginBottom: "10px"
        }}>
            {message}
        </div>
    )}

    {products?.map((product) => (
        <ProductItem
            key={product.id}
            product={product}
            onUpdateStock={handleUpdateStock}
        />
    ))}
</div>
);
};


export default ProductList;
