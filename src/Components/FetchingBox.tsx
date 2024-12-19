import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';

interface OwnProps {
  loadingText?: String;
}

interface State {}

class FetchingBox extends React.Component<OwnProps, State> {
  constructor(props: OwnProps) {
    super(props);
  }

  public render() {
    return (
      <View
        style={{
          paddingRight: 16,
          paddingLeft: 16,
          paddingTop: 20,
          paddingBottom: 20,
          alignItems: 'center',
          backgroundColor: ColorTheme.SECONDARY,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: ColorTheme.SECONDARY
        }}
      >
        {this.props.loadingText ? (
          <AppText
            style={{ marginLeft: 16, marginRight: 16, marginBottom: 16 }}
          >
            {this.props.loadingText}
          </AppText>
        ) : null}
        <ActivityIndicator color={ColorTheme.PRIMARY} size={'large'} />
      </View>
    );
  }
}

export default FetchingBox;
