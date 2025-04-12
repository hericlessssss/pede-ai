import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import type { Order } from '../types';

function Delivery() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            setOrders(currentOrders => [newOrder, ...currentOrders]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            setOrders(currentOrders =>
              currentOrders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId: string, deliveryStatus: Order['delivery_status']) => {
    try {
      const updates: Partial<Order> = {
        delivery_status: deliveryStatus,
      };

      if (deliveryStatus === 'in_transit' && !orders.find(o => o.id === orderId)?.estimated_delivery_time) {
        // Set estimated delivery time to 45 minutes from now if not set
        updates.estimated_delivery_time = new Date(Date.now() + 45 * 60000).toISOString();
      } else if (deliveryStatus === 'delivered') {
        updates.actual_delivery_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, ...updates }
          : order
      ));
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const getDeliveryStatusIcon = (status: Order['delivery_status']) => {
    switch (status) {
      case 'waiting':
        return <Clock className="w-5 h-5" />;
      case 'assigned':
        return <Package className="w-5 h-5" />;
      case 'in_transit':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getDeliveryStatusColor = (status: Order['delivery_status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-gray-100 text-gray-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Carregando entregas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Controle de Entregas</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{order.customer_name}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.created_at), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${getDeliveryStatusColor(order.delivery_status)}`}>
                    {getDeliveryStatusIcon(order.delivery_status)}
                    <span className="text-sm font-medium capitalize">
                      {order.delivery_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p>{order.street}</p>
                      <p>{order.neighborhood}, {order.city}</p>
                      {order.complement && <p className="text-gray-500">{order.complement}</p>}
                    </div>
                  </div>

                  {order.estimated_delivery_time && (
                    <div className="text-sm text-gray-600">
                      <strong>Previsão de entrega:</strong>{' '}
                      {format(new Date(order.estimated_delivery_time), "HH:mm", { locale: ptBR })}
                    </div>
                  )}
                </div>

                <div className="space-x-2">
                  {order.delivery_status === 'waiting' && (
                    <button
                      onClick={() => updateDeliveryStatus(order.id, 'assigned')}
                      className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-sm font-medium"
                    >
                      Atribuir Entregador
                    </button>
                  )}
                  {order.delivery_status === 'assigned' && (
                    <button
                      onClick={() => updateDeliveryStatus(order.id, 'in_transit')}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded text-sm font-medium"
                    >
                      Iniciar Entrega
                    </button>
                  )}
                  {order.delivery_status === 'in_transit' && (
                    <button
                      onClick={() => updateDeliveryStatus(order.id, 'delivered')}
                      className="bg-green-100 text-green-700 px-3 py-1.5 rounded text-sm font-medium"
                    >
                      Confirmar Entrega
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma entrega pendente</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Delivery;