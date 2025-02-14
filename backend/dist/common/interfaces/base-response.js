export function sendResponse(res, success, httpStatus, message, data, error) {
    const response = {
        success,
        message,
        data,
        error,
    };
    return res.status(httpStatus).send(response);
}
//# sourceMappingURL=base-response.js.map