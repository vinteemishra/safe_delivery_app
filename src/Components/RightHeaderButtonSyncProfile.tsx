import * as React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { openModal } from "../Actions/modalActions";
import moment from "moment";

interface OwnProps {
    openModalType?: string;
}

interface PropsFromState {
    screen: string;
    syncProfilesReducer: any
}

interface PropsFromDispatch {
    openModal(modalType: string, modalProps?: object): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class RightHeaderButtonSyncProfile extends React.Component<Props> {

    handleDispatch() {
        this.props.openModal(this.props.openModalType);
    }

    render() {

        const { syncProfilesReducer } = this.props;

        const lastSaved = syncProfilesReducer.lastUpdateTimestamp ? moment(syncProfilesReducer.lastUpdateTimestamp) : 0;

        const fiveDaysFromLastSave = moment(lastSaved);
        fiveDaysFromLastSave.add(5, 'days');

        const neeedToSync = moment() >= fiveDaysFromLastSave;
        const icon = neeedToSync ? require("../../img/nav_icons/sync2.png") : require("../../img/nav_icons/sync1.png");

        return (
            <View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.handleDispatch()}>
                    {<Image source={icon} style={{ width: 30, height: 30, marginRight: 6, tintColor: neeedToSync ? "#F5A623" : "white" }} />}
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, any> = (state, props) => {

    const { selectedLang, contentByLanguage, syncProfilesReducer } = state;
    const { screen } = contentByLanguage[selectedLang];

    return {
        screen,
        syncProfilesReducer
    }
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (dispatch, props) => ({
    openModal: (modalType: any, modalProps?: any) => {
        dispatch(openModal({ modalType, modalProps }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RightHeaderButtonSyncProfile);