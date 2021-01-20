import {Reducer, combineReducers} from 'redux';

// import flags from './flags';
// import project from './project';
// import dataset from './dataset';
// import labels from './labels';
// import new reducers here

const reducers = {
  // flags,
  // project,
  // dataset,
  // labels,
  // add new reducers here
};

type State<T> = {
  [K in keyof T]: T[K] extends Reducer<infer S, any> ? S : never;
};
export type LobeState = State<typeof reducers>;

const root = combineReducers(reducers);

export {root};
