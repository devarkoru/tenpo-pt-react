import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTenpista } from '../context/TenpistaContext';
import { createTransaction, fetchTenpistas } from '../services/api';

interface Transaction {
  tenpista: ReactNode;
  id: number;
  trxMonto: number;
  trxGiroComercio: string;
  tenpistaId: number;
  tenpistaNombre: string;
  trxFecha: string;
}

interface Tenpista {
  id: number;
  nombre: string;
  apellido: string;
  nroCuenta: string;
}

function Transaccion() {
  const { updateTransaccionesCount } = useTenpista();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<Omit<Transaction, 'id' | 'trxFecha'>>({
    trxMonto: 0,
    trxGiroComercio: '',
    tenpistaId: 0,
    tenpistaNombre: '',
    tenpista: null
  });
  const [error, setError] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: tenpistas = [], isLoading, isError } = useQuery({ queryKey: ['tenpistas'], queryFn: fetchTenpistas });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Datos del formulario1:', JSON.stringify(data));
      console.log('Tenpista encontrado1:', data.tenpistaNombre);
      const transactionData = {
        ...data,
        trxFecha: new Date().toISOString(),
        tenpista: data.tenpistaNombre
      };
      return createTransaction(transactionData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      const tenpistaNombre = data.tenpistaNombre
      console.log('TenpistaNombre:', tenpistaNombre);
      setTransactions([...transactions, { ...data, id: data.id || transactions.length + 1, tenpistaNombre }]);
      setFormData({
        trxMonto: 0,
        trxGiroComercio: '',
        tenpistaId: 0,
        tenpistaNombre: '',
        tenpista: null
      });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Error al crear la transacción');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Datos del formulario:', formData);

    if (formData.trxMonto <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    const tenpista = await updateTransaccionesCount(formData.tenpistaId);
    if (!tenpista) {
      setError('El tenpista no existe o ha alcanzado el límite de 100 transacciones');
      return;
    }

    try {
      await createTransactionMutation.mutateAsync({ ...formData, tenpistaNombre: `${tenpista.nombre} ${tenpista.apellido}` });
    } catch (err) {
      // El error ya se maneja en onError del mutation
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver al inicio
      </Link>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Nueva Transacción</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="trxMonto" className="block text-sm font-medium text-gray-700 mb-1">
            Monto de transacción (CLP)
          </label>
          <input
            type="number"
            id="trxMonto"
            name="trxMonto"
            value={formData.trxMonto}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            min="1"
          />
        </div>

        <div>
          <label htmlFor="trxGiroComercio" className="block text-sm font-medium text-gray-700 mb-1">
            Giro o comercio
          </label>
          <input
            type="text"
            id="trxGiroComercio"
            name="trxGiroComercio"
            value={formData.trxGiroComercio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="tenpistaId" className="block text-sm font-medium text-gray-700 mb-1">
            Tenpista
          </label>
          <select
            id="tenpistaId"
            name="tenpistaId"
            value={formData.tenpistaId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Seleccione un Tenpista</option>
            {isLoading && <option>Cargando tenpistas...</option>}
            {isError && <option>Error al cargar tenpistas</option>}
            {Array.isArray(tenpistas) && tenpistas.map((tenpista: Tenpista) => (
              <option key={tenpista.id} value={tenpista.id}>
                {tenpista.nombre} {tenpista.apellido} - Cuenta: {tenpista.nroCuenta}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          disabled={createTransactionMutation.isPending}
        >
          <Save className="w-5 h-5 mr-2" />
          {createTransactionMutation.isPending ? 'Guardando...' : 'Guardar Transacción'}
        </button>
      </form>

      {transactions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Transacciones Recientes</h3>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comercio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenpista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(transactions) && transactions.map((transaction) => (
                    console.log('Transacciones:', JSON.stringify(transaction)),
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaccion;