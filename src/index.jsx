// Application entrypoint.

// Load up the application styles
require("../styles/application.scss");

//object-assign polyfill
require('es6-object-assign/auto');

// Render the top-level React component
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(<App />, document.getElementById('react-root'));
