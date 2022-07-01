import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";

/* Import tota11y if in dev mode */
if(import.meta.env.DEV) {
  // @ts-ignore
  await import("@khanacademy/tota11y")
}

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql.anilist.co/",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
