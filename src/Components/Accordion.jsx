import React, { Component } from 'react';
import { Easing } from 'react-native';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  Animated
} from 'react-native';
import CHEVRON from '../../img/chevron.png';
import AppText from './AppText';

export default class Accordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: props.expanded || false,
      chevronAnim: new Animated.Value(0),
      chevronRotation: props.expanded ? ['90deg', '0deg'] : ['0deg', '90deg']
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  animateChevronIcon = () => {
    Animated.timing(this.state.chevronAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
    if (this.props.showChevron) {
      if (this.state.expanded) {
        this.setState({ chevronRotation: ['90deg', '0deg'] });
      } else {
        this.setState({ chevronRotation: ['0deg', '90deg'] });
      }
      this.animateChevronIcon();
    }
  };

  render() {
    return (
      <>
        <TouchableOpacity
          ref={this.accordian}
          style={[
            styles.row,
            { borderBottomColor: '#EAEAEA', borderBottomWidth: 1 },
            this.props.headerStyle ? this.props.headerStyle : {}
          ]}
          activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.7}
          onPress={() => {
            this.props.headerPress
              ? this.props.headerPress()
              : this.toggleExpand();
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {this.props.headerIcon && (
              <Image
                source={this.props.headerIcon}
                width={15}
                height={15}
                style={{ width: 20, height: 20 }}
                resizeMode='contain'
              />
            )}
            {this.props.showChevron &&
              (!this.props.chevronPlacement ||
                this.props.chevronPlacement === 'left') && (
                <Animated.Image
                  source={CHEVRON}
                  resizeMode='contain'
                  style={[
                    { width: 7.5 },
                    {
                      transform: [
                        {
                          rotate: this.state.chevronAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: this.state.chevronRotation
                          })
                        }
                      ]
                    }
                  ]}
                />
              )}
            <AppText
              style={[
                {
                  marginLeft: this.props.chevronPlacement === 'right' ? 0 : 20,
                  marginRight: this.props.chevronPlacement === 'right' ? 10 : 0
                },
                styles.title,
                this.props.titleStyle || {}
              ]}
            >
              {this.props.title}
            </AppText>
          </View>
        </TouchableOpacity>
        {this.state.expanded && this.props.children}
      </>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14
  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  child: {
    backgroundColor: 'white'
  }
});
