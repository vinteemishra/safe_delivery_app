import actionCreatorFactory from "typescript-fsa";
import { ModalType, ModalProps, ModalTypes } from "../Reducers/modalReducer";

const actionCreator = actionCreatorFactory("modalActions");

export const openModal = actionCreator<ModalTypes | { modalType: ModalType, modalProps?: ModalProps }>("OPEN_MODAL");
export const closeModal = actionCreator("CLOSE_MODAL");


// Specific to country
export const updateCountryAndClose = actionCreator<{ country: string }>("UPDATE_COUNTRY_AND_CLOSE");
export const openSetCountryModal = () => (openModal({
    modalType: "SELECT_COUNTRY", modalProps: {
        disableFloatingCloseButton: true,
        disableOnBackDropPress: true,
    }
}));