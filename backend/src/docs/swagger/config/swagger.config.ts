const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: process.env.SWAGGER_TITLE || "Teaching Online API Documentation",
        version: process.env.SWAGGER_VERSION || "1.0.0",
        description:
          process.env.SWAGGER_DESCRIPTION || "Teaching Online API Documentation",
      },
      servers: [
        {
          url: process.env.API_URL || "https://teaching-online-server.onrender.com/",
          description: "Production server",
        },
      ],
  },
  apis: [
    "./src/docs/swagger/common.schema.yaml",
    "./src/docs/swagger/entities/*.yaml"
  ],
};

export default options;