import * as React from 'react';
import { View, Image } from 'react-native';
import AppText from '../AppText';
import FramedButton from '../FramedButton';
import ColorTheme from '../../Constants/ColorTheme';
import NavigationService from '../NavigationService';

interface OwnProps {
  getTextFromCMS(key: string, fallback: string): string;
  onRequestClose(): void;
  navigateBack(): void;
  alternativeClose?: boolean;
}

type Props = OwnProps;

export default class CreateSimpleProfileSuccessModal extends React.Component<
  Props
> {
  public render() {
    const { getTextFromCMS, onRequestClose } = this.props;
    return (
      <View>
        <AppText
          style={{
            textAlign: 'center',
            fontSize: ColorTheme.FONT_SIZE * 1.3,
            marginTop: 32,
            fontWeight: '500'
          }}
        >
          {getTextFromCMS(
            'lp:network_call_success_add_user',
            'welcome to your personal learning journey'
          )}
        </AppText>
        <AppText style={{ textAlign: 'center', marginTop: 16 }}>
          {getTextFromCMS(
            'lp:network_call_success_add_simple_user_part_1',
            'you can now start using My Learning and your progress will be saved on this device.'
          )}
        </AppText>
        <AppText style={{ textAlign: 'center', marginTop: 16 }}>
          {getTextFromCMS(
            'lp:network_call_success_add_simple_user_part_2',
            'when you get internet you can go to'
          )}
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 12
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: ColorTheme.PRIMARY,
              borderRadius: 70 / 2,
              alignContent: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={require('../../../img/nav_icons/settings_selected.png')}
              style={{ alignSelf: 'center', width: 45, height: 45 }}
            />
          </View>
          <View
            style={{
              width: 70,
              height: 70,
              alignContent: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={require('../../../img/learning_icons/arrow-right-red-1.png')}
              style={{
                alignSelf: 'center',
                width: 35,
                height: 20,
                marginLeft: 15,
                marginRight: 15
              }}
            />
          </View>
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: ColorTheme.SECONDARY,
              borderRadius: 70 / 2,
              alignContent: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={require('../../../img/settings/user_profile.png')}
              style={{
                alignSelf: 'center',
                height: 70,
                width: 70,
                margin: 12,
                borderRadius: 70 / 2,
                borderWidth: 1,
                borderColor: ColorTheme.PRIMARY
              }}
            />
          </View>
        </View>
        <AppText style={{ textAlign: 'center', margin: 16 }}>
          {getTextFromCMS(
            'lp:network_call_success_add_simple_user_part_3',
            'and upgrade your profile in case you need to change device'
          )}
        </AppText>
        <FramedButton
          label={getTextFromCMS('lp:positive_dismiss', 'okay')}
          style={[{ width: 200 }]}
          onPress={() => {
            onRequestClose();
            setTimeout(() => NavigationService.pop(), 350);
          }}
        />
      </View>
    );
  }
}
