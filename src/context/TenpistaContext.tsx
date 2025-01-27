import { createContext, useContext, useState, ReactNode } from 'react';
import { fetchTenpistaById } from '../services/api';

interface Tenpista {
  id: number;
  nombre: string;
  apellido: string;
  nroCuenta: string;
  transaccionesCount: number;
}

interface TenpistaProviderProps {
  children: ReactNode;
}

interface TenpistaContextProps {
  tenpistas: Tenpista[];
  addTenpista: (tenpista: Omit<Tenpista, 'id' | 'transaccionesCount'>) => void;
  updateTransaccionesCount: (tenpistaId: number) => Promise<Tenpista | null>;
  getTenpistaByFullName: (fullName: string) => Tenpista | undefined;
}

const TenpistaContext = createContext<TenpistaContextProps | undefined>(undefined);

export const useTenpista = () => {
  const context = useContext(TenpistaContext);
  if (!context) {
    throw new Error('useTenpista debe usarse dentro de un TenpistaProvider');
  }
  return context;
};

export const TenpistaProvider = ({ children }: TenpistaProviderProps) => {
  const [tenpistas, setTenpistas] = useState<Tenpista[]>([]);

  const addTenpista = (tenpista: Omit<Tenpista, 'id' | 'transaccionesCount'>) => {
    setTenpistas(prev => [...prev, {
      ...tenpista,
      id: prev.length + 1,
      transaccionesCount: 0,
    }]);
  };

  const updateTransaccionesCount = async (tenpistaId: number): Promise<Tenpista | null> => {
    console.log('ID del tenpista:', tenpistaId);

    try {
      const tenpista = await fetchTenpistaById(tenpistaId);
      console.log('Tenpista encontrado:', tenpista);
      if (!tenpista) {
        return null;
      }
      // Aquí puedes agregar la lógica para verificar el límite de transacciones
      return tenpista;
    } catch (error) {
      console.error('Error al buscar el tenpista:', error);
      return null;
    }
  };

  const getTenpistaByFullName = (fullName: string): Tenpista | undefined => {
    return tenpistas.find(t => `${t.nombre} ${t.apellido}` === fullName);
  };

  return (
    <TenpistaContext.Provider value={{ tenpistas, addTenpista, updateTransaccionesCount, getTenpistaByFullName }}>
      {children}
    </TenpistaContext.Provider>
  );
};
