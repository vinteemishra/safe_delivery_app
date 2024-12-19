import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import VideoPlayer from '../Components/VideoPlayer'
import Orientation from 'react-native-orientation'
import fs from 'react-native-fs'
import AnalyticsTracker from '../Components/AnalyticsTracker';

/**MIT License

Copyright (c) 2016 Nubix Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/itsnubix/react-native-video-controls */



class VideoPlayerScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            videoToPlay: 0,
            resizeMode: undefined
        }
    }
    static navigatorStyle = {
        navBarHidden: true,
    };

    componentDidMount() {
        Orientation.unlockAllOrientations();
    }
    componentWillUnmount() {
        Orientation.lockToPortrait();
    }
    componentWillMount() {
        let playList = []
        playList = playList.concat(this.props.navigation.state.params.video);

        this.setState({
            playList
        })
    }
    onLayout = event => {
        const { width, height } = event.nativeEvent.layout;
        if (width > height) {

            this.setState({ resizeMode: 'stretch' });
        } else {
            this.setState({ resizeMode: 'contain' });

        }
    }

    render() {
        let url = 'file://' + fs.DocumentDirectoryPath + encodeURI(this.state.playList[this.state.videoToPlay].src)
        console.log("params", this.props.navigation.state.params);
        if (this.state.playList) {
            return (
                <View style={{ flex: 1, backgroundColor: 'black' }} onLayout={this.onLayout}>
                    {Array.isArray(this.props.navigation.state.params.video) ? <AnalyticsTracker eventType="videoFull" eventData={`::`} /> : <AnalyticsTracker eventType="videoChapter" eventData={`:${this.props.navigation.state.params.video.id}:`} />}
                    <VideoPlayer
                        source={{ uri: url }}
                        navigator={this.props.navigator}
                        onEnd={() => this.onEnd(this.props.navigation.state.params.onBack)}
                        resizeMode={this.state.resizeMode}
                        onBack={() => this.props.navigation.state.params.onBack()}
                        ref={videoPlayer => this.videoPlayer = videoPlayer}
                    />
                </View>
            )
        } else {
            return null
        }
    }

    /**
    * Called when the video end. Either goes to next video or exit the videoplayer
    */
    onEnd(onBack) {

        if (this.state.playList.length > this.state.videoToPlay + 1) {
            this.setState({ videoToPlay: this.state.videoToPlay + 1 })
            this.videoPlayer.seekTo(0);
        } else {
            onBack()
        }
    }

}

function mapStateToProps() {
    return {}
}
export default connect(mapStateToProps)(VideoPlayerScreen);