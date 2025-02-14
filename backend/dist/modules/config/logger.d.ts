interface LogError {
    field: string;
    error: string;
}
export declare const Logger: {
    info: (message: string) => void;
    error: (message: unknown, errors?: LogError[]) => void;
};
export {};
