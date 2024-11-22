import "./css/main.css";
import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { BrowserRouter } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import App from "./app.js";

const app = ReactDOMClient.createRoot(document.getElementById("app")); // Создаем путь, где будем выводить контент и указываем его как константу

app.render(
  // Заменить на реальный манифест
  <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Babitovec/Flame-React-v2.0/refs/heads/main/manifest.json">
    <Provider store={store}>
      <SkeletonTheme baseColor="#323232" highlightColor="#626262" borderRadius="25px">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SkeletonTheme>
    </Provider>
  </TonConnectUIProvider>
);
