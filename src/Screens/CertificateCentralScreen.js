import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import {
  set11MonthNofification,
  setProfilePrepTestScore,
  addNewCertificate,
  _setPrepTestScore
} from '../Actions/actions';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import AppText from '../Components/AppText';
import FramedButton from '../Components/FramedButton';
import LearningModuleItem from '../Components/LearningModuleItem';
import UnlockCertificateHint from '../Components/UnlockCertificateHint';
import ColorTheme from '../Constants/ColorTheme';
import * as CONSTANTS from '../Constants/Constants';
import { analytics } from '../Utils/analytics';
import * as helpers from '../Utils/helpers';
import { getArrayItem } from '../Utils/helpers';
import { startQuiz, enterCertificateCentral } from '../Actions/learningActions';
import moment from 'moment';
import { CHEAT } from '../Config/config';
import { openModal } from '../Actions/modalActions';

class CertificateCentralScreen extends Component {
  constructor(props) {
    super(props);
    this.certificate = helpers.getContentByLanguageProperty(
      this.props.certificates,
      this.props.language
    )[0];
    this.state = {
      certLayoutWidth: 0,
      ceryLayoutHeight: 0,
      atZero: false,
      claimModalVisible: false,
      cheatTimeForPrepTest: 0
    };
  }

  componentDidMount() {
    this.props.dispatch(enterCertificateCentral());
  }

  onLayoutCert(event) {
    this.setState({
      certLayoutWidth: event.nativeEvent.layout.width,
      certLayoutHeight: event.nativeEvent.layout.height
    });
  }

  goToAboutTestScreen() {
    this.props.navigation.navigate('AboutCertificationTestScreen', {
      titleImage: require('../../img/sda_title.png'),
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });
  }

  goToCertificate(certIndex, cert) {
    let expireDate = 0;
    if (cert.certDate > 0) {
      //Calculate the expiredate of the selected certificate
      let _expireDate = moment(new Date(cert.certDate)).add(1, 'year');
      _expireDate.set('hour', 18);
      _expireDate.set('minute', 30);
      _expireDate.set('second', 0);
      expireDate = _expireDate.format('YYYY-MM-DD'); //Connot use the object of the _expireDate
    }

    this.props.navigation.navigate('CertificateScreenClaimed', {
      title: this.props.screen.certificate
        ? this.props.screen.certificate
        : 'Certificate',
      backButtonTitle: helpers.getBackText(this.props.screen.back),
      certIndex: certIndex,
      cert: cert,
      expireDate: expireDate
    });
  }

  goToCertificateTest() {
    this.props.navigation.navigate('CertIntro', {
      certId: 'certificate-2017_1503996242450',
      // title: this.props.screen.certificate ? this.props.screen.certificate : 'Certification test',
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });

    this.setState({ cheatTimeForPrepTest: 0 });
  }

  claim() {
    this.props.dispatch(
      openModal({
        modalType: 'CLAIM_CERTIFICATE',
        modalProps: {
          disableFloatingCloseButton: false,
          disableOnBackDropPress: false,
          user: this.props.user || undefined,
          certId: this.certificate.id
        }
      })
    );
  }

  cheatPrepTest() {
    const { language } = this.props;

    const modules =
      typeof language.modules !== 'undefined'
        ? language.modules.map((mod, index) => {
            let module = language[mod.id];

            if (typeof module == 'object') {
              this.props.dispatch(
                setProfilePrepTestScore(this.props.currentUser, mod.id, 11)
              );
            }
            return modules;
          })
        : null;

    this.props.dispatch(addNewCertificate(this.props.currentUser, 0, false)); //When the prep quiz i done then create a new certificate
  }

  renderCertButtons(isUnlocked) {
    const { getTextFromCMS } = this.props;

    return (
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <AnalyticsTracker eventType='certificateCentral' eventData={`::`} />
        {isUnlocked ? (
          <FramedButton
            label={getTextFromCMS(
              'lp:certificate_center_render_button_label_disable',
              'start exam'
            )}
            style={styles.buttonStyle}
            onPress={() => this.goToCertificateTest()}
          />
        ) : (
          <FramedButton
            activeOpacity={1}
            disabled={true}
            label={getTextFromCMS(
              'lp:certificate_center_render_button_label_disable',
              'start exam'
            )}
            icon={'lock_alt'}
            style={styles.buttonStyle}
            onPress={() => this.goToCertificateTest()}
          />
        )}
        {!isUnlocked ? (
          <TouchableOpacity onPress={() => this.goToAboutTestScreen()}>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <AppText
                style={{
                  color: this.props.color
                    ? this.props.color
                    : this.props.disabled
                    ? ColorTheme.DISABLED
                    : ColorTheme.PRIMARY
                }}
              >
                {getTextFromCMS(
                  'lp:certificate_center_render_button_label_about',
                  'about the exam'
                )}
              </AppText>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  renderUnclaimedCertificates(score) {
    const { getTextFromCMS, user } = this.props;

    let certId = this.certificate.id;

    let headerText = getTextFromCMS(
      'lp:certificate_center_unclaimed_header',
      'safe delivery champion!'
    );
    let correntAnswerInProcentage =
      Math.round(score) +
      '% ' +
      getTextFromCMS('lp:certificate_center_hint_correct', 'correct');

    return (
      <View style={[{}]}>
        <View
          style={[
            styles.viewStyle,
            {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20
            }
          ]}
        >
          <AppText
            style={{ fontWeight: '500', fontSize: ColorTheme.FONT_SIZE * 1.25 }}
          >
            {headerText}
          </AppText>
          <AppText
            style={{
              color: ColorTheme.PRIMARY,
              fontSize: ColorTheme.FONT_SIZE,
              marginTop: 12
            }}
          >
            {correntAnswerInProcentage}
          </AppText>
          <Image
            source={require('../../img/learning_icons/certificate.png')}
            style={[
              styles.imageStyle,
              { resizeMode: 'contain', marginBottom: 20, marginTop: 12 }
            ]}
          />
          <FramedButton
            label={getTextFromCMS('next', 'next')}
            style={[styles.buttonStyle, { marginBottom: 20 }]}
            onPress={() => this.claim()}
          />
        </View>
        {user.profileCertificates.length > 1 ? (
          <View style={{ marginTop: 8 }}>
            {this.renderEarnedCertificates(user.profileCertificates, true)}
          </View>
        ) : null}
      </View>
    );
  }

  getCertDates(user) {
    const certDates = [];
    const keys = Object.keys(user.profileCertificates);
    for (const k of keys) {
      if (user.profileCertificates[k].certDate > 0) {
        certDates.push(user.profileCertificates[k].certDate);
      }
    }

    return certDates;
  }

  renderEarnedCertificates(profileCertificates, stillUnclaimed) {
    const { getTextFromCMS, user, language, screen } = this.props;

    const lastCertEntry = profileCertificates
      ? profileCertificates.length - 1
      : -1;

    let headerText = '';

    let listHeaderText = getTextFromCMS(
      'lp:certificate_center_render_list_header_text',
      'earned certificates'
    );

    headerText = getTextFromCMS(
      'lp:certificate_center_earned_header',
      'safe delivery champion'
    );

    const eranedProfileCerts = [...profileCertificates];

    //Remove the first entry of the eranedProfileCerts array, if you are on the unclaimed screen. Otherwise it will show a certificate with no certDate on it, becourse it is not claimed yet
    if (stillUnclaimed) {
      eranedProfileCerts.splice(-1, 1);
    }

    const eranedCert = eranedProfileCerts.reverse().map((cert, index) => {
      let bodyText = '';
      let expireDate = 0;
      let _expireDate = 0;

      if (user.profileCertificates[index].certDate != null) {
        _expireDate = moment(new Date(cert.certDate)).add(1, 'year');
        _expireDate.set('hour', 18);
        _expireDate.set('minute', 30);
        _expireDate.set('second', 0);
        expireDate = _expireDate.format('YYYY-MM-DD'); //Save the string from the _expireDate and not the _expireDate object
      }
      if (_expireDate.valueOf() <= new Date().getTime()) {
        bodyText = getTextFromCMS(
          'lp:certificate_center_earned_body_1',
          'expired'
        );
      } else {
        bodyText =
          getTextFromCMS('lp:certificate_center_earned_body', 'valid until') +
          ' ' +
          expireDate;
      }
      return (
        <View key={index}>
          <TouchableOpacity onPress={() => this.goToCertificate(index, cert)}>
            <View
              style={{
                minHeight: 130,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                borderTopWidth: index === 0 ? 0 : 1,
                borderColor: ColorTheme.SEPARATOR
              }}
            >
              <View
                style={{ flex: 1, flexDirection: 'column', marginLeft: 12 }}
              >
                <AppText style={{ marginBottom: 4 }}>{headerText}</AppText>
                <AppText style={{ color: ColorTheme.PRIMARY }}>
                  {bodyText}
                </AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../img/learning_icons/certificate.png')}
                  style={[styles.imageStyle, { marginRight: 12 }]}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View style={[{ flexDirection: 'column' }]}>
        <AppText
          style={{
            fontWeight: '400',
            fontSize: 14,
            marginLeft: 12,
            marginBottom: 12,
            marginTop: 20
          }}
        >
          {listHeaderText}
        </AppText>
        <View style={styles.viewStyle}>{eranedCert}</View>
      </View>
    );
  }

  renderEarnedCertTopSection(isClaimed, claimedDate) {
    const { getTextFromCMS } = this.props;

    let headerText = getTextFromCMS(
      'lp:certificate_center_what_now_header',
      'safe Delivery Champion'
    );
    let bodyText = getTextFromCMS(
      'lp:certificate_center_what_now_body',
      'congratulation. you are a certified user of the Safe Delivery App!\n'
    );
    let bodyText1 = getTextFromCMS(
      'lp:certificate_center_what_now_body_1',
      'you current certificate is valid until\n'
    );
    let expireDate = 0;

    if (claimedDate != null) {
      let _expireDate = moment(new Date(claimedDate)).add(1, 'year');
      _expireDate.set('hour', 18);
      _expireDate.set('minute', 30);
      _expireDate.set('second', 0);
      expireDate = _expireDate.format('YYYY-MM-DD'); //Save the string from the _expireDate and not the _expireDate object
    }

    if (isClaimed == true) {
      return (
        <View style={[styles.viewStyle, { paddingTop: 20 }]}>
          <View style={{ flexDirection: 'column', margin: 12, marginTop: 0 }}>
            <AppText
              style={{
                marginBottom: 20,
                textAlign: 'center',
                fontWeight: '500',
                fontSize: ColorTheme.FONT_SIZE * 1.25
              }}
            >
              {headerText}
            </AppText>
            <AppText
              style={{ textAlign: 'center', fontSize: ColorTheme.FONT_SIZE }}
            >
              {bodyText}
            </AppText>
            <AppText
              style={{ textAlign: 'center', fontSize: ColorTheme.FONT_SIZE }}
            >
              {bodyText1}
            </AppText>
            <AppText
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: ColorTheme.FONT_SIZE
              }}
            >
              {expireDate}
            </AppText>
            {CHEAT && this.state.cheatTimeForPrepTest === 0 ? (
              <FramedButton
                label={'Set time to prep test'}
                style={styles.buttonStyle}
                onPress={() =>
                  this.props.dispatch(
                    set11MonthNofification(),
                    this.setState({
                      cheatTimeForPrepTest: new Date().getTime()
                    })
                  )
                }
              />
            ) : null}
          </View>
        </View>
      );
    }
  }

  getCertInfo() {
    const { user } = this.props;

    let unlocked = false;
    let passed = false;
    let claimed = false;

    const lastCertEntry =
      user && user.profileCertificates
        ? user.profileCertificates.length - 1
        : -1;
    const latestCert = user.profileCertificates[lastCertEntry];

    if (user && latestCert) {
      unlocked = latestCert.unlockTimestamp > 0 ? true : false;
      passed = latestCert.passed;
      claimed = latestCert.claimed;
    }

    return { unlocked, claimed, passed };
  }

  renderModulePrepTest(secondAndBeyound) {
    const { language, selectedLang, user } = this.props;

    if (!Array.isArray(language.modules)) {
      return null;
    }

    const filteredModules = language.modules.filter((m) =>
      helpers.checkIfModuleContainsEssentialQuestion(m.id, language)
    );
    const lastCertEntry =
      this.props.user && this.props.user.profileCertificates
        ? this.props.user.profileCertificates.length - 1
        : -1;
    const secondLastCertEntry =
      this.props.user && this.props.user.profileCertificates && secondAndBeyound
        ? this.props.user.profileCertificates.length - 2
        : -2;

    const entry = secondAndBeyound ? secondLastCertEntry : lastCertEntry;

    const modules = filteredModules.map((mod, index) => {
      let module = language[mod.id];
      let images = language.images;
      let score = user.profileCertificates[entry].profilePrepTestScores[mod.id]
        ? user.profileCertificates[entry].profilePrepTestScores[mod.id]
        : 0;
      if (typeof module == 'object') {
        let icon = getArrayItem(module.icon, images);
        return (
          <LearningModuleItem
            key={index}
            preparePrepQuiz={true}
            lang={selectedLang}
            icon={icon}
            score={score}
            screen={language.screen}
            style={{ borderTopWidth: index === 0 ? 0 : 1 }}
            onPress={() =>
              this.goToLearningTest(mod.id, module.description, icon, score)
            }
          >
            {module.description}
          </LearningModuleItem>
        );
      } else {
        return null;
      }
    });
    return modules;
  }

  goToLearningTest(module, description, icon, prepTestScore) {
    const level = 3;

    if (prepTestScore === 11) {
      this.props.navigation.navigate('LearningModuleScreen', {
        title: description + ' ', // + (this.props.screen['lp:test'] ? this.props.screen['lp:test'] : 'test'),
        module: module,
        description: description,
        icon: icon,
        preparePrepQuiz: true,
        prepTestScore: prepTestScore
      });
    } else {
      this.props.startPrepTest(level.toString(), module),
        this.props.navigation.navigate('QuizTest', {
          title: description,
          preparePrepQuiz: true,
          icon: icon
        });
    }
  }

  renderCertificateHint(
    retakeDate,
    unlocked,
    claimed,
    passed,
    lastCertEntry,
    prepTestDone
  ) {
    const { user, getTextFromCMS, language } = this.props;

    let certiHintHeader;
    let certiHintBody;
    let disableButton;

    const hintItem = language.modules[0];
    const hasAtLeastOnePreviousCertificate =
      user.profileCertificates.length > 1;
    let module = language[hintItem.id];
    let images = language.images;
    let icon = helpers.getArrayItem(module.icon, images);

    if (
      unlocked == true &&
      claimed == false &&
      passed == false &&
      user.profileCertificates.length === 1
    ) {
      certiHintHeader = getTextFromCMS(
        'lp:certificate_center_hint_header_unlocked',
        'certification exam unlocked!\n'
      );
      certiHintBody = getTextFromCMS(
        'lp:certificate_center_hint_body_unlocked',
        'you can now take the certification exam. good luck!'
      );
      disableButton = false;
    } else if (
      new Date().getTime() >= retakeDate.valueOf() &&
      unlocked == true &&
      claimed == false &&
      passed == false &&
      hasAtLeastOnePreviousCertificate
    ) {
      certiHintHeader = getTextFromCMS(
        'lp:certificate_center_hint_header_unlocked',
        'certification exam unlocked!\n'
      );
      certiHintBody = getTextFromCMS(
        'lp:certificate_center_hint_body_unlocked',
        'you can now take the certification exam. Good luck!'
      );
      disableButton = false;
    } else if (
      claimed === true &&
      new Date().getTime() >= retakeDate.valueOf()
    ) {
      certiHintHeader = getTextFromCMS(
        'lp:certificate_expired_header',
        'certificate has expired'
      );
      certiHintBody = getTextFromCMS(
        'lp:certificate_expired_body',
        'you need to take the prep test below, and get all the answers korrect before you can retake the certificate exam'
      );
      disableButton = true;
    } else if (unlocked == false && claimed == false && passed == false) {
      certiHintHeader = getTextFromCMS(
        'lp:certificate_center_hint_header_locked',
        'unlock certification exam'
      );
      certiHintBody = getTextFromCMS(
        'lp:certificate_center_hint_body_locked',
        'you need to become an expert in all modules to unlock the certification exam'
      );
      disableButton = true;
    } else {
      return null;
    }

    return (
      <View style={styles.viewStyle}>
        <UnlockCertificateHint
          headerText={certiHintHeader}
          bodyText={certiHintBody}
          icon={!disableButton ? 'lock_open' : 'lock_alt'}
          style={{ borderWidth: 0 }}
        >
          {unlocked ? null : (
            <LearningModuleItem
              activeOpacity={1}
              score={11}
              icon={icon}
              screen={this.props.language.screen}
              style={{
                marginLeft: 20,
                marginRight: 20,
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 6,
                marginTop: 12,
                ...CONSTANTS.cardShadowStyle,
                borderColor: '#ddd'
              }}
            >
              {module.description}
            </LearningModuleItem>
          )}
        </UnlockCertificateHint>
        {this.renderCertButtons(!disableButton)}
        {CHEAT && (lastCertEntry >= 0 && prepTestDone === false && passed) ? (
          <FramedButton
            label={'Cheat PrepTest'}
            style={styles.buttonStyle}
            onPress={() => this.cheatPrepTest()}
          />
        ) : null}
      </View>
    );
  }

  renderPrepScoreCard(user, retakeDate) {
    const { unlocked, passed, claimed } = this.getCertInfo();

    let prepTestHeader = this.props.getTextFromCMS(
      'lp:prep_test_header',
      'preparation test modules'
    );
    let renderModulePrepTest;

    if (
      new Date().getTime() >= retakeDate.valueOf() &&
      unlocked == true &&
      claimed == false &&
      passed == false &&
      user.profileCertificates.length >= 2
    ) {
      renderModulePrepTest = true;
    } else if (
      claimed === true &&
      new Date().getTime() >= retakeDate.valueOf()
    ) {
      renderModulePrepTest = false;
    }

    return (
      <View style={[{}]}>
        <AppText
          style={{
            fontWeight: '400',
            fontSize: 14,
            marginLeft: 12,
            marginBottom: 12,
            marginTop: 20
          }}
        >
          {prepTestHeader}
        </AppText>
        <View style={[styles.viewStyle, {}]}>
          {this.renderModulePrepTest(renderModulePrepTest)}
        </View>
      </View>
    );
  }

  render() {
    const { user, modules } = this.props;
    if (!user) {
      return null;
    }

    const { unlocked, passed, claimed } = this.getCertInfo();

    const today = new Date();
    const tomorrow = new Date();
    const yesterday = new Date();
    tomorrow.setDate(today.getDate() + 1);
    yesterday.setDate(today.getDate() - 1);
    const lastCertEntry =
      this.props.user && user.profileCertificates
        ? user.profileCertificates.length - 1
        : -1;
    const latestCert = user.profileCertificates[lastCertEntry];

    let retakeDate = 0;
    if (user) {
      if (latestCert) {
        if (latestCert.certDate) {
          //Set teh retake test for the latest certificate
          retakeDate = moment(new Date(latestCert.certDate)).add(11, 'month');
          retakeDate.set('hour', 18);
          retakeDate.set('minute', 30);
          retakeDate.set('second', 0);
        }
      }
    }

    const learningModuleScore =
      lastCertEntry >= 0
        ? user.profileCertificates[lastCertEntry].profilePrepTestScores
        : {};

    const prepTestScore = helpers.getTotalScoreFromStore(
      modules,
      learningModuleScore
    );
    const prepTestDone = prepTestScore < 100 ? false : true;

    //For testing purpose, so the user can set the prepTest time to Date().getTime()
    {
      CHEAT
        ? (retakeDate =
            this.state.cheatTimeForPrepTest === 0
              ? retakeDate
              : this.state.cheatTimeForPrepTest)
        : null;
    }

    const shouldRetakeExam = new Date().getTime() >= retakeDate.valueOf();

    const hasAtLeastOnePreviousCertificate =
      user.profileCertificates.length > 1;
    //Check if it is time to rekate the certificate
    let certificateClaimedAndNoNewCertificateAvaliable =
      claimed === true && !shouldRetakeExam;
    //Check if the certificate is claimed
    let certIsUnclaimed = passed === true && claimed === false ? true : false;
    //Check if the latest certificate is the second or beyond
    // let secondAndBeyoundCertificate = (new Date().getTime() >= retakeDate.valueOf() && claimed == false && passed == false && user.profileCertificates.length >= 2) || (claimed === true && new Date().getTime() >= retakeDate.valueOf()) ? true : false;
    const hasNewCertificateUnlockedButNotPassed =
      shouldRetakeExam &&
      claimed == false &&
      passed == false &&
      hasAtLeastOnePreviousCertificate;
    let secondAndBeyoundCertificate =
      hasNewCertificateUnlockedButNotPassed ||
      (claimed === true && shouldRetakeExam);

    return (
      <View style={{ backgroundColor: ColorTheme.TERTIARY, flex: 1 }}>
        <ScrollView>
          {certIsUnclaimed
            ? this.renderUnclaimedCertificates(
                user.profileCertificates[lastCertEntry].score
              )
            : certificateClaimedAndNoNewCertificateAvaliable
            ? this.renderEarnedCertTopSection(
                claimed,
                user.profileCertificates[lastCertEntry].certDate
              )
            : this.renderCertificateHint(
                retakeDate,
                unlocked,
                claimed,
                passed,
                lastCertEntry,
                prepTestDone
              )}
          {secondAndBeyoundCertificate
            ? this.renderPrepScoreCard(
                user,
                retakeDate,
                hasNewCertificateUnlockedButNotPassed
              )
            : null}
          {secondAndBeyoundCertificate ||
          (claimed && certificateClaimedAndNoNewCertificateAvaliable)
            ? this.renderEarnedCertificates(user.profileCertificates, !claimed)
            : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: ColorTheme.SECONDARY,
    ...CONSTANTS.cardShadow
  },
  buttonStyle: {
    width: 250
  },
  imageStyle: {
    width: 130,
    height: 90,
    resizeMode: 'contain'
  }
});

function mapStateToProps(state) {
  const {
    selectedLang,
    contentByLanguage,
    index,
    selectedMode,
    currentUser,
    userProfiles
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications, certificates, modules } = language;

  let user = null;
  if (currentUser.currentUser) user = userProfiles[currentUser.currentUser];

  return {
    certificates,
    userProfiles,
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    currentUser: currentUser.currentUser,
    user,
    state,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    modules
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
    startPrepTest: (level, moduleKey) => {
      analytics.event('prepTestStart', `:${module}:`);
      dispatch(
        startQuiz({ level: level, moduleKey: moduleKey, preparePrepQuiz: true })
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CertificateCentralScreen);
