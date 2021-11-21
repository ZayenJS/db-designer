import { actionsTemplate } from '../actions';

export interface templateReducerState {}
const INITIAL_STATE: templateReducerState = {};

const reducer = (state: templateReducerState = INITIAL_STATE, action: actionsTemplate.ActionTemplateActions) : templateReducerState => {
  switch (action.type) {
    case actionsTemplate.RANDOM_EXAMPLE:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;