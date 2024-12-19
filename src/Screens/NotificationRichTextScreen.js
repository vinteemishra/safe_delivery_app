import React, { Component } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { connect } from 'react-redux';

import ColorTheme from '../Constants/ColorTheme';
import RichText from '../Components/RichText';
import * as CONSTANTS from '../Constants/Constants';
import * as helpers from '../Utils/helpers';
import ListItem from '../Components/ListItem';
import { analytics } from '../Utils/analytics';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import RightHeaderButton from '../Components/RightHeaderButton';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: ColorTheme.TERTIARY
    },
});
class NotificationRichTextScreen extends Component {

    constructor(props) {
        super(props);
        console.log("NotificationRichTextScreen");
        console.log("constructor notificationRichText", props.navigation.state.params);
    }

    componentDidMount() {
        const { content } = this.props.navigation.state.params;
    }
    onOptionPressed(property) {
        const params = this.props.navigation.state.params;
        this.props.navigation.push('NotificationRichText', {
            title: property.description,
            content: property.content,
        })
    }

    render() {
        const { language } = this.props
        const { content, id, prefix } = this.props.navigation.state.params;
        console.log("render notificationRichTextscreen");
        if (typeof content == 'string') {
            return (
                <RichText language={language} content={content} />
            )
        } else {
            const menu = (content) ? content.map((item, index) => {
                if (id.includes('management-hypertension')) return <ListItem backgroundColor={this.assignColor(index)} key={index} onPress={() => this.onOptionPressed(item)}>{item.description}</ListItem>
                return <ListItem key={index} onPress={() => this.onOptionPressed(item)}>{item.description}</ListItem>
            }) : null;

            return (
                <ScrollView style={styles.mainContainer}
                    alwaysBounceVertical={false}>
                    <AnalyticsTracker eventType={prefix === "action-card" ? "actioncard" : prefix} eventData={this.state.id} />
                    {menu}
                </ScrollView>
            )
        }


    }
};


function mapStateToProps(state) {
    const { selectedLang, contentByLanguage } = state;
    const language = contentByLanguage[selectedLang]
    const { screen } = contentByLanguage[selectedLang]
    return { screen, language }
}

export default connect(mapStateToProps)(NotificationRichTextScreen);
