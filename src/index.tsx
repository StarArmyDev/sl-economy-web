import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ReactDOM from "react-dom";
import React from "react";
import "bootswatch/dist/darkly/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import "./css/index.css";
import App from "./App";

const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql`,
    credentials: "same-origin", //includes
    cache: new InMemoryCache()
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
