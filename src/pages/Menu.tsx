import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShoppingBag, Search, MapPin, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { OrderForm } from '../components/OrderForm';
import { products } from '../data/products';
import { CartItem, OrderFormData, Product } from '../types';

function Menu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    street: '',
    neighborhood: '',
    city: '',
    zipCode: '',
    complement: '',
    notes: '',
    paymentMethod: 'pix'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['all', ...new Set(products.map(product => product.category))];
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      (searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleFormChange = (data: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const formatOrderMessage = () => {
  const items = cart.map(item => 
    `\n🥟 ${item.quantity}x ${item.name}\n💵 R$ ${(item.price * item.quantity).toFixed(2)}`
  ).join('');

  const change = formData.paymentMethod === 'cash' && formData.changeFor
    ? `\n💵 *Troco para:* R$ ${formData.changeFor.toFixed(2)}`
    : '';

  const paymentMethodTranslations = {
    'pix': 'PIX',
    'cash': 'Dinheiro',
    'credit': 'Cartão de Crédito',
    'debit': 'Cartão de Débito'
  };

  const paymentEmoji = {
    'pix': '💠',
    'cash': '💵',
    'credit': '💳',
    'debit': '💳'
  }[formData.paymentMethod];

  return encodeURIComponent(
    `🏪 *NOVO PEDIDO - PASTELARIA DO ZÉ* 🏪\n\n` +
    `📝 *RESUMO DO PEDIDO*${items}\n\n` +
    `💰 *Total a pagar:* R$ ${total.toFixed(2)}\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `👤 *DADOS DO CLIENTE*\n` +
    `*Nome:* ${formData.name}\n\n` +
    `📍 *ENDEREÇO DE ENTREGA*\n` +
    `*Rua:* ${formData.street}\n` +
    `*Bairro:* ${formData.neighborhood}\n` +
    `*Cidade:* ${formData.city}\n` +
    `*CEP:* ${formData.zipCode}\n` +
    `${formData.complement ? `*Complemento:* ${formData.complement}\n` : ''}` +
    `${formData.notes ? `\n📝 *OBSERVAÇÕES*\n${formData.notes}\n` : ''}\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `${paymentEmoji} *PAGAMENTO*\n` +
    `*Forma de pagamento:* ${paymentMethodTranslations[formData.paymentMethod]}${change}`
  );
};

  const handleSendOrder = () => {
    try {
      setIsSubmitting(true);
      const message = formatOrderMessage();
      window.open(`https://wa.me/5561994559078?text=${message}`, '_blank');

      setCart([]);
      setShowCart(false);
      setFormData({
        name: '',
        street: '',
        neighborhood: '',
        city: '',
        zipCode: '',
        complement: '',
        notes: '',
        paymentMethod: 'pix'
      });
    } catch (error) {
      console.error('Error sending order:', error);
      alert('Erro ao enviar o pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold">Pastelaria do Zé</h1>
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-white hover:bg-red-700 rounded-full transition-colors"
              >
                <ShoppingBag size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
            
            <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>Entrega em até 45 min</span>
              </div>
              <div className="hidden sm:block h-1 w-1 bg-white rounded-full"></div>
              <div className="text-yellow-400">Aberto agora</div>
            </div>
          </div>

          <div className="relative py-3 sm:py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Busque por pastéis ou ingredientes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-3 sm:py-4 flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          layout
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  quantity={cart.find(item => item.id === product.id)?.quantity || 0}
                  onAdd={handleAddToCart}
                  onRemove={handleRemoveFromCart}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Seu Pedido</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                    <p className="text-sm text-gray-400">Adicione itens para fazer seu pedido</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <OrderForm
                      formData={formData}
                      onChange={handleFormChange}
                      total={total}
                    />

                    <div className="mt-6 border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">Total do pedido</span>
                        <span className="text-2xl font-bold text-red-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(total)}
                        </span>
                      </div>

                      <button
                        onClick={handleSendOrder}
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Send size={20} />
                        {isSubmitting ? 'Enviando...' : 'Enviar pedido via WhatsApp'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Cart Button */}
      {cart.length > 0 && !showCart && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-30 md:hidden"
        >
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <span>{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(total)}
              </span>
              <ChevronRight size={20} />
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default Menu;