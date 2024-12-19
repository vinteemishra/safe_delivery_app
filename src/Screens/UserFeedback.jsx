import React, { Component } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert
} from 'react-native';
import AppText from '../Components/AppText';
import RadioButton from '../Components/RadioButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLOR } from '../Constants/Constants';
import FramedButton from '../Components/FramedButton';
import { getFont } from '../Utils/helpers';
import { connect } from 'react-redux';
import FetchingDoneBox from '../Components/FetchingDoneBox';
import FetchingBox from '../Components/FetchingBox';
import LightBoxModal from '../Components/LightBoxModal';
import * as helpers from '../Utils/helpers';
import AnimatedAvoidKeyboardContainer from '../Components/AnimatedAvoidKeyboardContainer';
import { ENDPOINT_HOST } from '../Config/config';
import StarComponent from '../Components/StarComponent';
import { analytics } from '../Utils/analytics';

class UserFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pronoun: undefined,
      ageBracket: undefined,
      openAgeBracket: false,
      usageReason: undefined,
      openUsageReason: undefined,
      rating: 0,
      review: '',
      myLearningReview: undefined,
      openMyLearningReview: false,
      contentToBeIncluded: undefined,
      openContentToBeIncluded: false,
      usefulModules: [],
      openUsefulModulesDropDown: false,
      submitting: false,
      submitError: undefined,
      submittingDone: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  showAlert = (message) =>
    Alert.alert('User Feedback', message, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);

  async submitFeedback(payload) {
    console.log('Submitting payload: ', payload);
    const fetchOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(payload)
    };

    const response = await fetch(
      `${ENDPOINT_HOST()}/api/public/feedback`,
      fetchOptions
    );
    return response;
  }

  async handleSubmit() {
    const {
      rating,
      review,
      myLearningReview,
      contentToBeIncluded,
      usefulModules,
      pronoun,
      ageBracket,
      usageReason
    } = this.state;
    const { getTextFromCMS } = this.props;

    if (!pronoun) {
      this.showAlert(
        getTextFromCMS('ufq:invalid_pronoun', 'Please share your pronoun')
      );
    } else if (!ageBracket) {
      this.showAlert(
        getTextFromCMS('ufq:invalid_pronoun', 'Please share your Age bracket')
      );
    } else if (!usageReason) {
      this.showAlert(
        getTextFromCMS(
          'ufq:invalid_usage_reason',
          'Please share your usage reason'
        )
      );
    } else if (!contentToBeIncluded) {
      this.showAlert(
        getTextFromCMS(
          'ufq:invalid_content_to_be_added',
          'Please share the content you think should be included'
        )
      );
    } else if (!usefulModules || usefulModules.length === 0) {
      this.showAlert(
        getTextFromCMS(
          'ufq:invalid_useful_modules',
          'Please share the modules you find useful'
        )
      );
    } else if (!myLearningReview) {
      this.showAlert(
        getTextFromCMS(
          'ufq:invalid_my_learning_review',
          'Please share your my learning review'
        )
      );
    } else if (rating === 0) {
      this.showAlert(
        getTextFromCMS('ufq:invalid_review', 'Please share your rating')
      );
    } else {
      this.setState({ submitting: true });
      var { appId } = analytics;
      if (!appId) {
        await analytics.getAppId();
      }
      appId = analytics.appId;

      const payload = {
        pronoun,
        ageBracket,
        usageReason,
        rating,
        review,
        myLearningReview,
        contentToBeIncluded,
        usefulModules: usefulModules.join(', '),
        appId
      };

      var submitResponse = await this.submitFeedback(payload).catch((error) => {
        this.setState({ submitting: false });
      });

      if (submitResponse.status === 200) {
        this.setState({ submittingDone: true });
        setTimeout(() => {
          this.setState({ submitting: false });
          this.props.navigation.goBack(null);
        }, 2000);
      } else {
        this.showAlert(
          getTextFromCMS(
            'ufq:feedback_unable',
            'Unable to send feedback. Please try again later'
          )
        );
      }
    }
  }

  render() {
    const {
      pronoun,
      ageBracket,
      openAgeBracket,
      openUsageReason,
      usageReason,
      review,
      myLearningReview,
      openMyLearningReview,
      openContentToBeIncluded,
      contentToBeIncluded,
      usefulModules,
      openUsefulModulesDropDown
    } = this.state;
    const { modulesList } = this.props;
    const headerStyle = {
      marginTop: 20,
      marginBottom: 5,
      fontWeight: 'bold',
      flex: 10
    };

    const dropDownContainerStyle = { marginTop: 12.5, marginBottom: 15 };
    const { getTextFromCMS } = this.props;

    return (
      <AnimatedAvoidKeyboardContainer>
        <ScrollView nestedScrollEnabled={true}>
          <View style={{ marginHorizontal: 15, paddingBottom: 30 }}>
            <AppText style={headerStyle}>
              {getTextFromCMS('ufq:pronouns', 'What are your pronouns?')}
            </AppText>
            <View style={{ flexDirection: 'column' }}>
              {[
                {
                  label: getTextFromCMS('ufq:ans1_pronouns', 'She/Her'),
                  value: "'She/Her'"
                },
                {
                  label: getTextFromCMS('ufq:ans2_pronouns', 'He/Him'),
                  value: 'He/Him'
                },
                {
                  label: getTextFromCMS('ufq:ans3_pronouns', 'They/Them'),
                  value: 'They/Them'
                },
                {
                  label: getTextFromCMS(
                    'ufq:ans4_pronouns',
                    'Prefer Not To Say'
                  ),
                  value: 'Prefer Not To Say'
                }
              ].map((el, index) => (
                <TouchableOpacity
                  style={{ flexDirection: 'row', marginVertical: 10 }}
                  key={`pronoun-${el.label}-${index}`}
                  onPress={() => this.setState({ pronoun: el.value })}
                >
                  <RadioButton selected={pronoun === el.value} />
                  <AppText style={{ marginLeft: 10 }}>{el.label}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ zIndex: 10 }}>
              <AppText style={headerStyle}>
                {this.props.getTextFromCMS(
                  'ufq:agebracket',
                  'Age Bracket here'
                )}
              </AppText>
              <DropDownPicker
                listItemLabelStyle={{ fontFamily: getFont() }}
                placeholderStyle={{ fontFamily: getFont() }}
                placeholder={
                  ageBracket ||
                  getTextFromCMS('ufq:select_a_value', 'Select a Value')
                }
                open={openAgeBracket}
                listMode='SCROLLVIEW'
                value={ageBracket}
                containerStyle={dropDownContainerStyle}
                closeAfterSelecting={true}
                zIndex={openAgeBracket ? 100 : 1}
                items={[
                  {
                    label: getTextFromCMS('ufq:ans1_agebracket', 'Under 18'),
                    value: 'Under 18'
                  },
                  {
                    label: getTextFromCMS('ufq:ans2_agebracket', '18 - 25'),
                    value: '18 - 25'
                  },
                  {
                    label: getTextFromCMS('ufq:ans3_agebracket', '26 - 35'),
                    value: '26 - 35'
                  },
                  {
                    label: getTextFromCMS('ufq:ans4_agebracket', '36 - 45'),
                    value: '36 - 45'
                  },
                  {
                    label: getTextFromCMS('ufq:ans5_agebracket', '46 - 55'),
                    value: '46 - 55'
                  },
                  {
                    label: getTextFromCMS('ufq:ans6_agebracket', '56+'),
                    value: '56+'
                  }
                ]}
                setOpen={() =>
                  this.setState({
                    openAgeBracket: !openAgeBracket,
                    openContentToBeIncluded: false,
                    openUsageReason: false,
                    openMyLearningReview: false,
                    openUsefulModulesDropDown: false
                  })
                }
                setValue={(callback) => {
                  this.setState((state) => ({
                    ageBracket: callback(state.ageBracket)
                  }));
                }}
              />
              <AppText style={headerStyle}>
                {getTextFromCMS(
                  'ufq:useofapp',
                  'How do you mostly use the App?'
                )}
              </AppText>
              <DropDownPicker
                listItemLabelStyle={{ fontFamily: getFont() }}
                placeholderStyle={{ fontFamily: getFont() }}
                listMode='SCROLLVIEW'
                placeholder={
                  usageReason ||
                  getTextFromCMS('ufq:select_a_value', 'Select a Value')
                }
                containerStyle={dropDownContainerStyle}
                zIndex={openUsageReason ? 100 : 1}
                open={openUsageReason}
                value={usageReason}
                closeAfterSelecting={true}
                onSelectItem={(value) =>
                  usageReason !== value.label &&
                  this.setState({ usageReason: value.label })
                }
                items={[
                  {
                    label: getTextFromCMS(
                      'ufq:ans1_useofapp',
                      'Self-studying at home to retain knowledge'
                    ),
                    value: 'Self-studying at home to retain knowledge'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans2_useofapp',
                      'Self-studying to get professional development credit'
                    ),
                    value:
                      'Self-studying to get professional development credit'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans3_useofapp',
                      'On the job as a look-up tool'
                    ),
                    value: 'On the job as a look-up tool'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans4_useofapp',
                      'For studying/pre-service'
                    ),
                    value: 'For studying/pre-service'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans5_useofapp',
                      'As part of mentoring activities'
                    ),
                    value: 'As part of mentoring activities'
                  },
                  {
                    label: getTextFromCMS('ufq:ans6_useofapp', 'Other'),
                    value: 'Other'
                  }
                ].map((el) => ({ ...el, value: el.label }))}
                setOpen={() =>
                  this.setState({
                    openAgeBracket: false,
                    openContentToBeIncluded: false,
                    openUsageReason: !openUsageReason,
                    openMyLearningReview: false,
                    openUsefulModulesDropDown: false
                  })
                }
                setValue={(callback) => {
                  this.setState((state) => ({
                    usageReason: callback(state.usageReason)
                  }));
                }}
              />
              <AppText style={headerStyle}>
                {getTextFromCMS(
                  'ufq:contentToadd',
                  'What content would you like to see included in the App?'
                )}
              </AppText>
              <DropDownPicker
                listItemLabelStyle={{ fontFamily: getFont() }}
                placeholderStyle={{ fontFamily: getFont() }}
                listMode='SCROLLVIEW'
                zIndex={openContentToBeIncluded ? 100 : 1}
                containerStyle={dropDownContainerStyle}
                placeholder={
                  contentToBeIncluded ||
                  getTextFromCMS('ufq:select_a_value', 'Select a Value')
                }
                open={openContentToBeIncluded}
                value={contentToBeIncluded}
                closeAfterSelecting={true}
                items={[
                  {
                    label: getTextFromCMS(
                      'ufq:ans1_contentToadd',
                      'Breastfeeding'
                    ),
                    value: 'Breastfeeding'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans2_contentToadd',
                      'Shoulder dystocia'
                    ),
                    value: 'Shoulder dystocia'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans3_contentToadd',
                      'Cord prolapse'
                    ),
                    value: 'Cord prolapse'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans4_contentToadd',
                      'Breech Delivery'
                    ),
                    value: 'Breech Delivery'
                  },
                  {
                    label: getTextFromCMS('ufq:ans5_contentToadd', 'Suturing'),
                    value: 'Suturing'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans6_contentToadd',
                      'Obstetric Fistula'
                    ),
                    value: 'Obstetric Fistula'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans7_contentToadd',
                      'Mental Health'
                    ),
                    value: 'Mental Health'
                  },
                  {
                    label: getTextFromCMS('ufq:ans8_contentToadd', 'Diabetes'),
                    value: 'Diabetes'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans9_contentToadd',
                      'Antenatal and Postnatal Care'
                    ),
                    value: 'Antenatal and Postnatal Care'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans10_contentToadd',
                      'Twin Delivery'
                    ),
                    value: 'Twin Delivery'
                  }
                ]}
                setOpen={() =>
                  this.setState({
                    openAgeBracket: false,
                    openContentToBeIncluded: !openContentToBeIncluded,
                    openUsageReason: false,
                    openMyLearningReview: false,
                    openUsefulModulesDropDown: false
                  })
                }
                setValue={(callback) => {
                  this.setState((state) => ({
                    contentToBeIncluded: callback(state.contentToBeIncluded)
                  }));
                }}
              />
              {modulesList && modulesList.length > 0 && (
                <>
                  <AppText style={headerStyle}>
                    {getTextFromCMS(
                      'ufq:listofmodules',
                      'Which two modules do you find most useful?'
                    )}
                  </AppText>
                  <DropDownPicker
                    listItemLabelStyle={{ fontFamily: getFont() }}
                    placeholderStyle={{ fontFamily: getFont() }}
                    listMode='SCROLLVIEW'
                    multipleText={getTextFromCMS(
                      'ufq:multiple_items_selected',
                      'Multiple items selected'
                    )}
                    placeholder={getTextFromCMS(
                      'ufq:select_a_value',
                      'Select a Value'
                    )}
                    multiple={true}
                    min={0}
                    max={2}
                    containerStyle={dropDownContainerStyle}
                    zIndex={openUsefulModulesDropDown ? 100 : 1}
                    open={openUsefulModulesDropDown}
                    value={usefulModules}
                    items={modulesList || []}
                    setOpen={() =>
                      this.setState({
                        openAgeBracket: false,
                        openContentToBeIncluded: false,
                        openUsageReason: false,
                        openMyLearningReview: false,
                        openUsefulModulesDropDown: !openUsefulModulesDropDown
                      })
                    }
                    setValue={(callback) => {
                      this.setState((state) => {
                        const result = callback(state.usefulModules);
                        return { usefulModules: callback(state.usefulModules) };
                      });
                    }}
                  />
                  {usefulModules.length > 0 && (
                    <AppText>
                      <AppText style={{ fontWeight: 'bold' }}>
                        {getTextFromCMS(
                          'ufq:selected_values',
                          'Selected Values'
                        )}{' '}
                        :{' '}
                      </AppText>
                      {usefulModules.join(', ')}
                    </AppText>
                  )}
                </>
              )}
              <AppText style={headerStyle}>
                {getTextFromCMS(
                  'ufq:mylearning',
                  'What do you think about MyLearning?'
                )}
              </AppText>
              <DropDownPicker
                listMode='SCROLLVIEW'
                zIndex={openMyLearningReview ? 100 : 1}
                containerStyle={dropDownContainerStyle}
                placeholder={
                  myLearningReview ||
                  getTextFromCMS('ufq:select_a_value', 'Select a Value')
                }
                open={openMyLearningReview}
                value={myLearningReview}
                closeAfterSelecting={true}
                placeholderStyle={{ fontFamily: getFont() }}
                labelStyle={{ fontFamily: getFont() }}
                items={[
                  {
                    label: getTextFromCMS(
                      'ufq:ans1_mylearning',
                      'Did not try/start yet/Do not have MyLearning'
                    ),
                    value: 'Did not try/start yet/Do not have MyLearning'
                  },
                  {
                    label: getTextFromCMS('ufq:ans2_mylearning', 'Too easy'),
                    value: 'Too easy'
                  },
                  {
                    label: getTextFromCMS('ufq:ans3_mylearning', 'Easy'),
                    value: 'Easy'
                  },
                  {
                    label: getTextFromCMS('ufq:ans4_mylearning', 'Neutral'),
                    value: 'Neutral'
                  },
                  {
                    label: getTextFromCMS('ufq:ans5_mylearning', 'Difficult'),
                    value: 'Difficult'
                  },
                  {
                    label: getTextFromCMS(
                      'ufq:ans1_mylearning',
                      'Too difficult'
                    ),
                    value: 'Too difficult'
                  }
                ]}
                setOpen={() =>
                  this.setState({
                    openAgeBracket: false,
                    openContentToBeIncluded: false,
                    openUsageReason: false,
                    openMyLearningReview: !openMyLearningReview,
                    openUsefulModulesDropDown: false
                  })
                }
                setValue={(callback) => {
                  this.setState((state) => ({
                    myLearningReview: callback(state.myLearningReview)
                  }));
                }}
              />

              <AppText style={headerStyle}>
                {getTextFromCMS(
                  'ufq:addComments',
                  'Please share any additional feedback, recommendations for improvement or content you might have:'
                )}
              </AppText>
              <TextInput
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={(value) => this.setState({ review: value })}
                style={{
                  borderBottomColor: COLOR.RED,
                  borderBottomWidth: 2,
                  fontSize: 20,
                  lineHeight: 25
                }}
              />
            </View>
            <AppText
              style={{ ...headerStyle, textAlign: 'center', marginTop: 30 }}
            >
              {getTextFromCMS(
                'ufq:rating',
                'Overall, how would you rate the App?'
              )}
            </AppText>
            <StarComponent
              rating={this.state.rating}
              setRating={(value) => this.setState({ rating: value })}
            />

            <FramedButton
              label={getTextFromCMS('ufq:submit', 'Submit')}
              style={{ marginTop: 20 }}
              onPress={this.handleSubmit}
            />
          </View>
          <LightBoxModal
            visible={this.state.submitting}
            floatingCloseButtonVisible={false}
            onModalHide={() => {}}
          >
            {this.state.submitting && !this.state.submittingDone && (
              <FetchingBox
                loadingText={getTextFromCMS(
                  'ufq:submitting_feedback',
                  'Submitting Feedback'
                )}
              />
            )}
            {this.state.submittingDone && (
              <FetchingDoneBox
                fetchingDoneHeader={getTextFromCMS(
                  'ufq:feedback_submitted',
                  'Feedback has been submitted'
                )}
                fetchingErrorStatus={this.state.submitError}
                fetchingErrorHeader={this.props.getTextFromCMS(
                  'lp:error',
                  'error'
                )}
              />
            )}
          </LightBoxModal>
        </ScrollView>
      </AnimatedAvoidKeyboardContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];
  const { modules, screen } = language;
  const modulesList = (modules || []).map((el) => ({
    label: el.description,
    value: el.description
  }));
  return {
    modulesList,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
};

export default connect(
  mapStateToProps,
  null
)(UserFeedback);
