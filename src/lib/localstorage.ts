export const manageLocalStorage = {
    get: (key: string): string | null => {
        try {
            const token = localStorage.getItem(key);
            return token ? JSON.parse(token) : null;
        } catch (error) {
            console.error('Error parsing stored token:', error);
            localStorage.removeItem(key);
            return null;
        }
    },
    
    set: (key: string, token: string): void => {
        try {
            localStorage.setItem(key, JSON.stringify(token));
        } catch (error) {
            console.error('Error storing token:', error);
        }
    },
    
    remove: (key: string): void => {
        localStorage.removeItem(key);
    }
};