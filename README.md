# Proyecto de Transacciones

Este proyecto es una aplicación web para gestionar transacciones, construida con React en el frontend y Spring Boot en el backend. La aplicación permite crear, editar y anular transacciones, así como visualizar un historial de transacciones recientes.

## Requisitos

- Node.js
- Docker
- Docker Compose

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/devarkoru/tenpo-pt-react.git
   cd tenpo-pt-docker

2. Instala las dependencias del frontend:
   npm install
   
4. Construye y levanta los contenedores Docker:
   docker-compose up --build
 Uso
La aplicación estará disponible en http://localhost:3000 y el backend en http://localhost:8080.

Endpoints del Backend

POST /transaction: Crear una nueva transacción.
POST /transactionEdit: Editar una transacción existente.
POST /transactionRefund: Anular una transacción.
GET /transactions: Obtener todas las transacciones.

Funcionalidades del Frontend
Crear Transacción: Permite crear una nueva transacción.
Editar Transacción: Permite editar una transacción existente.
Anular Transacción: Permite anular una transacción.
Historial de Transacciones: Muestra un historial de transacciones recientes.

Estructura del Proyecto
frontend: Contiene el código del frontend construido con React.
backend: Contiene el código del backend construido con Spring Boot.
docker-compose.yml: Archivo de configuración de Docker Compose.
Dockerfile.frontend: Dockerfile para construir la imagen del frontend.
Dockerfile.backend: Dockerfile para construir la imagen del backend.
nginx.conf: Configuración de Nginx para servir el frontend y reenviar solicitudes al backend.

Configuración de Nginx
El archivo nginx.conf está configurado para servir el frontend y reenviar las solicitudes al backend:
server {
    listen 80;

    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.


Este archivo `README.md` proporciona una descripción general del proyecto, los requisitos, las instrucciones de instalación y uso, la estructura del proyecto, la configuración de Nginx y la información sobre contribuciones y licencia. Puedes ajustarlo según sea necesario para adaptarlo a tu proyecto específico.
