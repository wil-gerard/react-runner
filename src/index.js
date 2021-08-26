import React from 'react';
import ReactDOM from 'react-dom';
import './globals.scss';
import Home from './views/home';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Home />, document.getElementById('root'));
);

serviceWorker.unregister();
