
// import React from 'react';
// import { render } from 'react-dom';
// import Popup from './components/Popup';
// render(<Popup />, document.querySelector('#popup'));

import './index-popup.css';

import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
import Popup from './components/extension/Popup';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
