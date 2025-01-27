import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllTransactions, refundTransaction } from '../services/api';

interface Transaction {
  id: number;
  trxMonto: number;
  trxGiroComercio: string;
  tenpista: string;
  trxFecha: string;
  trxTipo: string;
}

function AnularTransaccion() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getAllTransactions,
    select: (data) => data.filter((t: Transaction) => t.trxTipo === 'Venta')
  });

  const refundMutation = useMutation({
    mutationFn: refundTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSelectedId(null);
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error al cargar las transacciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver al inicio
      </Link>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Anular Transacción</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comercio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenpista</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction: Transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${transaction.trxMonto.toLocaleString('es-CL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.trxGiroComercio}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.tenpista}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(transaction.trxFecha).toLocaleString('es-CL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => setSelectedId(transaction.id)}
                >
                  Anular
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedId !== null && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Anulando Transacción {selectedId}</h3>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            onClick={() => {
              const transaction = transactions.find((t: { id: number; }) => t.id === selectedId);
              if (transaction) {
                refundMutation.mutate({
                  trxMonto: transaction.trxMonto,
                  trxGiroComercio: transaction.trxGiroComercio,
                  tenpista: transaction.tenpista,
                  trxFecha: transaction.trxFecha,
                  trxTipo: 'Anulado',
                  id: selectedId
                });
              }
            }}
          >
            Confirmar Anulación
          </button>
        </div>
      )}
    </div>
  );
}

export default AnularTransaccion;