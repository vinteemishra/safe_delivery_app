import React from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import AppText from '../Components/AppText';
import FramedButton from '../Components/FramedButton';
import ListHeader from '../Components/ListHeader';
import ColorTheme from '../Constants/ColorTheme';

class DeleteUserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.user ? (
      <ScrollView>
        <ListHeader>
          <AppText>Delete User</AppText>
        </ListHeader>
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
            <AppText
              style={{
                color: ColorTheme.PRIMARY,
                fontSize: ColorTheme.FONT_SIZE * 0.95
              }}
            >
              Do you really want to delete your profile?
            </AppText>
            <AppText
              style={{ marginTop: 20, marginBottom: 5, fontWeight: 'bold' }}
            >
              You are logged in as:
            </AppText>
            <AppText style={{ fontWeight: 'bold' }}>
              Username: {this.props.user.profileName}
            </AppText>
            <AppText style={{ marginTop: 5, fontWeight: 'bold' }}>
              {this.props.user.method}: {this.props.user.profileEmail}
            </AppText>
            <AppText
              style={{
                color: ColorTheme.PRIMARY,
                fontSize: ColorTheme.FONT_SIZE * 0.95,
                marginTop: 30
              }}
            >
              Once your delete your profile,
            </AppText>
            {[
              'Your personalized data - Username and Email will be deleted from our systems',
              'You will not be able to login using the above credentials, until you create your profile again which will be treated as new',
              'All the profile data will be deleted and cannot be recovered back',
              'You would loose your learning track. You will not be able to generate /re-generate your completion certificate'
            ].map((el, index) => {
              return (
                <AppText
                  style={{
                    color: ColorTheme.PRIMARY,
                    fontSize: ColorTheme.FONT_SIZE * 0.95,
                    marginTop: 20
                  }}
                >
                  {index + 1}.) {el}
                </AppText>
              );
            })}
          </View>
          <AppText
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginHorizontal: 20,
              marginVertical: 10
            }}
          >
            Do you really want to proceed?
          </AppText>
          <FramedButton
            label='Yes'
            onPress={() =>
              this.props.navigation.navigate('ConfirmDeletProfile')
            }
          />
          <FramedButton
            style={{ marginBottom: 40 }}
            label='No'
            onPress={() => this.props.navigation.goBack(null)}
          />
        </View>
      </ScrollView>
    ) : null;
  }
}

function mapStateToProps(state) {
  const { currentUser, userProfiles } = state;

  let user = null;
  if (currentUser.currentUser) user = userProfiles[currentUser.currentUser];

  return {
    user,
    currentUser: currentUser.currentUser
  };
}

export default connect(
  mapStateToProps,
  null
)(DeleteUserProfile);
