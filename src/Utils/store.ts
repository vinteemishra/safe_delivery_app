import createSagaMiddleware from "@redux-saga/core";
import { applyMiddleware, createStore } from "redux";
import rootReducer, { StoreState } from "../Reducers/reducers";
import { autoRehydrate } from "redux-persist";
import thunkMiddleware from "redux-thunk";
import { storeNotificationMiddleware } from "../Utils/notifications";
import { composeWithDevTools } from "redux-devtools-extension";
import rootSaga from "../Sagas/sagas";

const sagaMiddleware = createSagaMiddleware();
export const store = createStore<StoreState>(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware, thunkMiddleware, storeNotificationMiddleware), autoRehydrate()));

//Can only be run after middleware has been applied to the store
sagaMiddleware.run(rootSaga);