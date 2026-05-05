import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'API documentation for our task manager backend'
        },
        servers: [
            {
                url: process.env.NODE_ENV == "development" ? 'http://localhost:5000' : 'https://personal-finance-tracker-api-rv5k.onrender.com'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./backend/routes/*.js'] // Updated path to backend folder
};

export const swaggerSpec = swaggerJSDoc(options);
