import React from 'react';
import { OrderFormData } from '../types';
import { MapPin } from 'lucide-react';

interface OrderFormProps {
  formData: OrderFormData;
  onChange: (data: Partial<OrderFormData>) => void;
  total: number;
}

export function OrderForm({ formData, onChange, total }: OrderFormProps) {
  return (
    <div className="bg-white rounded-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-red-600" size={20} />
          <h3 className="text-lg font-semibold">Endereço de entrega</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => onChange({ street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
              placeholder="Nome da rua e número"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => onChange({ neighborhood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
                placeholder="Seu bairro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
                placeholder="Sua cidade"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => onChange({ zipCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
              placeholder="00000-000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
            <input
              type="text"
              value={formData.complement}
              onChange={(e) => onChange({ complement: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
              placeholder="Apto, bloco, referência (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
              rows={3}
              placeholder="Alguma observação para o pedido?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => onChange({ paymentMethod: e.target.value as OrderFormData['paymentMethod'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
            >
              <option value="pix">PIX</option>
              <option value="cash">Dinheiro</option>
              <option value="credit">Cartão de Crédito</option>
              <option value="debit">Cartão de Débito</option>
            </select>
          </div>

          {formData.paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Troco para quanto?</label>
              <input
                type="number"
                value={formData.changeFor || ''}
                onChange={(e) => onChange({ changeFor: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
                min={total}
                step="0.01"
                placeholder={`Valor mínimo: ${total.toFixed(2)}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}