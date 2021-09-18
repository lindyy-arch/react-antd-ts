import React from 'react'
import ReactDom from 'react-dom';
import App from './src/components/app';
import { Provider } from 'react-redux';
import store from "./src/store";
import registerServiceWorker from './src/RegisterServiceWorker';


ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider> ,
    document.getElementById('root')
);
registerServiceWorker();
