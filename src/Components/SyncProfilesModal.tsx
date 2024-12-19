import * as React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AppText from "../Components/AppText";
import ColorTheme from "../Constants/ColorTheme";
import FramedButton from "../Components/FramedButton";
import { closeModal } from "../Actions/modalActions";
import * as helpers from "../Utils/helpers";
import { StoreState } from "../Reducers/reducers";
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import * as CONSTANTS from "../Constants/Constants";
import {
  syncProfilesStart,
  syncProfilesDone,
  syncProfilesFailed,
  syncProfilesInitial,
} from "../Actions/syncProfilesActions";
import moment from "moment";
import NavigationService from "./NavigationService";
import { ENDPOINT_HOST } from "../Config/config";

interface OwnProps {}

type State = {
  inLockDown: boolean;
  noOnlineUser: boolean;
};

interface PropsFromDispatch {
  closeModal(): void;
  syncProfilesStart(): void;
  syncProfilesDone(): void;
  syncProfilesFailed(): void;
}

interface PropsFromState {
  screen: any;
  syncProfilesReducer?: any;
  userProfiles: any;
  user: any;
  currentUser: any;
  country: string | null;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

class SyncProfilesModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      inLockDown: false,
      noOnlineUser: false,
    };
  }

  private _getTextFromCMS(screenKey, fallback) {
    return helpers.getTextFromCMS(this.props.screen, screenKey, fallback);
  }

  _getOnlineProfiles = (profiles) => {
    let allProfiles = { ...profiles };

    Object.keys(allProfiles).forEach((key) => {
      if (
        !allProfiles[key].profileEmail ||
        allProfiles[key].profileEmail.length === 0
      ) {
        delete allProfiles[key];
      }
    });

    return allProfiles;
  };

  async _updateProfiles(userProfiles) {
    //TODO - This need to be revomed and use the ONE function made for the purpose when the WhatsApp branch is merged over!

    const {
      syncProfilesStart,
      syncProfilesDone,
      syncProfilesFailed,
      country,
    } = this.props;

    syncProfilesStart();

    const onlineUserProfiles = this._getOnlineProfiles(userProfiles);

    try {
      const response = await fetch(
        ENDPOINT_HOST(country) + "/api/public/profiles",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(onlineUserProfiles),
        }
      );

      const json = await response.json();
      if (json) {
        //Set a new timestamp and set isFecthing to false
        syncProfilesDone();
      }
    } catch (error) {
      //Set the isFecthing to false
      syncProfilesFailed();
    } finally {
      //Always get the isFetching to false
      syncProfilesInitial();
      this.setState({ inLockDown: false });
    }
  }

  _handleOnPress(lockSync, userProfiles, lockDownTimer) {
    if (lockSync) {
      return (
        this.setState({ inLockDown: true }),
        setTimeout(() => this.setState({ inLockDown: false }), 30000)
      );
    }

    this._updateProfiles(userProfiles);
  }

  _goToUpgrade() {
    if (this.props.user == undefined) {
      return (
        this.props.closeModal(),
        setTimeout(
          () =>
            NavigationService.navigate("CreateNewUserScreen", {
              title: this._getTextFromCMS(
                "account_setup_title",
                "setup account"
              ),
              backButtonTitle: helpers.getBackText(this.props.screen.back),
            }),
          1000
        )
      );
    }

    this.props.closeModal();
    setTimeout(
      () =>
        NavigationService.navigate("CreateNewUserScreen", {
          title: this._getTextFromCMS("account_setup_title", "setup account"),
          backButtonTitle: helpers.getBackText(this.props.screen.back),
          name: this.props.user.profileName,
        }),
      1000
    );
  }

  public render() {
    const { syncProfilesReducer, userProfiles, user } = this.props;

    const lastSaved = syncProfilesReducer.lastUpdateTimestamp
      ? moment(syncProfilesReducer.lastUpdateTimestamp)
      : 0;

    const noUserSelected = user == undefined;
    const noOnlineUserSelected =
      noUserSelected == false
        ? user.profileEmail != null
          ? false
          : true
        : true;

    if (
      (noUserSelected || noOnlineUserSelected) &&
      this.state.noOnlineUser == false
    ) {
      this.setState({ noOnlineUser: true });
      setTimeout(() => this.setState({ noOnlineUser: false }), 30000);
    }

    const lockDownTimer = moment(syncProfilesReducer.lastUpdateTimestamp);
    lockDownTimer.add(30, "second");

    const lockSync = lastSaved > 0 ? moment() < lockDownTimer : false;

    const headerText = this._getTextFromCMS(
      "lp:sync_header_text",
      "save online profile"
    );
    const bodyText = this._getTextFromCMS(
      "lp:sync_body_text",
      "here you can see the last time the online user data has been saved. And/or choose to save the data now by pressing the button below"
    );
    const bodyText_no_online_user = this._getTextFromCMS(
      "lp:sync_body_text_no_online_user",
      "your account is not logged in to our online service. Your data is not saved outside your device"
    );
    const headerText1 = this._getTextFromCMS(
      "lp:sync_header_text_1",
      "last saved"
    );
    const noOnlineUser = this._getTextFromCMS(
      "lp:sync_no_online_user",
      "there are no online user on the device"
    );
    const buttonLabel = this._getTextFromCMS(
      "lp:sync_button_label",
      "save profile"
    );
    const lockDown = this._getTextFromCMS(
      "lp:sync_lock_down",
      "data can not be saved again to quickly"
    );
    const createUser = this._getTextFromCMS("lp:create_user", "create user");
    const upgradeProfile = this._getTextFromCMS(
      "lp:upgrade_profile",
      "upgrade profile"
    );

    return (
      <View style={{}}>
        <View
          style={{
            backgroundColor: ColorTheme.SECONDARY,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: ColorTheme.SECONDARY,
            padding: 16,
            paddingTop: 24,
            flexDirection: "column",
          }}
        >
          <AppText
            style={{
              fontSize: ColorTheme.FONT_SIZE * 1.25,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {headerText}
          </AppText>
          {this.state.noOnlineUser ? (
            <AppText style={styles.bodyText}>{bodyText_no_online_user}</AppText>
          ) : (
            <AppText style={styles.bodyText}>{bodyText}</AppText>
          )}
          {this.state.noOnlineUser || noUserSelected ? null : (
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE,
                textAlign: "center",
                marginTop: 12,
                fontWeight: "bold",
              }}
            >
              {headerText1 + ":"}
            </AppText>
          )}
          {this.state.noOnlineUser || noUserSelected ? null : (
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE,
                textAlign: "center",
                marginBottom: 12,
                marginTop: 8,
              }}
            >
              {lastSaved == 0 ? "Never" : lastSaved.format("LLL")}
            </AppText>
          )}
          {this.state.noOnlineUser ? (
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE,
                color: ColorTheme.WARNING,
                textAlign: "center",
                marginBottom: 12,
                marginTop: 12,
                fontWeight: "bold",
              }}
            >
              {noOnlineUser}
            </AppText>
          ) : null}
          {this.state.inLockDown ? (
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE,
                color: ColorTheme.WARNING,
                textAlign: "center",
                marginBottom: 12,
                marginTop: 12,
                fontWeight: "bold",
              }}
            >
              {lockDown}
            </AppText>
          ) : null}
          {syncProfilesReducer.isFetching == false ? (
            noUserSelected || noOnlineUserSelected ? (
              <FramedButton
                label={user == undefined ? createUser : upgradeProfile}
                style={[, { width: 180 }]}
                onPress={() => this._goToUpgrade()}
              />
            ) : (
              <FramedButton
                label={buttonLabel}
                style={[, { width: 180 }]}
                onPress={() =>
                  this._handleOnPress(lockSync, userProfiles, lockDownTimer)
                }
              />
            )
          ) : (
            <ActivityIndicator color={ColorTheme.PRIMARY} size={"small"} />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state
) => ({
  screen: state.contentByLanguage[state.selectedLang].screen,
  syncProfilesReducer: state.syncProfilesReducer,
  userProfiles: state.userProfiles,
  user: state.userProfiles[state.currentUser.currentUser],
  currentUser: state.currentUser.currentUser,
  country: state.selectedCountry,
});

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  closeModal: () => dispatch(closeModal()),
  syncProfilesStart: () => dispatch(syncProfilesStart()),
  syncProfilesDone: () => dispatch(syncProfilesDone()),
  syncProfilesFailed: () => dispatch(syncProfilesFailed()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncProfilesModal);

const styles = StyleSheet.create({
  bodyText: {
    fontSize: ColorTheme.FONT_SIZE,
    textAlign: "center",
    marginBottom: 12,
    marginTop: 12,
  },
});
