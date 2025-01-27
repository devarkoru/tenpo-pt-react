import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Wallet, XCircle, Edit, LineChart, UserPlus } from 'lucide-react';
import { TenpistaProvider } from './context/TenpistaContext';
import Transaccion from './components/Transaccion';
import AnularTransaccion from './components/AnularTransaccion';
import EditarTransaccion from './components/EditarTransaccion';
import TotalTransacciones from './components/TotalTransacciones';
import CrearTenpista from './components/CrearTenpista';

function App() {
  return (
    <TenpistaProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">
              Sistema de Transacciones
            </h1>
            
            <Routes>
              <Route path="/" element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  <Link to="/crear-tenpista" 
                        className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <UserPlus className="w-8 h-8 text-green-600 group-hover:text-green-700" />
                    <span className="ml-4 text-xl font-semibold text-gray-700 group-hover:text-gray-900">Crear Tenpista</span>
                  </Link>

                  <Link to="/transaccion" 
                        className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <Wallet className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700" />
                    <span className="ml-4 text-xl font-semibold text-gray-700 group-hover:text-gray-900">Transacción</span>
                  </Link>

                  <Link to="/anular-transaccion"
                        className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <XCircle className="w-8 h-8 text-red-600 group-hover:text-red-700" />
                    <span className="ml-4 text-xl font-semibold text-gray-700 group-hover:text-gray-900">Anular Transacción</span>
                  </Link>

                  <Link to="/editar-transaccion"
                        className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <Edit className="w-8 h-8 text-green-600 group-hover:text-green-700" />
                    <span className="ml-4 text-xl font-semibold text-gray-700 group-hover:text-gray-900">Editar Transacción</span>
                  </Link>

                  <Link to="/total-transacciones"
                        className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <LineChart className="w-8 h-8 text-purple-600 group-hover:text-purple-700" />
                    <span className="ml-4 text-xl font-semibold text-gray-700 group-hover:text-gray-900">Total Transacciones</span>
                  </Link>
                </div>
              } />
              <Route path="/crear-tenpista" element={<CrearTenpista />} />
              <Route path="/transaccion" element={<Transaccion />} />
              <Route path="/anular-transaccion" element={<AnularTransaccion />} />
              <Route path="/editar-transaccion" element={<EditarTransaccion />} />
              <Route path="/total-transacciones" element={<TotalTransacciones />} />
            </Routes>
          </div>
        </div>
      </Router>
    </TenpistaProvider>
  );
}

export default App;