import { checkConnection } from './database.js';

async function main() {
    const isConnected = await checkConnection();
    if (isConnected) {
        // Connection exists, proceed with other operations
    } else {
        // Handle connection error
    }
}

main();