import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            titulo: "Proyecto bimestal 3",
            version: "1.0.0",
            descripcion: "Api para la gestion de un banco",
            contacto:{
                nombre: "Developers",
                correo: "lxocoy-2023020@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "https://backenddbb.vercel.app/DBB/v1"
            }
        ]
    },
    apis:[
        "./src/accounts/accounts.routes.js",
        "./src/auth/auth.routes.js",
        "./src/exchange/exchange.routes.js",
        "./src/user/user.routes.js",
        "./src/movements/movements.routes.js",
        "./src/product/product.routes.js",
        "./src/report/report.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options);

export {swaggerDocs, swaggerUi}