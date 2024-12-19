import React from 'react';
import { View } from 'react-native';
import AppText from '../Components/AppText';
import UserInputField from '../Components/UserInputField';
import LightBoxModal from '../Components/LightBoxModal';
import FramedButton from '../Components/FramedButton';
import FetchingBox from '../Components/FetchingBox';
import FetchingDoneBox from '../Components/FetchingDoneBox';
import * as helpers from '../Utils/helpers';
import { connect } from 'react-redux';
import ListHeader from '../Components/ListHeader';
import { removeProfile, setCurrentUser } from '../Actions/actions';
import { ENDPOINT_HOST } from '../Config/configProd';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

class ConfirmDeleteProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordError: '',
      submitting: false,
      submittingDone: false,
      submitError: undefined,
      modalVisible: false
    };
  }

  handleSubmitDelete = () => {
    if (this.state.password.length === 0) {
      this.setState({ passwordError: 'Please enter your password' });
    } else {
      this.setState({ submitting: true, submittingDone: false });
      this.logout();
    }
  };

  _getTextFromCMS(screenKey, fallback) {
    return helpers.getTextFromCMS(this.props.screen, screenKey, fallback);
  }

  async logout() {
    let user = this.props.currentUser;
    if (user) {
      await this.invokeDeleteUserProfile();
    } else {
      return;
    }
  }

  async invokeDeleteUserProfile() {
    try {
      const response = await fetch(
        ENDPOINT_HOST(null) + '/api/public/deleteUser',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            id: this.props.user.profileId,
            password: this.state.password
          })
        }
      );

      if (response.status === 200) {
        const json = await response.json();
        if (json.result === 'userDeleted') {
          this.setState({ submittingDone: true, submitError: undefined });
          await sleep(1200); //Halt a bit so the "User logged out" message will show for 1200ms
          this.deleteProfileAndDismiss();
        } else {
          this.setState({
            submitError:
              json.result === 'invalidUserOrPassword'
                ? 'Invalid Credentials'
                : json.result
          });
          setTimeout(() => {
            this.setState({
              submitting: false,
              submitError: undefined
            });
          }, 1000);
        }
      } else {
        this.setState({
          submitError: 'Something went wrong. Please try again later.'
        });
        setTimeout(() => {
          this.setState({
            submitting: false,
            submitError: undefined
          });
        }, 1000);
      }
    } catch (error) {
      this.setState({
        submitError:
          (error && error.message) ||
          'Something went wrong. Please try again later.'
      });
      setTimeout(() => {
        this.setState({
          submitting: false,
          submitError: undefined
        });
      }, 1000);
    }
  }

  async deleteProfileAndDismiss() {
    this.props.removeProfile(this.props.currentUser);
    this.props.setCurrentUser(null);
    this.setState({
      submitting: false,
      submitError: undefined
    });
    await sleep(200);
    this.props.navigation.navigate('SettingsHome');
  }

  render() {
    return (
      <View>
        <ListHeader>
          <AppText>Delete User</AppText>
        </ListHeader>
        <View style={{ minHeight: 400, padding: 20, backgroundColor: 'white' }}>
          <AppText style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Enter Your Password to Confirm Delete Your Account
          </AppText>
          <View style={{ marginVertical: 50 }}>
            <UserInputField
              secureTextEntry={true}
              style={{ flex: 1 }}
              placeholder={'Password'}
              onChangeText={(password) =>
                this.setState({ password, passwordError: '' })
              }
              value={this.state.password}
              error_message={this.state.passwordError}
            />
          </View>
          <FramedButton
            label='Confirm'
            onPress={() => this.handleSubmitDelete()}
          />
          <FramedButton
            style={{ marginBottom: 40 }}
            label='Go Back'
            onPress={() => this.props.navigation.goBack(null)}
          />

          <LightBoxModal
            visible={this.state.submitting}
            floatingCloseButtonVisible={false}
            onModalHide={() => console.log('Modal hidden')}
          >
            {this.state.submitting &&
              !this.state.submittingDone &&
              !this.state.submitError && (
                <FetchingBox loadingText={'Deleting User Profile'} />
              )}
            {this.state.submitError && (
              <AppText style={{ padding: 50, textAlign: 'center' }}>
                {this.state.submitError}
              </AppText>
            )}
            {this.state.submittingDone && (
              <FetchingDoneBox
                fetchingDoneHeader={
                  'Your user profile has been deleted successfully'
                }
                fetchingErrorStatus={this.state.submitError}
                fetchingErrorHeader={this.props.getTextFromCMS(
                  'lp:error',
                  'error'
                )}
              />
            )}
          </LightBoxModal>
        </View>
      </View>
    );
  }
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

const mapDispatchToProps = (dispatch) => ({
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
)(ConfirmDeleteProfile);
