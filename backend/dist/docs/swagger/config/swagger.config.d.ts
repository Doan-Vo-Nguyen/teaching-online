declare const options: {
    definition: {
        openapi: string;
        info: {
            title: string;
            version: string;
            description: string;
        };
        servers: {
            url: string;
        }[];
    };
    apis: string[];
};
export default options;
