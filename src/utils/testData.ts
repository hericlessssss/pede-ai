import { supabase } from '../lib/supabase';
import { products } from '../data/products';

const neighborhoods = [
  'Centro', 'Jardim América', 'Vila Nova', 'Santa Cruz',
  'Bela Vista', 'Jardim Europa', 'Vila Mariana', 'Moema'
];

const cities = ['São Paulo', 'Guarulhos', 'Campinas', 'Santos'];

const customerNames = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
  'Carlos Souza', 'Fernanda Lima', 'Ricardo Pereira', 'Juliana Alves',
  'Lucas Ferreira', 'Mariana Rodrigues', 'Bruno Santos', 'Camila Silva'
];

const streets = [
  'Rua das Flores', 'Avenida Brasil', 'Rua São João', 'Avenida Paulista',
  'Rua XV de Novembro', 'Rua do Comércio', 'Avenida das Palmeiras', 'Rua da Paz'
];

const notes = [
  'Por favor, não toque a campainha',
  'Entregar na portaria',
  'Apartamento fundos',
  'Casa com portão azul',
  'Deixar com o porteiro',
  '',
  'Sem cebola, por favor',
  'Molho extra à parte'
];

const paymentMethods = ['pix', 'cash', 'credit', 'debit'];
const orderStatus = ['pending', 'preparing', 'completed', 'cancelled'];

function generateRandomZipCode() {
  return `${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

function getRandomItems() {
  const numberOfItems = Math.floor(Math.random() * 5) + 1;
  const selectedProducts = [];
  
  for (let i = 0; i < numberOfItems; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      selectedProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity
      });
    }
  }
  
  return selectedProducts;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function calculateTotal(items: Array<{ price: number; quantity: number }>) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

async function generateOrder() {
  const items = getRandomItems();
  const total = calculateTotal(items);
  const paymentMethod = getRandomElement(paymentMethods);
  const changeFor = paymentMethod === 'cash' ? total + Math.floor(Math.random() * 50) + 10 : null;

  const orderData = {
    customer_name: getRandomElement(customerNames),
    street: getRandomElement(streets),
    neighborhood: getRandomElement(neighborhoods),
    city: getRandomElement(cities),
    zip_code: generateRandomZipCode(),
    complement: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 1000) + 1}` : '',
    notes: getRandomElement(notes),
    payment_method: paymentMethod,
    change_for: changeFor,
    total,
    items,
    status: getRandomElement(orderStatus),
    created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
  };

  const { error } = await supabase.from('orders').insert(orderData);
  if (error) {
    console.error('Error generating order:', error);
    return false;
  }
  return true;
}

export async function generateTestData(numberOfOrders: number = 20) {
  console.log(`Generating ${numberOfOrders} test orders...`);
  let successCount = 0;

  for (let i = 0; i < numberOfOrders; i++) {
    const success = await generateOrder();
    if (success) successCount++;
    // Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`Successfully generated ${successCount} orders`);
  return successCount;
}