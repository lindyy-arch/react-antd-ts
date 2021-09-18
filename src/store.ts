import { createStore } from "redux";
import rootReducer from './reducers/AllReducers';

let store = createStore(rootReducer);

export default store;