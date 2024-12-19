import actionCreatorFactory from "typescript-fsa";
import { } from "../Reducers/reducers";

const actionCreator = actionCreatorFactory("modalActions");

export const selectModule = actionCreator<string>("SELECT_MODULE");
export const selectLearningModule = actionCreator<string>("SELECT_LEARNING_MODULE");