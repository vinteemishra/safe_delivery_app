import * as React from 'react';
import { Dimensions, Image, Platform } from 'react-native';

/** Constants */
import ColorTheme from './Constants/ColorTheme';
import * as CONSTANTS from './Constants/Constants';

/** Navigation */
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {
  createStackNavigator,
  TransitionPresets
} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// import { createBottomTabNavigator } from "react-navigation-tabs";
// import { createStackNavigator } from "react-navigation-stack";
// import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import RightHeaderButton from './Components/RightHeaderButton';
// import RightHeaderButtonSyncProfile from "./Components/RightHeaderButtonSyncProfile";

/** Screens used in application */
import AboutCertificationTestScreen from './Screens/AboutCertificationTestScreen';
import ActioncardScreen from './Screens/ActioncardScreen';
import AppLoadingScreen from './Screens/AppLoadingScreen';
import CardOptionScreen from './Screens/CardOptionScreen';
import CertificateCentralScreen from './Screens/CertificateCentralScreen';
import CertificateScreen from './Screens/CertificateScreen';
import CertificateScreenClaimed from './Screens/CertificateScreenClaimed';
import ChapterOptionScreen from './Screens/ChapterOptionScreen';
import ChooseProfileScreen from './Screens/ChooseProfileScreen';
import ChooseUserTypeScreen from './Screens/ChooseUserTypeScreen';
import CreateNewUserScreen from './Screens/CreateNewUserScreen';
// import DisclaimerScreen from "./Screens/DisclaimerScreen";
import DrugListScreen from './Screens/DrugListScreen';
import DrugScreen from './Screens/DrugScreen';
import EditProfileInfoScreen from './Screens/EditProfileInfoScreen';
import LanguageScreen from './Screens/LanguageScreen';
import LearningModuleScreen from './Screens/LearningModuleScreen';
import LearningScreen from './Screens/LearningScreen';
import LoginScreen from './Screens/LoginScreen';
import MainScreen from './Screens/MainScreen';
import ModuleScreen from './Screens/ModuleScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import SettingsScreen from './Screens/SettingsScreen';
import ShowProfileScreen from './Screens/ShowProfileScreen';
import VideoChapterScreen from './Screens/VideoChapterScreen';
import VideoPlayerScreen from './Screens/VideoPlayerScreen';
import BorderScreen from './Screens/BorderScreen';
import AssetsLoadingScreen from './Screens/AssetsLoadingScreen';
import { GettingDownloadReadyScreen } from './Screens/GettingDownloadReadyScreen';
import ValuePropScreen from './Screens/ValuePropScreen';
import ValuePropScreenDrugs from './Screens/ValuePropScreenDrugs';
import ValuePropScreenKnowHow from './Screens/ValuePropScreenKnowHow';
import ValuePropScreenSurvey from './Screens/ValuePropScreenSurvey';
import ValuePropScreenTermsOfUse from './Screens/ValuePropScreenTermsOfUse';
import ValuePropScreenBackgroundSurvey from './Screens/ValuePropScreenBackgroundSurvey';
import UserSurveyQuestionsScreen from './Screens/UserSurveyQuestionsScreen';
import DownloadInfoScreen from './Screens/DownloadInfoScreen';
import QuizTestScreen from './Screens/LearningQuiz/QuizTestScreen';
import QuizResultScreen from './Screens/LearningQuiz/QuizResultScreen';
import QuizReviewScreen from './Screens/LearningQuiz/QuizReviewScreen';
import CertTestScreen from './Screens/CertQuiz/CertTestScreen';
import CertCaseScreen from './Screens/CertQuiz/CertCaseScreen';
import CertResultScreen from './Screens/CertQuiz/CertResultScreen';
import CertIntroductionScreen from './Screens/CertQuiz/CertIntroductionScreen';
import HeaderTitleIcon from './Components/HeaderTitleIcon';
import DevNotificationsScreen from './Screens/DevScreens/DevNotificationsScreen';
import DevAnalyticsScreen from './Screens/DevScreens/DevAnalyticsScreen';
// import NotificationRichTextScreen from "./Screens/NotificationRichTextScreen";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import NavigationService from './Components/NavigationService';
/** Tab icons */
const HOME_ICON_ACTIVE = require('../img/nav_icons/main_selected.png');
const HOME_ICON = require('../img/nav_icons/main_unselected.png');
const MYLEARNING_ICON_ACTIVE = require('../img/nav_icons/my_learning_selected.png');
const MYLEARNING_ICON = require('../img/nav_icons/my_learning_unselected.png');
const SETTINGS_ICON_ACTIVE = require('../img/nav_icons/settings_selected.png');
const SETTINGS_ICON = require('../img/nav_icons/settings_unselected.png');
const SEARCH_ICON_ACTIVE = require('../img/nav_icons/search_selected.png');
const SEARCH_ICON = require('../img/nav_icons/search_unselected.png');
import Search from './Screens/Search';
import UserFeedback from './Screens/UserFeedback';
import DeleteUserProfile from './Screens/DeleteUserProfile';
import ConfirmDeleteProfile from './Screens/ConfirmDeleteProfile';

const tabIcon = (navigation: any) => {
  const defaultIcon = HOME_ICON;

  return ({ focused }: any) => {
    const { routeName } = navigation.state;
    let iconName;
    switch (routeName) {
      case 'MainTab':
        iconName = focused ? HOME_ICON_ACTIVE : HOME_ICON;
        break;
      case 'MyLearningTab':
        iconName = focused ? MYLEARNING_ICON_ACTIVE : MYLEARNING_ICON;
        break;
      case 'SettingsTab':
        iconName = focused ? SETTINGS_ICON_ACTIVE : SETTINGS_ICON;
        break;
      case 'SearchTab':
        iconName = focused ? SEARCH_ICON_ACTIVE : SEARCH_ICON;
        break;
      default:
        iconName = defaultIcon;
        break;
    }
    return <Image source={iconName} style={{ height: 24, width: 24 }} />;
  };
};

const MainTab = createStackNavigator(
  {
    Home: {
      screen: MainScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: false, title: title })
            }
          />
        ),
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    Module: {
      screen: ModuleScreen,
      path: 'module/:title',
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    VideoChapterScreen: {
      screen: VideoChapterScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    CardOptionScreen: {
      screen: CardOptionScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    ActioncardScreen: {
      screen: ActioncardScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    ChapterOptionScreen: {
      screen: ChapterOptionScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const MyLearningTab = createStackNavigator(
  {
    MyLearningHome: {
      screen: LearningScreen,
      navigationOptions: ({}) => ({
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    LearningModuleScreen: {
      screen: LearningModuleScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
        // headerTruncatedBackTitle: `test`,
      })
    },
    CertificateCentralScreen: {
      screen: CertificateCentralScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    AboutCertificationTestScreen: {
      screen: AboutCertificationTestScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    CertificateScreenClaimed: {
      screen: CertificateScreenClaimed,
      navigationOptions: ({ navigation }) => ({
        // headerRight: () => <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.goBack(); }} />,
        title: `${navigation.state.params.title}`,
        headerBackTitle: `${navigation.state.params.backButtonTitle}`
      })
    },
    BorderScreen: {
      screen: BorderScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    CreateNewUserScreenFromMyLearning: {
      screen: CreateNewUserScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    ChooseProfileScreenFromMyLearning: {
      screen: ChooseProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.goBack(null);
            }}
          />
        )
        // title: `${navigation.state.params.title}`,
      })
    },
    LoginScreenFromMyLearning: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const SearchTab = createStackNavigator(
  {
    GlobalSearch: {
      screen: Search,
      navigationOptions: {
        headerTitle: () => <HeaderTitleIcon />
      }
    },
    ActioncardScreen: {
      screen: ActioncardScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    ChapterOptionScreen: {
      screen: ChapterOptionScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'drug_title'}
            source={require('../img/nav_icons/drugs_selected.png')}
            onPress={(title) =>
              navigation.navigate('drugList', { module: true, title: title })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    DrugScreen: {
      screen: DrugScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const SettingsTab = createStackNavigator(
  {
    SettingsHome: {
      screen: SettingsScreen,
      navigationOptions: {
        // tabBarLabel: "Settings",
        headerTitle: () => <HeaderTitleIcon />
      }
    },
    ShowProfileScreenFromSettings: {
      screen: ShowProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            screenKey={'users_title'}
            source={require('../img/learning_icons/user-white.png')}
            onPress={(title) =>
              navigation.navigate('User', {
                module: true,
                title: `${navigation.state.params.title}`
              })
            }
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    CreateNewUserScreen: {
      screen: CreateNewUserScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    EditProfileInfoScreen: {
      screen: EditProfileInfoScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    DeleteUserProfile: {
      screen: DeleteUserProfile,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    ConfirmDeletProfile: {
      screen: ConfirmDeleteProfile,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    ResetPasswordScreen: {
      screen: ResetPasswordScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    ActioncardScreenSettings: {
      screen: ActioncardScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    ChapterOptionScreenSettings: {
      screen: ChapterOptionScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    LanguageScreen: {
      screen: LanguageScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    DevNotifications: {
      screen: DevNotificationsScreen
    },
    DevAnalytics: {
      screen: DevAnalyticsScreen
    },
    UserFeedback: {
      screen: UserFeedback,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const AppContainer = createBottomTabNavigator(
  {
    MainTab: {
      screen: MainTab,
      path: '',
      navigationOptions: {
        tabBarLabel: 'Home'
      }
    },
    SearchTab: {
      screen: SearchTab,
      path: 'search',
      navigationOptions: {
        tabBarLabel: 'Search'
      }
    },
    MyLearningTab: {
      screen: MyLearningTab,
      navigationOptions: {
        tabBarLabel: 'MyLearning'
      }
    },
    SettingsTab: {
      screen: SettingsTab,
      path: 'settings',
      navigationOptions: {
        tabBarLabel: 'Settings'
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: tabIcon(navigation)
    }),
    backBehavior: 'none',
    tabBarOptions: {
      allowFontScaling: false,
      activeTintColor: ColorTheme.SECONDARY,
      inactiveTintColor: '#ccc',
      style: {
        // height: (Dimensions.get("screen").width / 100) * 20,
        backgroundColor: ColorTheme.PRIMARY,
        ...CONSTANTS.cardShadowStyle
      },
      tabStyle: {
        // height: (Dimensions.get("screen").width / 100) * 10,
        // marginTop: 5,
      }
    }
  }
);

const drugStack = createStackNavigator(
  {
    drugList: {
      screen: DrugListScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop();
            }}
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    drug: {
      screen: DrugScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop(), navigation.pop();
            }}
          />
        ),
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const OnboardingTermsStack = createStackNavigator(
  {
    ValuePropScreenTermsOfUse: {
      screen: ValuePropScreenTermsOfUse,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop();
            }}
          />
        ),
        headerTitle: () => <HeaderTitleIcon />
      })
    }
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const OnboardingDownloadScreen = createStackNavigator(
  {
    DownloadInfoScreen: {
      screen: DownloadInfoScreen,
      navigationOptions: ({ navigation }) => {
        return {
          header: navigation.getParam('header'),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: ColorTheme.PRIMARY,
            backgroundColor: ColorTheme.SECONDARY
          },
          headerRight: () =>
            navigation.getParam('noHeaderButton') !== true ? (
              <RightHeaderButton
                source={require('../img/close-red.png')}
                onPress={() => {
                  navigation.pop();
                }}
              />
            ) : null
        };
      }
    }
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const OnboardingDownloadScreenGettingReady = createStackNavigator(
  {
    DownloadInfoGettingScreen: {
      screen: GettingDownloadReadyScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => null,
        header: navigation.getParam('header'),
        headerStyle: {
          shadowColor: 'transparent',
          elevation: 0,
          borderWidth: 1,
          borderBottomWidth: 0,
          borderColor: ColorTheme.PRIMARY,
          backgroundColor: ColorTheme.SECONDARY
        }
        // headerRight: () => <RightHeaderButton source={require('../img/close-red.png')} onPress={() => { navigation.pop() }} />,
      })
    }
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const OnboardingSurveyStack = createStackNavigator(
  {
    ValuePropScreenBackgroundSurvey: {
      screen: ValuePropScreenBackgroundSurvey,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop();
            }}
          />
        ),
        headerTitle: () => <HeaderTitleIcon />,
        gestureEnabled: false
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE(),
      gestureEnabled: false
    }
  }
);

const CertificateQuizStack = createStackNavigator(
  {
    CertIntro: {
      screen: CertIntroductionScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerRight: () => (
            <RightHeaderButton
              source={require('../img/notification_message/close.png')}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerTitle: () => <HeaderTitleIcon />,
          headerLeft: () => null
        };
      }
    },
    CertCase: {
      screen: CertCaseScreen,
      navigationOptions: ({ navigation }) => {
        return {
          // headerRight: () => <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.popToTop(); navigation.pop() }} />,
          headerTitle: () => <HeaderTitleIcon />,
          headerLeft: () => null
        };
      }
    },
    CertTest: {
      screen: CertTestScreen,
      navigationOptions: ({ navigation }) => {
        return {
          // headerRight: () => <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.popToTop(); navigation.pop() }} />,
          headerTitle: () => () => <HeaderTitleIcon />,
          headerLeft: () => () => null
        };
      }
    },
    CertResult: {
      screen: CertResultScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerRight: () => (
            <RightHeaderButton
              source={require('../img/notification_message/close.png')}
              onPress={() => {
                navigation.popToTop();
                navigation.pop();
              }}
            />
          ),
          headerTitle: () => <HeaderTitleIcon />,
          headerLeft: () => null
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      gestureEnabled: false,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const LearningQuizStack = createStackNavigator(
  {
    QuizTest: {
      screen: QuizTestScreen,
      navigationOptions: ({ navigation }) => {
        //navigation.state.params.preparePrepQuiz
        return {
          headerRight: () => {
            return navigation.state.params.preparePrepQuiz ? (
              <RightHeaderButton
                source={require('../img/notification_message/close.png')}
                onPress={() => {
                  navigation.navigate('CertificateCentralScreen');
                }}
              />
            ) : (
              <RightHeaderButton
                source={require('../img/notification_message/close.png')}
                onPress={() => {
                  navigation.dismiss();
                }}
              />
            );
          },
          title: `${navigation.state.params.title}`,
          headerLeft: () => null
        };
      }
      // gestureEnabled: false,
    },
    QuizResult: {
      screen: QuizResultScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerRight: () => (
            <RightHeaderButton
              source={require('../img/notification_message/close.png')}
              onPress={() => {
                navigation.popToTop();
                navigation.goBack(null);
              }}
            />
          ),
          title: `${navigation.state.params.title}`,
          headerLeft: () => null
        };
      }
      // gestureEnabled: false,
    },
    QuizReview: {
      screen: QuizReviewScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerRight: () => (
            <RightHeaderButton
              source={require('../img/notification_message/close.png')}
              onPress={() => {
                navigation.popToTop();
                navigation.goBack(null);
              }}
            />
          ),
          title: `${navigation.state.params.title}`,
          headerLeft: () => null
        };
      }
      // gestureEnabled: false,
    },
    QuizReviewLearnMore: {
      // screen: NotificationRichTextScreen,
      screen: ActioncardScreen,
      navigationOptions: ({ navigation }) => ({
        // headerRight: () => <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.popToTop(); navigation.goBack(null) }} />,
        title: navigation.state.params ? `${navigation.state.params.title}` : ''
      })
    },
    QuizReviewLearnMoreChapterOptions: {
      // screen: NotificationRichTextScreen,
      screen: ChapterOptionScreen,
      navigationOptions: ({ navigation }) => ({
        // headerRight: () => <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.popToTop(); navigation.goBack(null) }} />,
        title: navigation.state.params ? `${navigation.state.params.title}` : ''
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      gestureEnabled: false,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const CertificateScreenStack = createStackNavigator(
  {
    CertificateScreen: {
      screen: CertificateScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.navigate('CertificateCentralScreen', {});
            }}
          />
        ),
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const userStack = createStackNavigator(
  {
    ChooseProfileScreen: {
      screen: ChooseProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.goBack(null);
            }}
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    ChooseUserTypeScreen: {
      screen: ChooseUserTypeScreen,
      navigationOptions: ({ navigation }) => ({
        // headerRight: () => <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.goBack(null); }} />,
        title: `${navigation.state.params.title}`
      })
    },
    ShowProfileScreenFromSettingsModal: {
      screen: ShowProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop();
              navigation.pop();
            }}
          />
        ),
        title: `${navigation.state.params.title}`
      })
    },
    EditProfileInfoScreenModal: {
      screen: EditProfileInfoScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => <HeaderTitleIcon />
      })
    },
    CreateNewUserScreenModal: {
      screen: CreateNewUserScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    },
    LoginScreenModal: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
      // title: 'Users',
      // title: `${navigation.state.params.title}`,
    }
  }
);

const OnboardingScreenStack = createStackNavigator(
  {
    ValuePropScreen: {
      screen: ValuePropScreen
    },
    ValuePropScreenDrugs: {
      screen: ValuePropScreenDrugs
    },
    ValuePropScreenKnowHow: {
      screen: ValuePropScreenKnowHow
    },
    ValuePropScreenSurvey: {
      screen: ValuePropScreenSurvey
    },
    UserSurveyQuestionsScreen: {
      screen: UserSurveyQuestionsScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'screen',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE(),
      gestureEnabled: false,
      headerTitle: () => null,
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: ColorTheme.PRIMARY
      }
      // headerTitle: () => <HeaderTitleIcon />,
    }
  }
);

const UserSurveyQuestionsScreenStack = createStackNavigator(
  {
    UserSurveyQuestionsScreen: {
      screen: UserSurveyQuestionsScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'screen',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE(),
      header: null,
      gestureEnabled: false,
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: ColorTheme.PRIMARY
      }
      // headerTitle: () => <HeaderTitleIcon />,
    }
  }
);

const OnboardingStack = createStackNavigator(
  {
    OnboardingScreens: {
      screen: OnboardingScreenStack,
      navigationOptions: {
        headerShown: false
      }
    },
    OnboardingDownloadScreenStack: {
      screen: OnboardingDownloadScreen,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      }
    },
    OnboardingDownloadGettingReadyScreenStack: {
      screen: OnboardingDownloadScreenGettingReady,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      }
    },
    OnboardingTerms: {
      screen: OnboardingTermsStack,
      navigationOptions: {
        headerShown: false
      }
    },
    OnboardingSurvey: {
      screen: OnboardingSurveyStack,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      }
    }
  },
  {
    mode: 'modal'
  }
);

// const NotificationLinkStack = NotificationLinkStacked;
const NotificationLinkStack = createStackNavigator(
  {
    NotificationChapterOption: {
      // screen: NotificationRichTextScreen,
      screen: ChapterOptionScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop();
            }}
          />
        ),
        title: navigation.state.params ? `${navigation.state.params.title}` : ''
      })
    },
    NotificationRichText: {
      // screen: NotificationRichTextScreen,
      screen: ActioncardScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.popToTop();
              navigation.goBack(null);
            }}
          />
        ),
        title: navigation.state.params ? `${navigation.state.params.title}` : ''
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const NotificationChapter = createStackNavigator(
  {
    NotificationChapter: {
      // screen: NotificationRichTextScreen,
      screen: ActioncardScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: () => (
          <RightHeaderButton
            source={require('../img/notification_message/close.png')}
            onPress={() => {
              navigation.pop();
            }}
          />
        ),
        title: navigation.state.params.title
          ? `${navigation.state.params.title}`
          : ''
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      ...CONSTANTS.NAVIGATOR_STYLE()
    }
  }
);

const RootStack = createStackNavigator(
  {
    Root: {
      screen: AppContainer,
      path: '',
      navigationOptions: {
        header: null
      }
    },
    Drugs: {
      screen: drugStack,
      navigationOptions: {
        header: null
      }
    },
    VideoPlayerScreen: {
      screen: VideoPlayerScreen,
      path: 'video:videoId',
      navigationOptions: {
        header: null
      }
    },
    NotificationLinkStack: {
      screen: NotificationLinkStack,
      navigationOptions: {
        header: null
      }
    },
    NotificationChapter: {
      screen: NotificationChapter,
      navigationOptions: {
        header: null
      }
    },
    User: {
      screen: userStack,
      navigationOptions: {
        header: null
      }
    },
    CertificateQuiz: {
      screen: CertificateQuizStack,
      navigationOptions: {
        header: null
      }
    },
    LearningQuiz: {
      screen: LearningQuizStack,
      navigationOptions: {
        header: null
      }
    },
    Certificate: {
      screen: CertificateScreenStack,
      navigationOptions: {
        header: null
      }
    },
    UserSurvey: {
      screen: UserSurveyQuestionsScreenStack,
      navigationOptions: {
        header: null,
        gestureEnabled: false
      }
    }
  },
  {
    mode: 'modal'
  }
);

const InitialDownload = createStackNavigator({
  Language: {
    screen: LanguageScreen,
    navigationOptions: ({ navigation }) => ({
      ...CONSTANTS.NAVIGATOR_STYLE(),
      title: `Choose language`
    })
  }
  // GettingReady: {
  //     screen: GettingDownloadReadyScreen,
  //     navigationOptions: {
  //         header: null,
  //     }
  // },
});

const Switch = createSwitchNavigator(
  {
    Loading: AppLoadingScreen,
    InitialDownload: InitialDownload,
    App: { screen: RootStack, path: '' },
    Onboarding: OnboardingStack,
    AssetsLoading: AssetsLoadingScreen
  },
  {
    initialRouteName: 'Loading'
  }
);

const Container = createAppContainer(Switch);

export const App = () => (
  <Container
    ref={(nav) => NavigationService.setTopLevelNavigator(nav)}
    enableURLHandling={false}
  />
);
