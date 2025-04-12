export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderFormData {
  name: string;
  street: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  complement: string;
  notes: string;
  paymentMethod: 'pix' | 'cash' | 'credit' | 'debit';
  changeFor?: number;
}

export interface Order {
  id: string;
  customer_name: string;
  street: string;
  neighborhood: string;
  city: string;
  zip_code: string;
  complement?: string;
  notes?: string;
  payment_method: string;
  change_for?: number;
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  delivery_status: 'waiting' | 'assigned' | 'in_transit' | 'delivered';
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  delivery_notes?: string;
  created_at: string;
}