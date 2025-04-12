import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  items: OrderItem[];
  notes: string;
  status: string;
  created_at: string;
}

function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders(currentOrders => [newOrder, ...currentOrders]);
          if (soundEnabled) {
            playNotificationSound();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrders(currentOrders =>
            currentOrders.map(order =>
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [soundEnabled]);

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(error => console.error('Error playing sound:', error));
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['pending', 'preparing', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Acesso não autorizado</div>
      </div>
    );
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{order.customer_name}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(order.created_at), "HH:mm", { locale: ptBR })}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="text-sm font-medium capitalize">{order.status}</span>
          </div>
        </div>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-2xl font-bold text-red-600 mr-3">
                {item.quantity}×
              </span>
              <span className="text-gray-900">{item.name}</span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Observações:</strong> {order.notes}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'preparing')}
              className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
            >
              Preparar
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'completed')}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Concluir
            </button>
          )}
          {order.status !== 'completed' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const KanbanColumn = ({ title, orders, bgColor }: { title: string; orders: Order[]; bgColor: string }) => (
    <div className={`flex-1 min-w-[300px] ${bgColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {title}
          <span className="bg-white bg-opacity-50 px-2 py-0.5 rounded-full text-sm">
            {orders.length}
          </span>
        </h2>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {orders.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-500">Nenhum pedido</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0 md:pt-16">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Cozinha</h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${
                soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={soundEnabled ? 'Desativar som' : 'Ativar som'}
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-4 overflow-x-auto">
        <div className="flex gap-4 min-w-[900px]">
          <KanbanColumn
            title="Pedidos Pendentes"
            orders={getOrdersByStatus('pending')}
            bgColor="bg-red-50"
          />
          <KanbanColumn
            title="Em Preparação"
            orders={getOrdersByStatus('preparing')}
            bgColor="bg-yellow-50"
          />
          <KanbanColumn
            title="Concluídos"
            orders={getOrdersByStatus('completed')}
            bgColor="bg-green-50"
          />
        </div>
      </div>
    </div>
  );
}

export default Kitchen;