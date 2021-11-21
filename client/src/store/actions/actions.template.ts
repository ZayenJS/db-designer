export const RANDOM_EXAMPLE = 'RANDOM_EXAMPLE';

interface RandomExampleAction {
  type: typeof RANDOM_EXAMPLE;
  payload: {};
}

export const randomExample = (payload: {}): RandomExampleAction => ({ type: RANDOM_EXAMPLE, payload });

export type ActionTemplateActions = RandomExampleAction; /* | SomeOtherAction | ... */