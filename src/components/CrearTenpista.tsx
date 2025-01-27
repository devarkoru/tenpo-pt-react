import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenpista } from '../context/TenpistaContext';
import { createTenpista } from '../services/api';

function CrearTenpista() {
  const { addTenpista, tenpistas } = useTenpista();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nroCuenta: '',
  });
  const [error, setError] = useState<string>('');
  const queryClient = useQueryClient();

  const createTenpistaMutation = useMutation({
    mutationFn: createTenpista,
    onSuccess: (data) => {
      // Actualizar la caché local
      queryClient.invalidateQueries({ queryKey: ['tenpistas'] });
      
      // Actualizar el contexto local
      addTenpista({
        nombre: data.nombre,
        apellido: data.apellido,
        nroCuenta: data.nroCuenta,
      });
      
      // Limpiar el formulario
      setFormData({
        nombre: '',
        apellido: '',
        nroCuenta: '',
      });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Error al crear el tenpista');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que la cuenta no exista
    const existingAccount = tenpistas.find(t => t.nroCuenta === formData.nroCuenta);
    if (existingAccount) {
      setError('Este número de cuenta ya está registrado');
      return;
    }

    try {
      await createTenpistaMutation.mutateAsync(formData);
    } catch (err) {
      // El error ya se maneja en onError del mutation
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Crear Tenpista</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="nroCuenta" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Cuenta
          </label>
          <input
            type="text"
            id="nroCuenta"
            name="nroCuenta"
            value={formData.nroCuenta}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          disabled={createTenpistaMutation.isPending}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          {createTenpistaMutation.isPending ? 'Creando...' : 'Crear Tenpista'}
        </button>
      </form>

      {tenpistas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tenpistas Registrados</h3>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Cuenta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transacciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenpistas.map((tenpista) => (
                    <tr key={tenpista.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenpista.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenpista.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenpista.apellido}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenpista.nroCuenta}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenpista.transaccionesCount}/100</td>
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

export default CrearTenpista;