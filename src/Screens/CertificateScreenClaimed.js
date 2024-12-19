import React, { Component } from 'react';
import {
    View,
    ScrollView,
    ImageBackground,
    Dimensions,
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import { connect } from 'react-redux'
import * as helpers from '../Utils/helpers';
import FramedButton from '../Components/FramedButton';
import { openModal } from '../Actions/modalActions';

const { width } = Dimensions.get('window')
const monofont = Platform.OS === "ios" ? "Courier New" : "Minimal-Bold";

class CertificateScreenClaimed extends Component {

    constructor(props) {
        super(props);
        this.certificate = helpers.getContentByLanguageProperty(this.props.certificates, this.props.language)[0];
        this.state = {
            fetchError: '',
            certLayoutWidth: 0,
            ceryLayoutHeight: 0,
            fetching: false,
            fetchingDone: false,
        };
    }

    render() {
        let user = this.props.userProfiles[this.props.currentUser];
        if (!user || !user.profileCertificates) {
            return null;
        }
        const certIndex = this.props.navigation.state.params.certIndex;
        const cert = this.props.navigation.getParam("cert");
        const expireDate = this.props.navigation.getParam("expireDate");
        // console.log('render user', user)
        if (user.profileCertificates[certIndex].claimed) {
            return this.renderClaimed(cert, expireDate);
        }
    }

    onLayoutCert(event) {
        this.setState({
            certLayoutWidth: event.nativeEvent.layout.width,
            certLayoutHeight: event.nativeEvent.layout.height,
        });
    }

    getCertDates(user) {
        const certDates = [];
        const keys = Object.keys(user.profileCertificates);
        for (const k of keys) {
            if (user.profileCertificates[k].certDate > 0) {
                certDates.push(user.profileCertificates[k].certDate)
            }
        }

        return (
            certDates
        );
    }

    renderClaimed(cert, expireDate) {
        let user = this.props.userProfiles[this.props.currentUser];
        let cheated = !!user.cheatUsed;

        return (
            <View style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
                <ScrollView>
                    <ImageBackground style={{
                        height: width * 0.7,
                        width: width - 40,
                        margin: 20,
                        backgroundColor: ColorTheme.TERTIARY
                    }}
                        source={require('../../img/learning_icons/certificate.png')}
                        resizeMode='contain'
                        onLayout={(event) => this.onLayoutCert(event)}
                    >
                        <AppText style={{
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            // top: width * 0.7 * 3 / 5,
                            top: "29%",
                            // left: 35,
                            width: this.state.certLayoutWidth / 1.38,
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: 15,
                            fontFamily: monofont,
                            color: '#000',
                        }}>
                            {cert.uniqueId ? `ID#: ${cert.uniqueId}` : ""}
                        </AppText>
                    </ImageBackground>
                    <View>
                        <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.8, margin: 0, marginTop: 0, textAlign: 'center' }}>
                            {this.props.screen['lp:claimed_by'] ? this.props.screen['lp:claimed_by'] : 'claimed by:'}
                        </AppText>
                        <AppText style={{ margin: 0, marginTop: 10, textAlign: 'center', color: ColorTheme.PRIMARY }}>
                            {cert.name}
                        </AppText>
                        <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.9, margin: 0, marginTop: 0, textAlign: 'center' }}>
                            {cert.jobTitle}
                        </AppText>
                        <AppText style={{ fontWeight: '500', fontSize: ColorTheme.FONT_SIZE * 0.8, margin: 0, marginTop: 0, textAlign: 'center' }}>
                            {expireDate}
                        </AppText>
                        {cert.memberId && (
                            <React.Fragment>
                                <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.8, margin: 0, marginTop: 10, textAlign: 'center' }}>
                                    {this.props.screen['lp:member_id'] ? this.props.screen['lp:member_id'] : 'member id:'}
                                </AppText>
                                <AppText style={{ fontWeight: '500', fontSize: ColorTheme.FONT_SIZE * 0.8, margin: 0, marginTop: 0, textAlign: 'center' }}>
                                    {cert.memberId}
                                </AppText>
                            </React.Fragment>
                        )}
                        <AppText style={{ fontWeight: '500', fontSize: ColorTheme.FONT_SIZE * 0.8, margin: 0, marginTop: 10, textAlign: 'center', color: ColorTheme.PRIMARY }}>
                            {cheated == false ? null : '(cheat function has been used)'}
                        </AppText>
                    </View>
                    <View style={{}}>
                        <FramedButton label={this.props.screen['lp:share_certificate'] ? this.props.screen['lp:share_certificate'] : 'share certificate'} onPress={() => this.share(cert)} active={true} style={{ width: 265 }}></FramedButton>
                    </View>
                </ScrollView>
            </View>
        );
    }

    share(cert) {
        const modalProps = {
            name: cert.name,
            jobTitle: cert.jobTitle,
            uniqueId: cert.uniqueId,
            memberId: cert.memberId,
            userId: this.props.user.profileId,
        }
        if (this.props.selectedCountry == null || this.props.selectedCountry === "Unknown") {
            const selectCountryProps = {
                disableFloatingCloseButton: true,
                disableOnBackDropPress: true,
                onModalDidHide: () => { this.props.dispatch(openModal({ modalType: "SHARE_CERTIFICATE", modalProps })) }
            }
            this.props.dispatch(openModal({ modalType: "SELECT_COUNTRY", modalProps: selectCountryProps }));
        } else {

            this.props.dispatch(openModal({ modalType: "SHARE_CERTIFICATE", modalProps }));
        }
    }
};

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage, index, selectedMode, currentUser, userProfiles, selectedCountry } = state;
    const language = contentByLanguage[selectedLang];
    const { screen, notifications, certificates } = language;

    let user = null;
    if (currentUser.currentUser) {
        user = userProfiles[currentUser.currentUser];
    }
    return {
        certificates,
        selectedLang,
        selectedCountry,
        language,
        screen,
        notifications,
        index,
        selectedMode,
        currentUser: currentUser.currentUser,
        userProfiles,
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback),
        user
    };
}

export default connect(mapStateToProps)(CertificateScreenClaimed)

