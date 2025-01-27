import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTransactions, editTransaction } from '../services/api';

interface Transaction {
  id: number;
  trxMonto: number;
  trxGiroComercio: string;
  tenpista: string;
  trxFecha: string;
  trxTipo: string;
}

function EditarTransaccion() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getAllTransactions,
    select: (data) => data.filter((t: Transaction) => t.trxTipo === 'Venta')
  });

  const editMutation = useMutation({
    mutationFn: editTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setEditingId(null);
      setEditAmount('');
    }
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.trxMonto.toString());
  };

  const handleSave = async (transaction: Transaction) => {
    const newAmount = parseInt(editAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('El monto debe ser un número positivo');
      return;
    }

    try {
      await editMutation.mutateAsync({
        ...transaction,
        trxMonto: newAmount,
        trxTipo: 'Editado'
      });
    } catch (error) {
      alert('Error al editar la transacción');
    }
  };

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
    <div className="max-w-6xl mx-auto p-4">
      <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver al inicio
      </Link>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Editar Transacciones</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        <div className="overflow-x-auto">
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
                    {editingId === transaction.id ? (
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      `$${transaction.trxMonto.toLocaleString('es-CL')}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.trxGiroComercio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.tenpista}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.trxFecha).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === transaction.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(transaction)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Guardar"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Cancelar"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EditarTransaccion;