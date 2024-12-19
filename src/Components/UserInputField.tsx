import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TextInput,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
  TextStyle
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from './AppText';
import { getFont } from '../Utils/helpers';
import Icon from 'react-native-vector-icons/FontAwesome';

interface OwnProps {
  onChangeText(text: string): void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  style?: ViewStyle;
  error_message?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  showEyeFunction?: boolean;
  whatsAppNumberField?: boolean;
  textInputStyle?: TextStyle;
  editable?: TextInputProps['editable'];
}

interface State {
  showPassw: boolean;
  savedValue: string;
  doNotDelete: boolean;
}

export default class UserInputField extends React.Component<OwnProps, State> {
  constructor(props: OwnProps) {
    super(props);
    this.state = {
      showPassw: false,
      savedValue: '',
      doNotDelete: false
    };
  }

  static defaultProps = {
    showEyeFunction: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showPassw && this.state.showPassw === false) {
      this.setState({ doNotDelete: true });
    }
  }

  addPlusSign(str) {
    let sign = '+';
    if (str.charAt(0) != '+' && str.length == 1) {
      return sign + str;
    }
    return str;
  }

  changeText(text) {
    //If the user is deleting text via backspace, make sure the text is deleted, otherwise it will be caut in the below if's
    if (
      this.state.savedValue.length - 1 == text.length &&
      this.state.doNotDelete === false
    ) {
      return this.setState({ savedValue: text });
    }

    //If the text comming in, use the one we have in the store. This is to prevent the indputField to get cleared when using the eye function to see the password
    //When secureTextEntry on the <TextIndput> is toggeled from false to true the indput field looses and get focus again on IOS, so when the user continue to write text the field is reset.
    //This is a known issue on IOS!
    if (text.length == 0) {
      return this.state.savedValue;
    }

    //This is a continue on the known issue on IOS!
    //When the user continue to write text after the secureTextEntry toggle, the user would have to press twice before the text would apear.
    //This is takes the in incomming text and addes it to the stored text from before the secureTextEntry toggle.
    if (text.length == 1) {
      return this.setState({
        savedValue: this.state.savedValue + text,
        doNotDelete: false
      });
    }

    //Normal situation. Sets the incomming text to the state text.
    this.setState({ savedValue: text });
    this.props.onChangeText(text);
  }

  toggleEye() {
    if (this.state.showPassw != true) {
      this.setState({ showPassw: true });
    }
    if (this.state.showPassw != false) {
      this.setState({ showPassw: false });
    }
  }

  render() {
    const {
      onChangeText,
      placeholder,
      secureTextEntry,
      value,
      style,
      error_message,
      showEyeFunction,
      whatsAppNumberField,
      editable
    } = this.props;

    let autoCapitalize = this.props.autoCapitalize
      ? this.props.autoCapitalize
      : 'none';

    let inputField = (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <TextInput
            style={[styles.textfield, style, this.props.textInputStyle]}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            editable={editable || true}
            // defaultValue={_value}
            defaultValue={value}
            keyboardType={secureTextEntry ? 'default' : 'email-address'}
            // value={whatsAppNumberField ? this.addPlusSign(_value) : _value}
            // value={onAndroid ? value : this.state.savedValue}
            secureTextEntry={this.state.showPassw ? false : secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor={'#C7C7CD'}
            clearTextOnFocus={false}
            onChangeText={
              showEyeFunction
                ? (text) =>
                    this.changeText(
                      whatsAppNumberField ? this.addPlusSign(text) : text
                    )
                : onChangeText
            } //This need to be fixed on the WHatsApp branch, becourse it it not adding the plus sign
            // onChangeText={ (text) => this.changeText(whatsAppNumberField ? this.addPlusSign(text) : text) }
            // onChangeText={onChangeText}
            onEndEditing={() => this.setState({ showPassw: false })}
          />
          {showEyeFunction && (
            <View>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => {
                  this.toggleEye();
                }}
              >
                {this.state.showPassw ? (
                  <Icon name='eye-slash' size={20} color={ColorTheme.WARNING} />
                ) : (
                  <Icon name='eye' size={20} color={ColorTheme.BLACK} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View
          style={{
            backgroundColor: ColorTheme.PRIMARY,
            height: 1,
            marginTop: showEyeFunction ? 0 : 6
          }}
        />
      </View>
    );

    return (
      <View>
        {inputField}
        {error_message !== undefined && (
          <AppText style={styles.error_message}>{error_message}</AppText>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    flex: 1,
    fontFamily: getFont(),
    color: ColorTheme.BLACK
  },
  textfield: {
    height: Platform.OS == 'android' ? 48 : 24,
    width: 250,
    fontWeight: '500',
    color: '#333',
    fontSize: ColorTheme.FONT_SIZE * 1.15
  },
  error_message: {
    color: ColorTheme.PRIMARY,
    fontSize: ColorTheme.FONT_SIZE - 4,
  }
});
