import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllTransactions } from '../services/api';

interface Transaction {
  id: number;
  trxMonto: number;
  trxGiroComercio: string;
  tenpista: string;
  trxFecha: string;
  trxTipo: string;
}

function TotalTransacciones() {
  const [searchId, setSearchId] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getAllTransactions,
  });

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((transaction: Transaction) => {
        const matchesId = searchId ? transaction.id.toString().includes(searchId) : true;
        const matchesDateRange =
          dateRange.start && dateRange.end
            ? new Date(transaction.trxFecha) >= new Date(dateRange.start) &&
              new Date(transaction.trxFecha) <= new Date(dateRange.end)
            : true;
        return matchesId && matchesDateRange;
      })
    : [];

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
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Total Transacciones</h2>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Buscador por ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Ingrese ID"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Filtro por rango de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de fecha
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de transacciones */}
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
              {filteredTransactions.map((transaction: Transaction) => (
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
  );
}

export default TotalTransacciones;