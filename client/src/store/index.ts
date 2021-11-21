import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';
import { templateMiddleware } from './middlewares';

const composeEnhancers = composeWithDevTools({ trace: true });
const enhancers = composeEnhancers(applyMiddleware(templateMiddleware /* your other middlewares... */));

const store = createStore(rootReducer, enhancers);

export default store;