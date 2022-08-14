import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ForFlash from './States/ForFlash'
import GlobalState from './States/GlobalState'
import {BrowserRouter as Router} from 'react-router-dom'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Router>
  <GlobalState>
  <ForFlash>
    <App />
  </ForFlash>
  </GlobalState>
  </Router>
  // </React.StrictMode>
);