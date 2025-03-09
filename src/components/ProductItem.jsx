import React from "react";

const ProductItem = ({ product, onUpdateStock }) => {
    return (
        <div
            style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
            }}
        >
            <h3>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <p>Existencia: {product.stock}</p>
            <button onClick={() => onUpdateStock(product.id)}>
                Reducir Existencia
            </button>
        </div>
    );
};

export default ProductItem;
