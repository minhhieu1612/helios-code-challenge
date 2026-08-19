import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student CRUD REST API Documentation',
      version: '1.0.0',
      description: 'Production-ready Student CRUD backend service built with ExpressJS, TypeScript, and MongoDB for Helios Code Challenge Problem 5.',
      contact: {
        name: 'Developer Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
