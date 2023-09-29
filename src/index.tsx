import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CommonContextProvider } from "./Context/CommonContext";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-0xg7zi7tc21ikmvl.us.auth0.com"
      clientId="H97zQS21VNY5vIsW070wL1sKTxKijCZ9"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <CommonContextProvider>
        <App />
      </CommonContextProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
