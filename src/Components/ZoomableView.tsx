import React, { createRef } from "react";
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import Icon from "react-native-vector-icons/Feather";
import { analytics } from "../Utils/analytics";
import ColorTheme from "../Constants/ColorTheme";
import { COLOR } from "../Constants/Constants";
interface OwnProps {
  canZoom: boolean;
}

class ZoomableView extends React.Component<OwnProps> {
  constructor(props) {
    super(props);
  }
  state = {
    zoomLevel: 1,
    buttonZoomActive: false,
    pinchZoomActive: false,
    buttonZoomScale: undefined,
  };

  scrollViewRef = createRef();

  androidRef = createRef<ReactNativeZoomableView>();

  setScrollViewRef = (ref) => (this.scrollViewRef = ref);

  zoomScale = 1.5;

  updateZoomStateIOS = (zoomHeight, zoomWidth) => {
    this.scrollViewRef.getScrollResponder().scrollResponderZoomTo({
      x: 0,
      y: 0,
      width: zoomWidth,
      height: zoomHeight,
      animated: true,
    });
  };

  updateZoomStateAndroid = (zoomLevel) =>
    this.androidRef.current.zoomTo(zoomLevel);

  logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    if (this.state.buttonZoomActive === false) {
      if (
        zoomableViewEventObject.zoomLevel !== 1 &&
        zoomableViewEventObject.zoomLevel !== 1.000000001
      ) {
        // analytics.event(
        //   "pinchToZoom",
        //   `zoomedIn:scale:${zoomableViewEventObject.zoomLevel}`
        // );
        this.setState({
          pinchZoomActive: true,
          buttonZoomActive: false,
        });
      } else if (zoomableViewEventObject.zoomLevel === 1) {
        // analytics.event("pinchToZoom", "zoomedOut");
        this.setState({
          pinchZoomActive: false,
          buttonZoomActive: false,
        });
      }
    }
  };

  render() {
    const isIOS = Platform.OS === "ios";
    const { width, height } = Dimensions.get("screen");
    const { canZoom, children } = this.props;
    const zoomButtons = (
      <View
        style={{
          backgroundColor: ColorTheme.PRIMARY,
          flexDirection: "row",
          zIndex: 1,
          borderWidth: 0.5,
          borderColor: "white",
          width,
        }}
      >
        {[
          {
            text: "zoom-out",
            onPress: () => {
              if (this.state.zoomLevel > 1) {
                // analytics.event("buttonZoom", `zoomedOut`);
                isIOS
                  ? this.updateZoomStateIOS(height, width)
                  : this.updateZoomStateAndroid(1.000000001);
                this.setState({ zoomLevel: this.state.zoomLevel - 1 });
              }
              this.setState({
                buttonZoomActive: false,
                pinchToZoom: false,
                zoomLevel: 1,
                buttonZoomScale: undefined,
              });
            },
          },
          {
            text: "zoom-in",
            onPress: () => {
              if (this.state.zoomLevel < 2) {
                // analytics.event("buttonZoom", `zoomedIn`);
                isIOS
                  ? this.updateZoomStateIOS(height / 2.15, width / 2.15)
                  : this.updateZoomStateAndroid(1.25);

                this.setState({
                  buttonZoomActive: true,
                  zoomLevel: this.state.zoomLevel + 1,
                  pinchToZoom: false,
                });
              }
            },
          },
        ].map((element, index) => (
          <TouchableOpacity
            key={`zoom-action-button-${element.text}-${index}`}
            style={{
              borderRightWidth: index === 0 ? 0.5 : 0,
              borderRightColor: "white",
              paddingVertical: 10,
              width: width / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={element.onPress}
          >
            <Icon color="white" name={element.text} size={22} />
          </TouchableOpacity>
        ))}
      </View>
    );
    return (
      <View style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
        {isIOS ? (
          <ScrollView
            maximumZoomScale={canZoom ? 3 : 1}
            minimumZoomScale={1}
            ref={this.setScrollViewRef}
            onScroll={(e) => {
              if (
                this.state.buttonZoomActive &&
                this.state.buttonZoomScale === undefined
              ) {
                this.setState({ buttonZoomScale: e.nativeEvent.zoomScale });
              }
              if (
                !this.state.buttonZoomActive &&
                e.nativeEvent.zoomScale !== 1
              ) {
                if (this.state.pinchZoomActive === false) {
                  // analytics.event("pinchToZoom", `zoomedIn::`);
                }
                this.setState({ pinchZoomActive: true });
              } else if (e.nativeEvent.zoomScale === 1) {
                if (this.state.pinchZoomActive) {
                  // analytics.event("pinchToZoom", `zoomedOut::`);
                }
                this.setState({
                  pinchZoomActive: false,
                  buttonZoomActive: false,
                  zoomLevel: 1,
                  buttonZoomScale: undefined,
                });
              } else if (
                this.state.buttonZoomActive &&
                this.state.buttonZoomScale &&
                e.nativeEvent.zoomScale !== this.state.buttonZoomScale
              ) {
                this.setState({
                  pinchZoomActive: true,
                  buttonZoomActive: false,
                  zoomLevel: 1,
                  buttonZoomScale: undefined,
                });
              }
            }}
            scrollEventThrottle={16}
          >
            {children}
          </ScrollView>
        ) : (
          <ReactNativeZoomableView
            zoomEnabled={true}
            ref={this.androidRef}
            maxZoom={canZoom ? 3 : 1}
            minZoom={1}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            onZoomAfter={this.logOutZoomState}
          >
            {children}
          </ReactNativeZoomableView>
        )}
        {canZoom && !this.state.pinchZoomActive && zoomButtons}
      </View>
    );
  }
}

export default ZoomableView;
