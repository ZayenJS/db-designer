import { actionsTemplate } from '../actions';
import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import axios from 'axios';

export const templateMiddleware = (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => async (action: actionsTemplate.ActionTemplateActions) => {
  switch (action.type) {
    case actionsTemplate.RANDOM_EXAMPLE:
      // ...
      break
    default:
      next(action);
  }
};