import * as React from "react";
import { View, Image } from "react-native";
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';

interface OwnProps {
    fetchingErrorStatus: String;
    fetchingErrorHeader: String;
    profileName?: String;
    fetchingDoneHeader: String;
    fetchingDoneHeader2?: String;
    fetchingDoneBody?: String;
}

interface State {

}

class FetchingDoneBox extends React.Component<OwnProps, State> {
    constructor(props: OwnProps) {
        super(props);
    }

    private renderStatus() {

        const { fetchingErrorStatus, fetchingErrorHeader, profileName, fetchingDoneHeader, fetchingDoneHeader2, fetchingDoneBody } = this.props;

        const marginBottom = profileName === undefined && fetchingDoneBody === undefined ? 0 : 16;

        if (fetchingErrorStatus) {
            return (
                <View>
                    <AppText style={{ textAlign: 'center', fontSize: ColorTheme.FONT_SIZE * 1.2, marginTop: 12, marginLeft: 16, marginRight: 16, marginBottom: 16 }}>{fetchingErrorHeader}</AppText>
                    <AppText style={{ textAlign: 'center', margin: 16 }}>{fetchingErrorStatus}</AppText>
                </View>
            )
        }
        else {
            return (
                <View>
                    <AppText style={{ textAlign: 'center', fontSize: ColorTheme.FONT_SIZE * 1.2, marginLeft: 16, marginRight: 16, marginBottom: 16 }}>{fetchingDoneHeader}</AppText>
                    <Image source={require('../../img/learning_icons/success.png')} style={{ alignSelf: "center", width: 48, height: 36, marginBottom: marginBottom }} />
                    {profileName === undefined ? null : <AppText style={{ textAlign: 'center', marginLeft: 16, marginRight: 16, marginBottom: fetchingDoneBody === undefined ? 0 : 16 }}>{fetchingDoneHeader2}</AppText>}
                    {fetchingDoneBody === undefined ? null : <AppText style={{ textAlign: 'center', marginLeft: 16, marginRight: 16 }}>{fetchingDoneBody}</AppText>}
                </View>
            )
        }
    }

    public render() {
        return (
            <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 20, paddingBottom: 20, alignItems: 'center', backgroundColor: ColorTheme.SECONDARY, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.SECONDARY }}>
                {this.renderStatus()}
            </View>
        );
    }
}

export default FetchingDoneBox;