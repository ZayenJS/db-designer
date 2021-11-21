import { combineReducers } from 'redux';
/* import your reducers here */
import template, { templateReducerState } from './reducer.template';
export interface State {
  template: templateReducerState;
};

const reducer = combineReducers({ template });

export default reducer;