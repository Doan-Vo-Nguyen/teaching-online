export function generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        if (i === 3) result += ' ';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
