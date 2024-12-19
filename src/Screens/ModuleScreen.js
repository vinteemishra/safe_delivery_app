import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as CONSTANTS from '../Constants/Constants';
import ColorTheme from '../Constants/ColorTheme';
import VidButton from '../Components/VidButton';
import ModuleListItem from '../Components/ModuleListItem';
import * as helpers from '../Utils/helpers';

import { selectLearningModule } from '../Actions/actions';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import { openModal } from '../Actions/modalActions';

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ColorTheme.TERTIARY
  },
  itemList: {
    flexDirection: 'column',
    backgroundColor: ColorTheme.SECONDARY,
    marginBottom: 8,
    ...CONSTANTS.cardShadowStyle
  },
  cardStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor: 'gray'
  }
});

class ModuleScreen extends React.Component {
  static navigationOptions = {
    title: 'Module'
  };

  constructor(props) {
    super(props);
  }

  handleShowSafeAbortionDisclamer() {
    this.props.dispatch(
      openModal({
        modalType: 'SAFE_ABORTION_DISCLAMER',
        modalProps: {}
      })
    );
  }

  componentDidMount() {
    if (this.props.selectedModule.includes('safe-abortion')) {
      this.handleShowSafeAbortionDisclamer();
    }
  }

  render() {
    const {
      language,
      actionCards,
      procedures,
      screen,
      icon,
      images,
      selectedModule,
      learningPlatform
    } = this.props;
    let cardCounter = 0;
    let module_icon = helpers.getArrayItem(icon, images);
    let vid = (
      <VidButton icon={module_icon} onPress={() => this.goToVid(screen.videos)}>
        {screen.videos}
      </VidButton>
    );

    let ac =
      actionCards.length > 0 ? (
        <ModuleListItem
          icon={'menu_actioncards'}
          onPress={() => this.goToAc(actionCards, language)}
        >
          {screen.actioncards}
        </ModuleListItem>
      ) : null;

    if (actionCards.length > 0) cardCounter++;
    let pp =
      procedures.length > 0 ? (
        <ModuleListItem
          icon={'menu_procedures'}
          onPress={() => this.goToPp(procedures, language)}
        >
          {screen.procedures}
        </ModuleListItem>
      ) : null;
    if (procedures.length > 0) cardCounter++;
    let assets = null;
    if (this.props.currentUser.currentUser !== null && learningPlatform)
      assets = this.getLearningScreenAssets(
        this.props.learningModuleScore,
        this.props.screen
      );
    let lp = (
      <ModuleListItem
        icon={'menu_learning'}
        assets={assets}
        onPress={() =>
          this.goToLp(
            selectedModule,
            this.props.navigation.state.params.description,
            module_icon
          )
        }
      >
        {screen.learning ? screen.learning : 'Learning'}
      </ModuleListItem>
    );
    cardCounter++;
    return (
      <View style={styles.mainContainer} alwaysBounceVertical={false}>
        <AnalyticsTracker
          eventType='module'
          eventData={`:${this.props.selectedModule}:`}
        />
        {vid}
        <View style={[styles.itemList, { flex: cardCounter }]}>
          {ac}
          {pp}
          {lp}
        </View>
        <View style={{ flex: 3 - cardCounter }} />
      </View>
    );
  }

  goToLp(module, description, icon) {
    if (
      this.props.currentUser.currentUser !== null &&
      this.props.learningPlatform
    ) {
      this.props.dispatch(selectLearningModule(this.props.selectedModule));
      // this.props.navigation.navigate('LearningModuleScreen'), {
      this.props.navigation.navigate('LearningModuleScreen', {
        title: description,
        module,
        description,
        icon
      });
    } else {
      this.props.navigation.navigate('MyLearningHome');
    }
  }

  goToVid(title) {
    this.props.navigation.navigate('VideoChapterScreen', {
      title: title,
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });
  }

  goToAc(content, state) {
    this.props.navigation.navigate('CardOptionScreen', {
      content: content,
      contentType: 'actioncard',
      title: this.props.getTextFromCMS('actioncards', 'actioncards'),
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });
  }

  goToPp(content, state) {
    this.props.navigation.navigate('CardOptionScreen', {
      title: this.props.getTextFromCMS('procedures', 'procedures'),
      backButtonTitle: helpers.getBackText(this.props.screen.back),
      content: content,
      contentType: 'procedure'
    });
  }

  getLearningScreenAssets(learningModuleScore, screen) {
    let level;
    let stars;

    if (
      learningModuleScore == 1 ||
      learningModuleScore == 5 ||
      learningModuleScore == 9
    )
      stars = 'module_star_1';
    else if (
      learningModuleScore == 2 ||
      learningModuleScore == 6 ||
      learningModuleScore == 10
    )
      stars = 'module_star_2';
    else if (
      learningModuleScore == 3 ||
      learningModuleScore == 7 ||
      learningModuleScore == 11
    )
      stars = 'module_star_3';
    else stars = 'module_star_0';

    if (learningModuleScore < 4) {
      level = screen['lp:level_1'] ? screen['lp:level_1'] : 'familiar';
    } else if (learningModuleScore < 8) {
      level = screen['lp:level_2'] ? screen['lp:level_2'] : 'proficient';
    } else {
      //(learningModuleScore <= 11 )
      level = screen['lp:level_3'] ? screen['lp:level_3'] : 'expert';
    }
    return { level, stars };
  }
}

function mapStateToProps(state, props) {
  const {
    selectedLang,
    contentByLanguage,
    selectedModule,
    currentUser,
    userProfiles
  } = state;
  const { screen, images } = contentByLanguage[selectedLang];
  const { actionCards, procedures, icon } = contentByLanguage[selectedLang][
    selectedModule
  ] || { actionCards: [], procedures: [], icon: undefined };
  const language = contentByLanguage[selectedLang];

  let learningModuleScore =
    userProfiles[currentUser.currentUser] &&
    userProfiles[currentUser.currentUser].profileModuleScores &&
    selectedModule
      ? userProfiles[currentUser.currentUser].profileModuleScores[
          selectedModule
        ]
      : 0;

  const learningPlatform = contentByLanguage[selectedLang]['learningPlatform'];

  return {
    language,
    actionCards,
    procedures,
    screen,
    icon,
    images,
    selectedModule,
    currentUser,
    learningModuleScore,
    learningPlatform,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
}

export default connect(mapStateToProps)(ModuleScreen);
