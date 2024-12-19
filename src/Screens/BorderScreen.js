import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as helpers from '../Utils/helpers';
import * as CONSTANTS from '../Constants/Constants';
import ContentContainer from '../Components/ContentContainer';
import ColorTheme from '../Constants/ColorTheme';
import BorderType from '../Components/BorderType';
import AppText from '../Components/AppText';
import ListHeader from '../Components/ListHeader';
import { connect } from 'react-redux';
import AnalyticsTracker from '../Components/AnalyticsTracker';


class BorderScreen extends Component {
    constructor(props) {
        super(props);
        this.certificate = helpers.getContentByLanguageProperty(this.props.certificates, this.props.language)[0];
        this.state = {
            certLayoutWidth: 0,
            ceryLayoutHeight: 0,
        }
    }

    onLayoutCert(event) {
        this.setState({
            certLayoutWidth: event.nativeEvent.layout.width,
            certLayoutHeight: event.nativeEvent.layout.height,
        });
    }

    render() {
        const { getTextFromCMS } = this.props;

        const headerText = getTextFromCMS("lp:certificate_center_borders_hint_header", "earn a new certificate each year") + "\n";
        const bodyText = getTextFromCMS("lp:certificate_center_borders_hint_body", "you are never done learning and an expert delivere needs to allways keep updated on knowledge and skills. therefore we each year give you the change to retake the certidicate test and earn better certificates.");

        return (
            <ContentContainer>
                <AnalyticsTracker eventType="borders" eventData={`::`} />
                <ScrollView style={styles.card}>
                    <View style={styles.viewStyle}>
                        <View style={{ flexDirection: 'column', padding: 12, borderBottomWidth: 1, borderColor: ColorTheme.SEPARATOR, }}>
                            <AppText style={{ fontWeight: '500', fontSize: ColorTheme.FONT_SIZE * 1.25, textAlign: 'center' }}>
                                {headerText}
                            </AppText>
                            <AppText style={{ fontSize: ColorTheme.FONT_SIZE, textAlign: 'center' }}>
                                {bodyText}
                            </AppText>
                        </View>
                    </View>
                    <View style={{ backgroundColor: ColorTheme.TERTIARY, borderTopWidth: 0, borderBottomWidth: 1, borderColor: ColorTheme.SEPARATOR }}>
                        <ListHeader>{getTextFromCMS("lp:certificate_center_borders_list_header", "different certificates")}</ListHeader>
                    </View>
                    <View style={styles.viewStyle} >
                        <BorderType headerText={getTextFromCMS("lp:certificate_center_borders_1_champ_header", "new champion")} bodyText={getTextFromCMS("lp:certificate_center_borders_1_champ_body", "given to the first time certificate recepiants")} icon={("certificate")}></BorderType>
                        <BorderType headerText={getTextFromCMS("lp:certificate_center_borders_2_champ_header", "2 time champion")} bodyText={getTextFromCMS("lp:certificate_center_borders_2_champ_body", "for retaking the certificate")} icon={("certificate")}></BorderType>
                        <BorderType headerText={getTextFromCMS("lp:certificate_center_borders_3_champ_header", "3 time veteran champion")} bodyText={getTextFromCMS("lp:certificate_center_borders_2_champ_body", "for retaking the certificate")} icon={("certificate")}></BorderType>
                        <BorderType headerText={getTextFromCMS("lp:certificate_center_borders_4_champ_header", "4 time veteran champion")} bodyText={getTextFromCMS("lp:certificate_center_borders_2_champ_body", "for retaking the certificate")} icon={("certificate")}></BorderType>
                        <BorderType headerText={getTextFromCMS("lp:certificate_center_borders_5_champ_header", "5 time veteran champion")} bodyText={getTextFromCMS("lp:certificate_center_borders_5_champ_body", "the owner of this has completed the certificate 5 times or more")} icon={("certificate")}></BorderType>
                    </View>
                </ScrollView>
            </ContentContainer>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: ColorTheme.TERTIARY,
        borderWidth: 1,
        borderColor: ColorTheme.SEPARATOR,
    },
    viewStyle: {
        backgroundColor: ColorTheme.SECONDARY,
    }
})

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage } = state;
    const language = contentByLanguage[selectedLang];
    const { screen } = language

    return {
        selectedLang,
        language,
        screen,
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback)
    };
}

export default connect(mapStateToProps)(BorderScreen)
