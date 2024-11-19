const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal API",
            version: "1.0.0",
            description: "API documentation for the Job Portal project",
            contact: {
                name: "Your Name",
                email: "your-email@example.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"], // 경로에 따라 조정
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
