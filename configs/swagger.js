import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Deep Blue Bank API",
            version: "1.0.0",
            description: "API para la gestión completa de un sistema bancario",
            contact: {
                name: "Developers Team",
                email: "lxocoy-2023020@kinal.edu.gt"
            }
        },
        servers: [
            {
                url: "https://backenddbb.vercel.app/DBB/v1",
                description: "Servidor de Producción"
            },
            {
                url: "http://localhost:3000/DBB/v1",
                description: "Servidor de Desarrollo"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Token JWT obtenido del endpoint de login"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        "./src/accounts/accounts.routes.js",
        "./src/auth/auth.routes.js",
        "./src/exchange/exchange.routes.js",
        "./src/user/user.routes.js",
        "./src/movements/movements.routes.js",
        "./src/product/product.routes.js",
        "./src/report/report.routes.js"
    ]
};

const swaggerDocs = swaggerJSDoc(options);

// Configuración personalizada para Swagger UI
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Deep Blue Bank API Documentation",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
        filter: true,
        showRequestHeaders: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
    }
};

export { swaggerDocs, swaggerUi, swaggerOptions };