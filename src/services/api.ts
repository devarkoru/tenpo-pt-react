import axios from 'axios';

const localhostUrl = 'http://localhost:8080';
console.log('Backend URL localhost:', localhostUrl);
const api = axios.create({
  baseURL: localhostUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('Backend URL en api:', api.defaults.baseURL);

export const createTransaction = async (transactionData: {
    
    trxMonto: number;
    trxGiroComercio: string;
    tenpistaNombre: string;
    trxFecha: string;
    trxTipo?: string;
}) => {
    console.log ('Datos del formulario:' + JSON.stringify(transactionData));
    const response = await api.post('/transaction', {
        ...transactionData,
        tenpista: transactionData.tenpistaNombre,
        trxTipo: transactionData.trxTipo || 'Venta',
    });
    return response.data;
};


export const createTenpista = async (tenpistaData: {
    nombre: string;
    apellido: string;
    nroCuenta: string;
  }) => {
    console.log('Backend URL:', localhostUrl);
    const response = await api.post('/tenpista', tenpistaData);
    return response.data;
  };

export const fetchTenpistas = async () => {
    const response = await api.get('/tenpista');
    return response.data;
  };

  export const fetchTenpistaById = async (tenpistaId: number) => {
    const response = await api.get(`/tenpista/${tenpistaId}`);
    return response.data;
  };

  export const getAllTransactions = async () => {
    const response = await api.get('/transaction');
    return response.data;
  };

  export const editTransaction = async (transactionData: {
    id: number;
    trxMonto: number;
    trxGiroComercio: string;
    tenpista: string;
    trxFecha: string;
    trxTipo: string;
  }) => {
    console.log ('Datos del formulario:' + JSON.stringify(transactionData));
    const response = await api.post('/transactionEdit', {
      ...transactionData,
      id: 0,
      trxOriginalId: transactionData.id,
  });
  return response.data;
};

export const refundTransaction = async (transactionData: {
  id: number;
  trxMonto: number;
  trxGiroComercio: string;
  tenpista: string;
  trxFecha: string;
  trxTipo: string;
}) => {
  const response = await api.post('/transactionRefund', {
    ...transactionData,
    id: 0,
    trxOriginalId: transactionData.id,
});
return response.data;
};