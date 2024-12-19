import React, { Component } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { connect } from 'react-redux';
import { countryInfo } from '../Utils/countries';
import AppText from '../Components/AppText';
import DownloadIndicator from '../Components/DownloadIndicator';
import ResponsiveProgressBar from '../Components/ResponsiveProgressBar';
import ColorTheme from '../Constants/ColorTheme';
import { getDownloadPercentage } from '../Reducers/downloadReducer.js';
import { analytics } from '../Utils/analytics';
import {
  approveDisclaimer,
  setDeliveriesQuestionDate,
  setHealthCareWorkerQustion,
  answeredSurvey,
  selectCountry
} from '../Actions/actions';
import * as helpers from '../Utils/helpers';
import AnimatedRadioButton from '../Components/AnimatedRadioButton.js';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import FramedButton from '../Components/FramedButton';
import { CHEAT } from '../Config/config';

const ANIMATION_TIME = 750;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: ColorTheme.TERTIARY
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: ColorTheme.FONT_SIZE * 1.25,
    fontWeight: '500',
    letterSpacing: 1.2
  },
  indicator: {
    margin: 6,
    height: 10,
    width: 200,
    borderRadius: 20,
    borderWidth: 1
  }
});

function compareName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
}

class UserSurveyQuestionsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    // console.log("User survey", navigation, navigationOptions);
    if (navigation.state.params) {
      return {
        headerLeft: navigation.state.params.hideBackButton ? null : (
          <HeaderBackButton
            tintColor={ColorTheme.PRIMARY}
            onPress={() => navigation.state.params.onNavigatorBack()}
          />
        ),
        headerStyle: {
          ...navigationOptions.headerStyle,
          backgroundColor: ColorTheme.TERTIARY
        }
      };
    }
  };

  constructor(props) {
    super(props);
    this.opacityValue = new Animated.Value(0);
    this.nativeCountriesList = Object.entries(countryInfo.countries)
      .map(([key, value]) => ({ iso: key, ...value }))
      .sort(compareName);
    this.touchableInactive = false;

    this.state = {
      onboardingScreens: [],
      selected: undefined,
      index: 0,
      towardsNextIndex: 0,
      isDeviceShared: true,
      disabled: false,
      selectedCountry: -1,
      downloadProgressWidth: 300,
      regionsListTest: {},
      countryHasRegion: false,
      regionHasDistrict: false,
      districtListTest: {},
      selectedRegion: -1,
      selectedDistrict: -1,
      selectedCountryHadRegion: false,
      selectedRegionHadDistrict: false,
      loadDownloadScreen: false,
      offSet: 0,
      selectedDeliveriesAnswer: -1
    };

    this.goBackOneLevel = this.goBackOneLevel.bind(this);
  }

  componentWillMount() {
    analytics.event('onboarding', ':user_profile_questions:');
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    ); //To prevent the user from going back with press on the hardware back button on Android
  }

  componentDidMount() {
    if (
      this.state.index == 2 &&
      (this.state.selectedRegion == -1 || this.state.selectedDistrict == -1)
    ) {
      scrollToIndex = () => {
        this.flatListRef.scrollToIndex({ animated: false, index: 0 });
      };
    }
    this.props.navigation.setParams({ onNavigatorBack: this.goBackOneLevel });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    ); //To prevent the user from going back with press on the hardware back button on Android
    this.setState({ loadDownloadScreen: false });
  }

  componentWillUpdate(prevProps, prevState) {
    if (this.state.index !== prevState.index) {
      this.props.navigation.setParams({
        hideBackButton: this.state.index === this.props.OnboardingArray
      });
    }
    if (
      this.state.index ===
      this.getOnb(this.props.onboarding, this.props.language).length
    ) {
      //If array is on the last entry, when load the downloadScreen after 1500 ms.
      setTimeout(() => {
        this.setState({ loadDownloadScreen: true });
      }, 1500);
    }
  }

  handleBackButtonClick = () => {
    const from = this.props.navigation.getParam('from'); // To determin where this screen is loaded from, for validating use later on
    if (from === 'AppLoadingScreen' || from === 'index') {
      //To prevent the user from closing the modal with the hardware back button. They shall use the Skip button or just answer the question
      return true;
    }

    this.goBackOneLevel();
    return true;
  };

  _onRadioChecked(answerIndex, lastEntryOfArray, answer, questionID, from) {
    const NOW = Date.now();
    const MILISECONDS_IN_A_DAY = 86400000;
    const MILISECONDS_TO_MIDTNIGHT = NOW % MILISECONDS_IN_A_DAY; //Get the miliseconds until midtnight today
    const MILISECONDS_FROM_MIDNIGHT_TO_6_30_PM_THE_NEXT_DAY = 59400000; //Get the mileseconds from midtnight until 6:30 PM
    const _30_DAYS_IN_MILISECONDS_AT_6_30_PM =
      MILISECONDS_IN_A_DAY * 30 +
      MILISECONDS_FROM_MIDNIGHT_TO_6_30_PM_THE_NEXT_DAY; //Get the miliseconds until 6:30 at 30 days farward
    const _1_DAYS_IN_MILISECONDS_AT_6_30_PM =
      MILISECONDS_IN_A_DAY * 1 +
      MILISECONDS_FROM_MIDNIGHT_TO_6_30_PM_THE_NEXT_DAY; //Get the miliseconds until 6:30 at 1 days farward
    const _7_DAYS_IN_MILISECONDS_AT_6_30_PM =
      MILISECONDS_IN_A_DAY * 7 +
      MILISECONDS_FROM_MIDNIGHT_TO_6_30_PM_THE_NEXT_DAY; //Get the miliseconds until 6:30 at 1 days farward

    // const dateToShowQuestionIn30Days = (NOW - MILISECONDS_TO_MIDTNIGHT) + _30_DAYS_IN_MILISECONDS_AT_6_30_PM; //Set the date to 6:30 PR in 30 days, from now.

    const dateToShowQuestionIn1Day =
      NOW - MILISECONDS_TO_MIDTNIGHT + _1_DAYS_IN_MILISECONDS_AT_6_30_PM; //Set the date to 6:30 PR in 1 day, from now.

    const dateToShowQuestionIn7Day =
      NOW - MILISECONDS_TO_MIDTNIGHT + _7_DAYS_IN_MILISECONDS_AT_6_30_PM; //Set the date to 6:30 PR in 1 day, from now.

    analytics.event('upq', `:question_${questionID}:`); //Track the question _with the key of the screen
    analytics.event(
      'answerUpq',
      `:question_${questionID}:${answerIndex}:${answer}:`
    ); //Track the answer index, and the answer in plain text

    this.opacity();
    setTimeout(() => this.opacity_test(), ANIMATION_TIME);
    this.setState({ disabled: true });
    setTimeout(
      () => this.setState({ disabled: false, selected: undefined }),
      ANIMATION_TIME
    );

    if (from === 'AppLoadingScreen' || from === 'index') {
      //If this screen is loaded from "AppLoadingScreen", then it is the "Deliveries" question that is rendered.
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      );
      // this.props.dispatch(setDeliveriesQuestionDate(dateToShowQuestionIn30Days));
      this.props.dispatch(
        setDeliveriesQuestionDate(
          CHEAT ? NOW + 600000 : dateToShowQuestionIn7Day
        )
      );
      setTimeout(() => this.props.navigation.pop(), 1500);
      return;
    }
    if (this.state.index === 0 && answerIndex === 1) {
      //IF the user says "No" to the "shared device" question, then jump over the next one
      setTimeout(
        () =>
          this.setState({ index: this.state.index + 2, isDeviceShared: false }),
        ANIMATION_TIME
      );
    } else if (this.state.index === 0 && answerIndex === 0) {
      //IF the user says "Yes" to the "shared device" question, then go to the next one
      setTimeout(
        () =>
          this.setState({ index: this.state.index + 1, isDeviceShared: true }),
        ANIMATION_TIME
      );
    } else if (this.state.index === 3 && answerIndex === 1) {
      //If the user has answer "No" on the health care worker question, then go to "Thank you" screen. Then set the disclaimer.
      this.props.dispatch(approveDisclaimer()); //Acceps the terms of use!
      this.props.dispatch(answeredSurvey()); //User has finished survey
      this.props.dispatch(setHealthCareWorkerQustion(false)); //Store if the user is a healthcare worker or not - For later use in validation
      setTimeout(
        () => this.setState({ index: lastEntryOfArray }),
        ANIMATION_TIME
      );
    } else if (this.state.index === lastEntryOfArray - 1) {
      //If the user has answer "Yes" on the health care worker question, and has answer the last question. Then set the disclaimer.
      this.props.dispatch(approveDisclaimer()); //Acceps the terms of use!
      this.props.dispatch(answeredSurvey()); //User has finished survey
      this.props.dispatch(
        setDeliveriesQuestionDate(
          CHEAT ? NOW + 600000 : dateToShowQuestionIn1Day
        )
      ); //Set the date in 1 day, at 6:30
      this.props.dispatch(setHealthCareWorkerQustion(true)); //Store if the user is a healthcare worker or not - For later use in validation
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      );
    } else {
      //Go one index farward ine the array
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      );
    }
  }

  opacity() {
    this.opacityValue.setValue(0);
    Animated.timing(this.opacityValue, {
      toValue: 1,
      duration: ANIMATION_TIME,
      easing: Easing.linear,
      useNativeDriver: true
      // isInteraction: false
    }).start();
  }

  opacity_test() {
    this.opacityValue.setValue(1);
    Animated.timing(this.opacityValue, {
      toValue: 0,
      duration: ANIMATION_TIME,
      easing: Easing.linear,
      useNativeDriver: true
      // isInteraction: false
    }).start();
  }

  _onCountry(country, index) {
    analytics.event('upq', `:question_country:`); //Track the question _with the key of the screen
    analytics.event('answerUpq', `:question_country:${index}:${country.name}:`); //Track the answer index, and the answer in plain text

    // Update global state to selected country
    this.props.dispatch(selectCountry(country.iso));

    // analytics.event("onboarding", `:country:${country.name}:`);
    if (country.regions !== undefined) {
      //Handle if the selected country has a region/state
      this.setState({ regionsListTest: country.regions });
      this.setState({ selectedCountry: index });
      this.setState({ disabled: true });
      setTimeout(() => this.setState({ disabled: false }), ANIMATION_TIME);
      this.opacity();
      setTimeout(() => {
        this.setState({ countryHasRegion: true });
      }, ANIMATION_TIME);
      setTimeout(() => {
        this.setState({ selectedCountryHadRegion: true });
      }, ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with regions and countey to start at top.
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with regions and countey to start at top.
      setTimeout(
        () => this.setState({ towardsNextIndex: 1 / 3 }),
        ANIMATION_TIME
      ); //Indicator..... Some text
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
    } else {
      this.setState({ selectedCountry: index });
      this.setState({ disabled: true });
      setTimeout(() => this.setState({ disabled: false }), ANIMATION_TIME);
      this.opacity();
      setTimeout(() => {
        this.setState({ index: this.state.index + 1 });
      }, ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
    }
  }

  _onRegion(region, index) {
    analytics.event('upq', `:question_region:`); //Track the question _with the key of the screen
    analytics.event('answerUpq', `:question_region:${index}:${region.name}:`); //Track the answer index, and the answer in plain text

    if (
      region.districts &&
      Array.isArray(region.districts) &&
      region.districts.length > 0
    ) {
      //Handle if the selected region/state has a district
      this.setState({ districtListTest: region.districts });
      this.setState({ selectedRegion: index });
      this.setState({ disabled: true });
      setTimeout(() => this.setState({ disabled: false }), ANIMATION_TIME);
      this.opacity();
      setTimeout(() => {
        this.setState({ regionHasDistrict: true });
      }, ANIMATION_TIME);
      setTimeout(() => {
        this.setState({ selectedRegionHadDistrict: true });
      }, ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with regions and countey to start at top.
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with regions and countey to start at top.
      setTimeout(
        () => this.setState({ towardsNextIndex: 2 / 3 }),
        ANIMATION_TIME
      ); //Indicator..... Some text
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
    } else {
      this.setState({ selectedRegion: index });
      this.setState({ disabled: true });
      setTimeout(() => this.setState({ disabled: false }), ANIMATION_TIME);
      this.opacity();
      setTimeout(() => {
        this.setState({ index: this.state.index + 1 });
      }, ANIMATION_TIME);
      setTimeout(() => {
        this.setState({ selectedCountryHadRegion: false });
      }, ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
    }
  }

  _onDiscrict(discrict, index) {
    //When district is selected, when go to the next index, aka next question
    analytics.event('upq', `:question_discrict:`); //Track the question _with the key of the screen
    analytics.event(
      'answerUpq',
      `:question_discrict:${index}:${discrict.name}:`
    ); //Track the answer index, and the answer in plain text

    this.setState({ selectedDistrict: index });
    this.setState({ disabled: true });
    setTimeout(() => this.setState({ disabled: false }), ANIMATION_TIME);
    this.opacity();
    setTimeout(() => {
      this.setState({ index: this.state.index + 1 });
    }, ANIMATION_TIME);
    // setTimeout(() => { this.setState({ selectedRegionHadDistrict: false, }) }, ANIMATION_TIME);
    setTimeout(() => {
      this.setState({ selectedCountryHadRegion: false });
    }, ANIMATION_TIME);
    setTimeout(() => this.setState({ towardsNextIndex: 0 }), ANIMATION_TIME); //Indicator..... Some text
    setTimeout(() => this.opacity_test(), ANIMATION_TIME);
  }

  goBackOneLevel() {
    if (
      this.state.isDeviceShared == false &&
      this.state.index == 2 &&
      !this.touchableInactive &&
      !this.state.countryHasRegion &&
      !this.state.regionHasDistrict
    ) {
      //If shared device anser is No, and you are on select country, then go back to shared device question on index 0
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 2 }),
        ANIMATION_TIME
      );
      this.opacity();
      if (this.state.selectedCountry > 1) {
        //When going back from Select Country and the device is not a shared device, then reset the one the user selected before
        setTimeout(
          () => this.setState({ selectedCountry: -1 }),
          ANIMATION_TIME
        );
      }
    } else if (
      this.state.index == 2 &&
      this.state.regionHasDistrict &&
      !this.touchableInactive
    ) {
      //Go back from "select district" page to "select region"
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ regionHasDistrict: false }),
        ANIMATION_TIME
      );
      setTimeout(
        () => this.setState({ selectedRegionHadDistrict: false }),
        ANIMATION_TIME
      );
      setTimeout(() => this.setState({ selectedDistrict: -1 }), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with countrys to start at India when selected and goind back from next screen.
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with countrys to start at India when selected and goind back from next screen.
      setTimeout(
        () =>
          this.setState({
            towardsNextIndex: this.state.towardsNextIndex - 1 / 3
          }),
        ANIMATION_TIME
      );
      this.opacity();
    } else if (
      this.state.index == 2 &&
      this.state.countryHasRegion &&
      !this.touchableInactive
    ) {
      //Go back from "select region" page to "select country"
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ countryHasRegion: false }),
        ANIMATION_TIME
      );
      setTimeout(
        () => this.setState({ selectedCountryHadRegion: false }),
        ANIMATION_TIME
      );
      setTimeout(() => this.setState({ selectedRegion: -1 }), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with countrys to start at India when selected and goind back from next screen.
      setTimeout(
        () => this.setState({ index: this.state.index + 1 }),
        ANIMATION_TIME
      ); //HACK!!! - Testing, to get the flatlist with countrys to start at India when selected and goind back from next screen.
      setTimeout(
        () =>
          this.setState({
            towardsNextIndex: this.state.towardsNextIndex - 1 / 3
          }),
        ANIMATION_TIME
      );
      this.opacity();
    } else if (
      this.state.index == 3 &&
      this.state.selectedCountryHadRegion == false &&
      this.state.countryHasRegion == true &&
      !this.touchableInactive
    ) {
      //Go back from "Are you a healthcare worker" to "select region" page
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      );
      setTimeout(
        () => this.setState({ towardsNextIndex: 2 / 3 }),
        ANIMATION_TIME
      );
      setTimeout(
        () => this.setState({ selectedCountryHadRegion: true }),
        ANIMATION_TIME
      );
      this.opacity();
    } else if (
      this.state.index == 3 &&
      this.state.selectedRegionHadDistrict == false &&
      this.state.regionHasDistrict == true &&
      !this.touchableInactive
    ) {
      //Go back from "Are you a healthcare worker" to "select discrict" page
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      );
      setTimeout(
        () => this.setState({ selectedRegionHadDistrict: true }),
        ANIMATION_TIME
      );
      this.opacity();
    } else if (
      this.state.index == 3 &&
      this.state.selectedCountryHadRegion == false &&
      this.state.countryHasRegion == false &&
      !this.touchableInactive
    ) {
      //If you are on "Are you a healthcare worker" and the "selected country" has no regions, when go back to "select country", and not "regions"
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      );
      this.opacity();
    } else if (this.state.index == 0) {
      //Go back to Onboarding presentation screen
      this.props.navigation.goBack(null);
    } else if (!this.touchableInactive) {
      //Go back one index in the survey, if you are not in one of the above situations
      this.touchableInactive = true;
      setTimeout(() => (this.touchableInactive = false), ANIMATION_TIME);
      setTimeout(() => this.opacity_test(), ANIMATION_TIME);
      setTimeout(
        () => this.setState({ index: this.state.index - 1 }),
        ANIMATION_TIME
      );
      this.opacity();
      if (
        this.state.selectedCountry > 1 &&
        this.state.isDeviceShared === true
      ) {
        //When going back from Select Country and the device is a shared device, then reset the one the user selected before
        setTimeout(
          () => this.setState({ selectedCountry: -1 }),
          ANIMATION_TIME
        );
      }
    }
  }

  goToDownloadInfo() {
    this.props.navigation.navigate('DownloadInfoScreen', {
      header: null,
      hideDownloadProgress: this.props.isPreBuild ? true : false
    });
  }

  renderCountrylist() {
    const opacityView = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0]
    });

    const countriesList = this.nativeCountriesList.map((country, index) => {
      return { country, index };
    });

    return (
      <FlatList
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        data={countriesList}
        extraData={this.state} //Trigger flatlist to re render when State is set. (FlatList is a Pure Component)
        renderItem={({ item, index }) => {
          return (
            <View>
              <TouchableOpacity
                onPress={
                  this.state.disabled
                    ? () => console.log('locked')
                    : () => this._onCountry(item.country, index)
                }
              >
                <Animated.View
                  style={{
                    opacity:
                      this.state.selectedCountry == index ? 1 : opacityView,
                    height: 60,
                    padding: 8,
                    flexDirection: 'column'
                  }}
                >
                  <AppText
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        this.state.selectedCountry == index ? '500' : 'normal'
                    }}
                  >
                    {item.country.native}
                  </AppText>
                  <AppText
                    style={{
                      fontSize: ColorTheme.FONT_SIZE * 0.7,
                      marginTop: 2,
                      textAlign: 'center',
                      fontWeight:
                        this.state.selectedCountry == index ? '500' : 'normal'
                    }}
                  >
                    {item.country.name}
                  </AppText>
                  <View
                    style={{
                      marginTop: 4,
                      borderBottomWidth: 1,
                      borderRadius: 20,
                      borderBottomColor:
                        this.state.selectedCountry == index
                          ? ColorTheme.PRIMARY
                          : ColorTheme.TERTIARY
                    }}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          );
        }}
        initialScrollIndex={
          this.state.selectedCountry == -1 ? 0 : this.state.selectedCountry
        }
        getItemLayout={(countriesList, index) => ({
          length: 60,
          offset: 60 * index,
          index
        })}
        keyExtractor={(item) => item.index}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  renderStates(regions) {
    const opacityView = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0]
    });

    return (
      <FlatList
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        data={regions}
        extraData={this.state} //Trigger flatlist to re render when State is set. (FlatList is a Pure Component)
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              onPress={
                this.state.disabled
                  ? () => console.log('locked')
                  : () => this._onRegion(item, index)
              }
            >
              <Animated.View
                style={{
                  opacity: this.state.selectedRegion == index ? 1 : opacityView,
                  height: 50,
                  padding: 8,
                  flexDirection: 'column'
                }}
              >
                <AppText
                  style={{
                    textAlign: 'center',
                    fontWeight:
                      this.state.selectedRegion == index ? '500' : 'normal'
                  }}
                >
                  {item.native}
                </AppText>
                <AppText
                  style={{
                    fontSize: ColorTheme.FONT_SIZE * 0.7,
                    marginTop: 2,
                    textAlign: 'center',
                    fontWeight:
                      this.state.selectedRegion == index ? '500' : 'normal'
                  }}
                >
                  {item.name}
                </AppText>
                <View
                  style={{
                    marginTop: 4,
                    borderBottomWidth: 1,
                    borderRadius: 20,
                    borderBottomColor:
                      this.state.selectedRegion == index
                        ? ColorTheme.PRIMARY
                        : ColorTheme.TERTIARY
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
        initialScrollIndex={
          this.state.selectedRegion == -1 ? 0 : this.state.selectedRegion
        }
        getItemLayout={(regions, index) => ({
          length: 50,
          offset: 50 * index,
          index
        })}
        keyExtractor={(item) => item.index}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  renderDistricts(districts) {
    const opacityView = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0]
    });

    return (
      <FlatList
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        data={districts}
        extraData={this.state} //Trigger flatlist to re render when State is set. (FlatList is a Pure Component)
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              onPress={
                this.state.disabled
                  ? () => console.log('locked')
                  : () => this._onDiscrict(item, index)
              }
            >
              <Animated.View
                style={{
                  opacity:
                    this.state.selectedDistrict == index ? 1 : opacityView,
                  height: 50,
                  padding: 8,
                  flexDirection: 'column'
                }}
              >
                <AppText
                  style={{
                    textAlign: 'center',
                    fontWeight:
                      this.state.selectedDistrict == index ? '500' : 'normal'
                  }}
                >
                  {item.native}
                </AppText>
                <AppText
                  style={{
                    fontSize: ColorTheme.FONT_SIZE * 0.7,
                    marginTop: 2,
                    textAlign: 'center',
                    fontWeight:
                      this.state.selectedDistrict == index ? '500' : 'normal'
                  }}
                >
                  {item.name}
                </AppText>
                <View
                  style={{
                    marginTop: 4,
                    borderBottomWidth: 1,
                    borderRadius: 20,
                    borderBottomColor:
                      this.state.selectedDistrict == index
                        ? ColorTheme.PRIMARY
                        : ColorTheme.TERTIARY
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
        initialScrollIndex={
          this.state.selectedDistrict == -1 ? 0 : this.state.selectedDistrict
        }
        getItemLayout={(districts, index) => ({
          length: 50,
          offset: 50 * index,
          index
        })}
        keyExtractor={(item) => item.index}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  renderCountryAndRegion() {
    if (this.state.countryHasRegion && this.state.regionHasDistrict !== true) {
      return (
        <View
          style={{
            backgroundColor: ColorTheme.WHITE,
            borderRadius: 5,
            borderColor: ColorTheme.PRIMARY,
            borderWidth: 1,
            flex: 1
          }}
        >
          {this.renderStates(this.state.regionsListTest)}
        </View>
      );
    } else if (this.state.regionHasDistrict) {
      return (
        <View
          style={{
            backgroundColor: ColorTheme.WHITE,
            borderRadius: 5,
            borderColor: ColorTheme.PRIMARY,
            borderWidth: 1,
            flex: 1
          }}
        >
          {this.renderDistricts(this.state.districtListTest)}
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: ColorTheme.WHITE,
            borderRadius: 5,
            borderColor: ColorTheme.PRIMARY,
            borderWidth: 1,
            flex: 1
          }}
        >
          {this.renderCountrylist()}
        </View>
      );
    }
  }

  goToDownload() {
    this.props.navigation.navigate('DownloadInfoScreen', {});
  }

  getOnb(array, lang) {
    let onboardingScreens = [];
    for (item in array) {
      if (array[item].id) {
        onboardingScreens.push(lang[array[item].id]);
      } else onboardingScreens.push(lang[array[item]]);
    }
    return onboardingScreens;
  }

  getOnbDeliveries() {
    const { getTextFromCMS } = this.props;

    let onboardingScreens = [];

    const diliveriQuestion = getTextFromCMS(
      'upq:question_3',
      'how many deliveries did you assist last month?'
    );
    const diliveriAnswer1 = getTextFromCMS('upq:question_3_answer_1', 'none');
    const diliveriAnswer2 = getTextFromCMS(
      'upq:question_3_answer_2',
      '_1 - 25'
    );
    const diliveriAnswer3 = getTextFromCMS(
      'upq:question_3_answer_3',
      '_26 - 50'
    );
    const diliveriAnswer4 = getTextFromCMS(
      'upq:question_3_answer_4',
      'more than 50'
    );
    const lastThankYouScreenHeader = getTextFromCMS(
      'onb:onboarding_screen_finish_survey_header',
      'thank you for finishing our survey!'
    );

    onboardingScreens.push({
      question: diliveriQuestion,
      answers: [
        diliveriAnswer1,
        diliveriAnswer2,
        diliveriAnswer3,
        diliveriAnswer4
      ]
    }); //Push the "How many deliveries" question to onboardingScreens array.
    onboardingScreens.push({ question: lastThankYouScreenHeader, answers: [] }); //Push the last "Thank you for finishing our survey" screen to the end of the onboardingScreens array.

    return onboardingScreens;
  }

  skipQuestion() {
    //Set the date to 1 next month at 18:30
    let dateToShowDeliveriesQuestion = moment()
      .add(1, 'month')
      .startOf('month');
    dateToShowDeliveriesQuestion.set('hour', 18);
    dateToShowDeliveriesQuestion.set('minute', 30);

    // this.props.dispatch(setDeliveriesQuestionDate(dateToShowQuestionIn30Days));
    this.props.dispatch(
      setDeliveriesQuestionDate(dateToShowDeliveriesQuestion.valueOf())
    );
    this.props.navigation.pop();
  }

  renderCountryRegionDiscrictHeader(questions) {
    //Detirmine wich header to use, if the user selects a country that has a state and district

    const { getTextFromCMS } = this.props;

    let questionHeader = '';

    if (
      this.state.selectedCountryHadRegion === true &&
      this.state.selectedRegionHadDistrict === false
    ) {
      questionHeader = getTextFromCMS(
        'onb:onboarding_screen_select_state',
        'please select a state'
      );
    } else if (
      this.state.selectedRegionHadDistrict === true &&
      this.state.selectedCountryHadRegion === true
    ) {
      questionHeader = getTextFromCMS(
        'onb:onboarding_screen_select_district',
        'please select a district'
      );
    } else {
      questionHeader = questions;
    }

    return questionHeader;
  }

  skipOnboarding(lastEntryOfArray) {
    this.props.dispatch(approveDisclaimer()); //Acceps the terms of use!
    // this.props.dispatch(answeredSurvey()); //User has finished survey
    this.setState({ index: lastEntryOfArray }); //Go to end og onboarding
  }

  render() {
    const { language, onboarding, getTextFromCMS, downloadState } = this.props;
    const { status } = downloadState;

    const from = this.props.navigation.getParam('from'); // To determin where this screen is loaded from, for validating use later on

    const opacity = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1, 0]
    });

    const opacityView = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0]
    });

    const _progress =
      this.props.progress === undefined ? 0 : this.props.progress;
    const _downloadLanguage = this.props.navigation.getParam(
      'downloadLanguage'
    );
    const _downloadIndigatorRunning =
      _downloadLanguage !== undefined
        ? getTextFromCMS('downloading_1', 'downloading') +
          ' - ' +
          _downloadLanguage
        : getTextFromCMS('downloading_1', 'downloading') +
          ' - ' +
          language.description;
    const _downloadIndigatorDone =
      _downloadLanguage !== undefined
        ? null
        : getTextFromCMS(
            'onb:onboarding_screen_dowload_finished_header',
            'download complete'
          );
    const downloadIndigatorHeader =
      _progress < 100 ? _downloadIndigatorRunning : _downloadIndigatorDone;

    const onboardingScreens =
      from === 'AppLoadingScreen' || from === 'index'
        ? this.getOnbDeliveries()
        : this.getOnb(onboarding, language); //Get the values from all the onboarding screens in the CMS, or just the ones for the "Now many deliveries" question
    let surveyProgressBarSize = onboardingScreens.length; //Set the length of the ResponsiveProgressBar
    let lastEntryOfArray = onboardingScreens.length;

    //If in __DEV__ mode, and the skip onboarding button is pressed, then index to the last sceen
    {
      this.props.navigation.getParam('skipOnbarding') === true &&
      this.state.index === 0
        ? this.skipOnboarding(lastEntryOfArray)
        : null;
    }

    let surveyProgress = this.state.index + this.state.towardsNextIndex;

    if (from !== 'AppLoadingScreen' || from === 'index') {
      //Push the "Thank you" screen to the onboardingScreens array, if we are on normal Onboarding
      const lastThankYouScreenHeader = getTextFromCMS(
        'onb:onboarding_screen_finish_survey_header',
        'thank you for finishing our survey!'
      );
      onboardingScreens.push({
        question: lastThankYouScreenHeader,
        answers: []
      });
    }

    let questions = onboardingScreens[this.state.index].question; //Generate the question from the state.index

    let questionHeader =
      this.renderCountryRegionDiscrictHeader(questions) || ''; //Render the correct header. Ie. if country has region/district or not
    const answers = onboardingScreens[this.state.index].answers.map(
      (answer, index) => {
        //Render all the answers from the CMS, or just the ones for the Diliveries question
        return (
          <View
            pointerEvents={this.state.disabled ? 'none' : 'auto'}
            key={`answer${this.state.index}_${index}`}
            style={{ marginTop: 8, marginBottom: 8 }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={this.props.disabled}
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                this.setState({ selected: index });
                this._onRadioChecked(
                  index,
                  lastEntryOfArray,
                  answer,
                  onboardingScreens[this.state.index].id,
                  from
                );
              }}
            >
              <Animated.View
                style={{
                  opacity:
                    this.state.selected == index || this.state.disabled == false
                      ? 1
                      : opacityView,
                  flexDirection: 'row'
                }}
              >
                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                  <AnimatedRadioButton
                    ref={index}
                    checked={index === this.state.selected}
                    tintColor={ColorTheme.PRIMARY}
                    disabledColor={ColorTheme.SEPARATOR}
                    disabled={this.props.disabled}
                  />
                </View>
              </Animated.View>
              <Animated.Text
                style={{
                  opacity:
                    this.state.selected == index || this.state.disabled == false
                      ? 1
                      : opacityView,
                  fontSize: 20,
                  flex: 1,
                  flexWrap: 'wrap',
                  fontWeight: this.state.selected == index ? '500' : 'normal'
                }}
              >
                {[answer]}
              </Animated.Text>
            </TouchableOpacity>
          </View>
        );
      }
    );

    const justifyContentByIndex =
      this.state.index === lastEntryOfArray ||
      ((from === 'AppLoadingScreen' || from === 'index') &&
        this.state.index === 1)
        ? 164
        : 0; //Move the header text down, if we are on the "Thank you" screen.

    const singleStackTopMargin =
      from === 'AppLoadingScreen' || from === 'index' ? 44 : 0; //Move the header text down if we are on the "Delivieries" question screen. Becourse this will have no navigation header.
    const skipButtonLabel = getTextFromCMS(
      'onb:onboarding_deliveries_bTn_label',
      'skip'
    );

    return (
      <View style={styles.mainContainer}>
        <Animated.View
          style={{
            margin: 32,
            marginTop: justifyContentByIndex,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: opacity
          }}
        >
          <AppText
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 20,
              marginTop: singleStackTopMargin
            }}
          >
            {questionHeader}
          </AppText>
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            marginBottom: 24,
            justifyContent: 'center',
            marginLeft: 20,
            marginRight: 20,
            fontSize: 22,
            opacity: opacity
          }}
        >
          {(from === 'AppLoadingScreen' || from === 'index') &&
          this.state.index === 0 ? (
            <Picker
              selectedValue={this.state.selectedDeliveriesAnswer}
              onValueChange={(itemValue) =>
                this.setState({ selectedDeliveriesAnswer: itemValue })
              }
            >
              <Picker.Item label='Select a Value' value='-1' />
              {Array.from(Array(20).keys()).map((el) => (
                <Picker.Item label={String(el)} value={String(el)} />
              ))}
              <Picker.Item label='20+' value='20+' />
            </Picker>
          ) : this.state.index == 2 ? (
            this.renderCountryAndRegion()
          ) : (
            answers
          )}
        </Animated.View>
        {this.state.loadDownloadScreen === true && this.goToDownloadInfo()}
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          {(from === 'AppLoadingScreen' || from === 'index') &&
            this.state.index === 0 && (
              <FramedButton
                label={getTextFromCMS('next', 'next')}
                onPress={() => {
                  //Set the date to 1 next month at 18:30
                  let dateToShowDeliveriesQuestion = moment().add(7, 'days');
                  dateToShowDeliveriesQuestion.set('hour', 18);
                  dateToShowDeliveriesQuestion.set('minute', 30);
                  if (from === 'AppLoadingScreen' || from === 'index') {
                    //If this screen is loaded from "AppLoadingScreen", then it is the "Deliveries" question that is rendered.
                    setTimeout(
                      () => this.setState({ index: this.state.index + 1 }),
                      ANIMATION_TIME
                    );
                    // this.props.dispatch(setDeliveriesQuestionDate(dateToShowQuestionIn30Days));
                    this.props.dispatch(
                      setDeliveriesQuestionDate(
                        dateToShowDeliveriesQuestion.valueOf()
                      )
                    );
                    setTimeout(() => this.props.navigation.pop(), 1500);
                    return;
                  }
                }}
                disabled={this.state.selectedDeliveriesAnswer === -1}
              />
            )}
          {from === 'AppLoadingScreen' || from === 'index' ? null : (
            <ResponsiveProgressBar
              progress={surveyProgress}
              duration={250}
              size={surveyProgressBarSize}
              color={ColorTheme.PRIMARY}
              style={[
                styles.indicator,
                { backgroundColor: ColorTheme.TERTIARY }
              ]}
              hideProgressText={true}
            />
          )}
        </View>
        {(from === 'AppLoadingScreen' || from === 'index') &&
        this.state.index === 0 ? (
          <Animated.View
            opacity={opacityView}
            style={{
              margin: 12,
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 35,
                width: 80
              }}
              onPress={() => this.skipQuestion()}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <AppText
                  style={{
                    color: ColorTheme.PRIMARY,
                    fontSize: ColorTheme.FONT_SIZE
                  }}
                >
                  {skipButtonLabel}
                </AppText>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ) : null}
        {from === 'AppLoadingScreen' || from === 'index' ? null : (
          <DownloadIndicator
            language={language.description}
            isVisible={status !== 'idle'}
            onPress={() => this.goToDownload()}
            progress={this.props.progress}
            width={250}
            text={downloadIndigatorHeader}
          />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { selectedLang, contentByLanguage, currentUser, userProfiles } = state;
  const { screen } = contentByLanguage[selectedLang];
  const language = contentByLanguage[selectedLang];
  const onboarding = contentByLanguage[selectedLang]['onboarding'] || [];
  const isPreBuild = state.isPreBuild;
  const OnboardingArray = onboarding.map((a) => {
    return contentByLanguage[selectedLang][a.id];
  });

  return {
    screen,
    language,
    currentUser,
    onboarding,
    OnboardingArray,
    downloadState: state.downloadReducer,
    progress: getDownloadPercentage(state.downloadReducer),
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    isPreBuild
  };
}
export default connect(mapStateToProps)(UserSurveyQuestionsScreen);
