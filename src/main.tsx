import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import '@css/index.css';

const client = new ApolloClient({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
    credentials: 'same-origin', //includes
    cache: new InMemoryCache(),
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
);
