import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
}

export function ProductCard({ product, quantity, onAdd, onRemove }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-36 sm:h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-full text-xs sm:text-sm font-medium text-white shadow">
          {product.category}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 sm:mt-4 flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold text-red-600">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(product.price)}
          </span>
          <div className="flex items-center gap-2">
            {quantity > 0 ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(product.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Minus size={16} />
                </motion.button>
                <span className="w-8 text-center font-medium">{quantity}</span>
              </>
            ) : null}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onAdd(product)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            >
              <Plus size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}