import { Connection, ConnectionConfig } from 'tedious';
import { Buffer } from 'buffer';


let config = {
    server: import.meta.env.VITE_AZURE_SQL_SERVER,
    authentication: {
        type: 'default',
        options: {
            userName: import.meta.env.VITE_USERNAME,
            password: import.meta.env.VITE_PASSWORD
        }
    },
    options: {
        database: import.meta.env.VITE_AZURE_SQL_DATABASE,
        encrypt: true // For Azure SQL, encryption is required
    }
};

export function checkConnection() {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);

        connection.on('connect', () => {
            console.log('Connection to SQL Server successful.');
            connection.close();
            resolve(true);
        });

        connection.on('error', (err) => {
            console.error('Error connecting to SQL Server:', err);
            reject(false);
        });

        connection.connect();
    });
}
