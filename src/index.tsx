import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './sass/GlobalStyle/index';
import { store } from './state';
import { AppProvider as SidebarProvider }
  from "~/context/Sidebar/SidebarContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle>
      <Provider store={store}>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </Provider>
    </GlobalStyle>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
