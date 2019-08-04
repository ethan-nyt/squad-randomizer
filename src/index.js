import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { names } from './constants';
import './index.css';

ReactDOM.render(
  <App defaultNames={names}/>,
  document.getElementById('root')
);
