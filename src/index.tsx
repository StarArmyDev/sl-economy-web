import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "bootswatch/dist/darkly/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import React from "react";
import "./css/index.css";
import App from "./App";

const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql`,
    credentials: "same-origin", //includes
    cache: new InMemoryCache()
});

const container = document.getElementById("app");

const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);

reportWebVitals();
