import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import { connect, MapDispatchToProps } from 'react-redux';
import * as helpers from '../Utils/helpers';
import AddUserChoice from '../Components/AddUserChoice';
import ListHeader from '../Components/ListHeader';
import FramedButton from '../Components/FramedButton';
import _ from 'lodash';
import LightBoxModal from '../Components/LightBoxModal';
import LogoutBox from '../Components/LogoutBox';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import {
  StackActions,
  NavigationActions,
  NavigationScreenProp
} from 'react-navigation';
import { countryInfo } from '../Utils/countries';
import { removeProfile, setCurrentUser } from '../Actions/actions';
import { StoreState } from '../Reducers/reducers';
const { width, height } = Dimensions.get('window');

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}
interface PropsFromState {
  selectedLang: string;
  language: any;
  screen: { [key: string]: string };
  user: any;
  currentUser: string;
  selectedCountry: string | null;
  userProfiles: Array<any>;
  getTextFromCMS: (screenKey: string, fallback: string) => string;
}

interface PropsFromDispatch {
  removeProfile(profileId: string): void;
  setCurrentUser(profileId: string | null): void;
}

interface State {
  modalVisible: boolean;
  fetching: boolean;
  fetchingDone: boolean;
  fetchError: string;
  syncFailed: boolean;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class ShowProfileScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      fetching: false,
      fetchingDone: false,
      fetchError: '',
      syncFailed: false
    };

    // if (this.props.user) {
    //     this.state = {
    //         medicalWorker: this.props.user.profileQuestions['medicalWorker'],
    //         country: this.props.user.profileQuestions['country'],
    //         deliveries: this.props.user.profileQuestions['deliveries'],
    //         // workplace: this.props.user.profileQuestions['workplace'],
    //         token: null,
    //     };
    // }
  }

  private onPressExisting() {
    if (!_.isEmpty(this.props.userProfiles)) {
      this.props.navigation.navigate('ChooseProfileScreen', {
        title: this.props.getTextFromCMS(
          'lp:AddUserChoiceButtonLabel2',
          'already a user'
        ),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        no_active_user: true,
        fromSettingsScreen: this.props.navigation.state.params
          .fromSettingsScreen,
        fromMylearningScreen: this.props.navigation.state.params
          .fromMylearningScreen
        // name: this.props.user.profileName,
      });
    } else {
      this.props.navigation.navigate('LoginScreen', {
        title: this.props.getTextFromCMS(
          'lp:AddUserChoiceButtonLabel2',
          'already a user'
        ),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        fromSettingsScreen: this.props.navigation.state.params
          .fromSettingsScreen,
        fromMylearningScreen: this.props.navigation.state.params
          .fromMylearningScreen
        // name: this.props.user.profileName,
      });
    }
  }

  private onPressNew() {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate('CreateNewUserScreen', {
      title: this.props.getTextFromCMS('add_user_title', 'add user'),
      backButtonTitle: helpers.getBackText(this.props.screen.back),
      fromSettingsScreen: this.props.navigation.state.params.fromSettingsScreen
    });
  }

  //When a user logs out, the LearningScreen witnin the MyLearningTab stack is reset to prevent an app crash, and then there is the need to navigate back ShowProfileScreen. Hence this functions.
  private resetStackAndClose() {
    this.setState({ modalVisible: false }); //Close the dialouge modal
    this.props.navigation.navigate('ShowProfileScreenFromSettings', {
      //Navigate back to the ShowProfileScreen
      title: this.props.getTextFromCMS('userprofile', 'user profile')
    });
  }

  private renderUpgradeAccount() {
    return (
      <>
        <View style={styles.separator} key={0} />
        <View style={styles.field} key={1}>
          <View>
            <AppText style={{ margin: 16, textAlign: 'center' }}>
              {this.props.screen['lp:account_not_online']
                ? this.props.screen['lp:account_not_online']
                : 'this account does not have an online profile.'}
            </AppText>
            <FramedButton
              label={this.props.getTextFromCMS(
                'lp:upgrade_profile_button',
                'i want to save progress'
              )}
              onPress={() => this.pressConnect()}
            />
            <View>
              <TouchableOpacity
                onPress={() => this.pressLogout()}
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <AppText
                  style={[
                    {
                      color: ColorTheme.PRIMARY,
                      fontSize: ColorTheme.FONT_SIZE * 0.8
                    }
                  ]}
                >
                  {this.props.screen['lp:remove_user']
                    ? this.props.screen['lp:remove_user']
                    : 'remove user'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }

  private renderAccountInformation() {
    return (
      <>
        <View style={[styles.field, { flex: 1, flexDirection: 'row' }]} key={1}>
          <AppText style={styles.fieldText}>
            {this.props.user.method === 'WhatsApp'
              ? this.props.screen['lp:whatsapp']
                ? this.props.screen['lp:whatsapp']
                : 'WhatsApp'
              : this.props.screen['lp:email']
              ? this.props.screen['lp:email']
              : 'email'}
          </AppText>
          <AppText style={styles.fieldValue}>
            {this.props.user.profileEmail}
          </AppText>
        </View>
        <View style={[styles.field, { flex: 1, flexDirection: 'row' }]} key={2}>
          <AppText style={styles.fieldText}>
            {this.props.screen['lp:password']
              ? this.props.screen['lp:password']
              : 'password'}
          </AppText>
          <AppText style={styles.fieldValue}>******</AppText>
        </View>
        <View style={styles.separator} key={2} />
        <View style={styles.field} key={3}>
          <View>
            <TouchableOpacity
              onPress={() => this.pressLogout()}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <AppText
                style={[styles.fieldValue, { color: ColorTheme.PRIMARY }]}
              >
                {this.props.screen['lp:log_out']
                  ? this.props.screen['lp:log_out']
                  : 'log out'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
  public render() {
    if (!this.props.user) {
      const { getTextFromCMS } = this.props;

      const headerText = this.props.screen[
        'lp:certificate_center_notification_My_Learning_introduction_button_label'
      ]
        ? this.props.screen[
            'lp:certificate_center_notification_My_Learning_introduction_button_label'
          ]
        : 'get started';
      // const headerText = this.props.screen['lp:get_started'] ? this.props.screen['lp:get_started'] : 'get started'
      const btn1Label = getTextFromCMS(
        'lp:AddUserChoiceButtonLabel1',
        'new user'
      );
      const btn2Label = getTextFromCMS(
        'lp:AddUserChoiceButtonLabel2',
        'already a user'
      );

      return (
        <View
          style={[
            styles.mainContainer,
            { backgroundColor: ColorTheme.SECONDARY }
          ]}
        >
          <AddUserChoice
            headerText={headerText}
            btn1Label={btn1Label}
            btn2Label={btn2Label}
            buttonColor={ColorTheme.PRIMARY}
            headerColor={ColorTheme.BLACK}
            onPressExisting={() => this.onPressExisting()}
            onPressNew={() => this.onPressNew()}
          />
        </View>
      );
    }
    const { language } = this.props;
    let healthcare_worker = 'No';
    if (
      this.props.user.profileQuestions['upq:question_1'] ==
      'upq:question_1_answer_1'
    )
      healthcare_worker = 'Yes';

    let connect_option = [];
    let name_email = [];

    const OFFLINE_USER =
      !this.props.user.profileEmail || this.props.user.profileEmail.length == 0;

    if (OFFLINE_USER) {
      connect_option.push(this.renderUpgradeAccount());
    } else {
      name_email.push(this.renderAccountInformation());
    }

    return (
      <ScrollView style={styles.mainContainer}>
        <AnalyticsTracker eventType='setting' eventData={`:userprofile:`} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ListHeader>
            {this.props.screen['lp:user_info']
              ? this.props.screen['lp:user_info']
              : 'user info'}
          </ListHeader>
          <TouchableOpacity onPress={() => this.editProfileInfo()}>
            <ListHeader style={{ color: ColorTheme.PRIMARY }}>
              {this.props.getTextFromCMS('lp:edit', 'edit')}
            </ListHeader>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: ColorTheme.SECONDARY }}>
          <View style={styles.separator} />
          <View style={[styles.field, { flex: 1, flexDirection: 'row' }]}>
            <AppText style={styles.fieldText}>
              {this.props.screen['lp:name']
                ? this.props.screen['lp:name']
                : 'name'}
            </AppText>
            <AppText style={styles.fieldValue}>
              {this.props.user.profileName}
            </AppText>
          </View>
          <View style={styles.separator} />
          {this.props.user.country ? (
            <View style={[styles.field, { flex: 1, flexDirection: 'row' }]}>
              <AppText style={styles.fieldText}>
                {this.props.screen['lp:country']
                  ? this.props.screen['lp:country']
                  : 'country'}
              </AppText>
              <AppText style={styles.fieldValue}>
                {this.getCountryNameFromCountryCode(
                  this.props.user.country,
                  countryInfo
                )}
              </AppText>
            </View>
          ) : null}
          {OFFLINE_USER
            ? this.renderUpgradeAccount()
            : this.renderAccountInformation()}
          {/* {name_email}
                    {connect_option} */}
        </View>
        <LightBoxModal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
          floatingCloseButtonVisible={true}
          closeText={language.screen.close ? language.screen.close : 'close'}
        >
          <LogoutBox
            closeButtonText={
              this.props.language.screen.close
                ? this.props.language.screen.close
                : 'close'
            }
            doneMassage={this.props.getTextFromCMS(
              'lp:logout_done_message',
              'user logged out'
            )}
            syncFailedMessage={this.props.getTextFromCMS(
              'lp:logout_failed_sync_message',
              'your latest progress could not be saved. you may try again, or log out the user anyway (you will lose the latest progress)'
            )}
            userProfiles={this.props.userProfiles}
            currentUser={this.props.currentUser}
            country={this.props.selectedCountry}
            screen={this.props.screen}
            removeProfile={() =>
              this.props.removeProfile(this.props.currentUser)
            }
            setCurrentUser={() => this.props.setCurrentUser(null)}
            // onRequestClose={() => this.setState({ modalVisible: false })}
            onRequestClose={() => this.resetStackAndClose()}
          />
        </LightBoxModal>
      </ScrollView>
    );
  }

  private getCountryNameFromCountryCode(
    countryCode: string,
    countriesList
  ): string | undefined {
    let countryName;
    if (
      countriesList.countries &&
      countriesList.countries[countryCode] &&
      countriesList.countries[countryCode].name
    ) {
      countryName = countriesList.countries[countryCode].name;
    }
    return countryName;
  }

  pressConnect() {
    this.props.navigation.navigate('CreateNewUserScreen', {
      title: this.props.getTextFromCMS('account_setup_title', 'setup account'),
      backButtonTitle: helpers.getBackText(this.props.screen.back),
      name: this.props.user.profileName
    });
  }

  pressLogout() {
    // this.resetStackAndClose(); //Reset the "Mylearning Stack before user login dialouge. This is set here, to prevent app crash, if the user is removing a online user"
    // setTimeout(() => this.setState({ modalVisible: true }), 350) //Close the logout modal dialouge
    this.setState({ modalVisible: true });
  }

  logoutComplete() {
    this.props.navigation.goBack();
  }

  editProfileInfo() {
    if (this.props.navigation.state.params.fromSettingsScreenViewProfile) {
      this.props.navigation.navigate('EditProfileInfoScreenModal', {
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        profileEmail: this.props.user.profileEmail,
        profileName: this.props.user.profileName
      });
    } else {
      this.props.navigation.navigate('EditProfileInfoScreen', {
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        profileEmail: this.props.user.profileEmail,
        profileName: this.props.user.profileName
      });
    }
  }

  // editProfileQuestions() {
  //     if (this.props.navigation.state.params.fromSettingsScreenViewProfile) {
  //         this.props.navigation.navigate('UserProfileQuestionScreenModal', {
  //             titleImage: require('../../img/sda_title.png'),
  //             backButtonHidden: true,
  //             continueToNextQuestion: true,
  //             indicatorCount: 5,
  //             selectedIndicator: 1,
  //             fromSettingsScreen: this.props.navigation.state.params.fromSettingsScreen,
  //             fromMylearningScreen: this.props.navigation.state.params.fromMylearningScreen,
  //             fromSettingsScreenViewProfile: this.props.navigation.state.params.fromSettingsScreenViewProfile,
  //         });
  //     }
  //     else {
  //         this.props.navigation.navigate('UserProfileQuestionScreen', {
  //             titleImage: require('../../img/sda_title.png'),
  //             backButtonHidden: true,
  //             continueToNextQuestion: true,
  //             indicatorCount: 5,
  //             selectedIndicator: 1,
  //             fromSettingsScreen: this.props.navigation.state.params.fromSettingsScreen,
  //             fromMylearningScreen: this.props.navigation.state.params.fromMylearningScreen,
  //             fromSettingsScreenViewProfile: this.props.navigation.state.params.fromSettingsScreenViewProfile,
  //         });
  //     }
  // }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    selectedCountry,
    contentByLanguage,
    index,
    currentUser,
    userProfiles
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen } = language;

  let user = null;
  if (currentUser.currentUser) user = userProfiles[currentUser.currentUser];

  return {
    selectedLang,
    selectedCountry,
    language,
    screen,
    index,
    user,
    currentUser: currentUser.currentUser,
    userProfiles,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
}

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  removeProfile: (profileId) => {
    dispatch(removeProfile(profileId));
  },
  setCurrentUser: (profileId) => {
    dispatch(setCurrentUser(profileId));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowProfileScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ColorTheme.TERTIARY
  },
  button: {
    height: 50,
    width: width < height ? width - width / 4 : height - height / 4,
    borderColor: ColorTheme.PRIMARY,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    flexDirection: 'row'
  },
  buttonText: {
    color: ColorTheme.PRIMARY
  },
  headerField: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    height: 65,
    backgroundColor: '#f8f8f8'
  },
  headerText: {
    fontSize: ColorTheme.FONT_SIZE * 1.1,
    fontWeight: '500',
    letterSpacing: 1.2
  },
  headerOption: {
    fontSize: ColorTheme.FONT_SIZE * 0.8,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: ColorTheme.PRIMARY
  },
  field: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    minHeight: 10
  },
  fieldText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: ColorTheme.FONT_SIZE,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: '#999'
  },
  fieldValue: {
    marginLeft: 12,
    alignSelf: 'center',
    flex: 2,
    fontSize: ColorTheme.FONT_SIZE,
    letterSpacing: 1.2
  },
  separator: {
    height: 1,
    backgroundColor: ColorTheme.SEPARATOR
  }
});
