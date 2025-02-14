const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: process.env.SWAGGER_TITLE || "Teaching Online API Documentation",
            version: process.env.SWAGGER_VERSION || "1.0.0",
            description: process.env.SWAGGER_DESCRIPTION || "Teaching Online API Documentation",
        },
        servers: [
            {
                url: process.env.SWAGGER_URL || "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/docs/swagger/*/*.yaml"],
};
export default options;
//# sourceMappingURL=swagger.config.js.map