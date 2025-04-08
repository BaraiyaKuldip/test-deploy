import React, { useState } from 'react';
import { AddToCartButton } from './AddToCartButton';
import { Money } from '@shopify/hydrogen';
import { useAside } from './Aside';

const QuickAddToCart = ({ product }) => {
  const { open } = useAside();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Get the available sizes for the selected color
  const availableSizes = selectedColor
    ? product.variants.nodes.filter(variant =>
        variant.selectedOptions.some(option => option.name === 'Color' && option.value === selectedColor)
      )
    : [];

  const handleAddToCart = (variantId) => {
    open('cart');
    // Add the selected variant to the cart
    // You can implement the logic to add the item to the cart here
  };

  return (
    <div className="quick-add-to-cart">
      <h3>{product.title}</h3>
      <div className="color-options">
        {product.options.find(option => option.name === 'Color').optionValues.map(color => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.value)}
            className={`color-option ${selectedColor === color.value ? 'active' : ''}`}
          >
            {color.value}
          </button>
        ))}
      </div>

      {selectedColor && (
        <div className="size-options">
          <h4>Available Sizes:</h4>
          {availableSizes.map(variant => (
            <AddToCartButton
              key={variant.id}
              disabled={!variant.availableForSale}
              onClick={() => handleAddToCart(variant.id)}
              lines={[{ merchandiseId: variant.id, quantity: 1 }]}
            >
              <span>{variant.selectedOptions.find(option => option.name === 'Size').value}</span>
              <span className="price">
                <Money data={variant.price} />
              </span>
            </AddToCartButton>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickAddToCart;