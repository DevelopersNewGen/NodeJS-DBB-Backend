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
        }
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

const swaggerOptions = {
    customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 20px 0; }
        .swagger-ui .scheme-container { background: #fafafa; padding: 10px; }
    `,
    customSiteTitle: "Deep Blue Bank API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
        filter: true,
        showRequestHeaders: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        tryItOutEnabled: true
    },
    customCssUrl: "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css",
    customJs: [
        "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js",
        "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"
    ]
};

export { swaggerDocs, swaggerUi, swaggerOptions };