import React, { Component } from 'react';
import {
    View,
    Image
} from 'react-native';

export default class LearningAnimScore extends React.Component {
    constructor() {
        super()

        this.state = {
            currentFrame: 0,
            layoutWidth: 0,
            layoutHeight: 0,
            particleStars: [],
        }

        //this.imageCacheJoltPerformed = false;
    }

    componentWillMount() {
        this.animTimer = setTimeout(this.animTimerFunc.bind(this), 40);

        //adjust animation starttime to match previously earned stars
        if (this.props.prevStars == 1) {
            this.state.currentFrame = 12;
        } else if (this.props.prevStars == 2) {
            this.state.currentFrame = 27;
        } else if (this.props.prevStars == 3) {
            this.state.currentFrame = 42;
        }

        this.antiFlickerImages = [];
        let j = 0;
        for (let i = 0; i < 36; i++) {
            let fn = 'gainstar_' + ('0000' + (i + 1)).substr(-4, 4);
            this.antiFlickerImages.push((<Image key={i} source={{ uri: fn }} style={{ left: -10, right: -10, width: 10, height: 10 }} />));
            j++;
        }

        for (let i = 0; i < 25; i++) {
            let key = i + 100; //Unique key, that have to be diffrent from the above key={i}.
            let fn = 'pulsestar_' + ('0000' + (i + 1)).substr(-4, 4);
            this.antiFlickerImages.push((<Image key={key} source={{ uri: fn }} style={{ left: -10, right: -10, width: 10, height: 10 }} />));
            j++;
        }
    }

    componentWillUnmount() {
        clearTimeout(this.animTimer);
    }

    onLayout(event) {
        this.setState({
            layoutWidth: event.nativeEvent.layout.width,
            layoutHeight: event.nativeEvent.layout.height,
        });
    }

    // recursive call that animate the stars
    animTimerFunc() {
        let particleStars = this.state.particleStars;
        let w = this.state.layoutWidth;
        let h = this.state.layoutHeight;

        let speed = (w / 25) * .2;

        let wh = w * .4;
        let img_dist = wh * .27;
        let x1 = w / 2 - img_dist;
        let x2 = w / 2;
        let x3 = w / 2 + img_dist;
        let y = h / 2;

        //if nearing end of animation and received 3 stars then there is a chance of a star spawning.
        if (this.state.currentFrame >= 90 && this.props.stars >= 3 && Math.random() < .2) {
            let a = Math.random() * 2 * Math.PI;

            let x = 0;
            let org = Math.random() * 3;
            if (org < 1)
                x = x1;
            else if (org < 2)
                x = x2;
            else
                x = x3;

            particleStars.push({
                x: x,
                y: y,
                dx: Math.cos(a) * speed,
                dy: Math.sin(a) * speed,
                opacity: 1,
            });
        }

        let star_wh2 = wh * .5 * .5;


        //move all the particleStars
        let i = 0;
        while (i < particleStars.length) {
            let s = particleStars[i];
            s.x += s.dx;
            s.y += s.dy;

            //stars get transparent as they close in on the edge of the screen
            let opacity = 1;

            let left = s.x / (w * .2);
            if (left < opacity) opacity = left;
            let right = (w - s.x) / (w * .2);
            if (right < opacity) opacity = right;
            let top = s.y / (h * .2);
            if (top < opacity) opacity = top;
            let bottom = (h - s.y) / (h * .2);
            if (bottom < opacity) opacity = bottom;

            s.opacity = opacity;

            //remove star when no longer visible
            if (opacity <= 0)
                particleStars.splice(i, 1);
            else
                i += 1;
        }

        this.setState({ currentFrame: this.state.currentFrame + 1, particleStars: particleStars });
        this.animTimer = setTimeout(this.animTimerFunc.bind(this), 40);
    }

    render() {
        let F1_DELAY = 25
        let f1 = this.state.currentFrame + 1 - F1_DELAY;
        if (f1 < 1) f1 = 1;
        if (f1 > 36) f1 = 36;

        if (this.props.prevStars >= 1)
            f1 = 36;
        else if (this.props.stars <= 0)
            f1 = 1;

        let F2_DELAY = 40
        let f2 = this.state.currentFrame + 1 - F2_DELAY;
        if (f2 < 1) f2 = 1;
        if (f2 > 36) f2 = 36;

        if (this.props.prevStars >= 2)
            f2 = 36;
        else if (this.props.stars <= 1)
            f2 = 1;

        let F3_DELAY = 55
        let f3 = this.state.currentFrame + 1 - F3_DELAY;
        if (f3 < 1) f3 = 1;
        if (f3 > 36) f3 = 36;

        if (this.props.prevStars >= 3)
            f3 = 36;
        else if (this.props.stars <= 2)
            f3 = 1;

        let img1 = 'gainstar_' + ('0000' + f1).substr(-4, 4);
        let img2 = 'gainstar_' + ('0000' + f2).substr(-4, 4);
        let img3 = 'gainstar_' + ('0000' + f3).substr(-4, 4);

        if (this.props.stars >= 3 && this.state.currentFrame >= 90) {
            let pulse_fr = ((this.state.currentFrame - 90) % 25) + 1;
            img1 = 'pulsestar_' + ('0000' + pulse_fr).substr(-4, 4);
            img2 = img1;
            img3 = img1;
        }

        let h = this.state.layoutHeight;

        let wh = this.state.layoutWidth * .4;
        let img_dist = wh * .27;
        let x1 = this.state.layoutWidth / 2 - img_dist - wh / 2;
        let x2 = this.state.layoutWidth / 2 - wh / 2;
        let x3 = this.state.layoutWidth / 2 + img_dist - wh / 2;

        let y = h / 2 - wh / 2;

        let bg_img = 'bg_' + ('0000' + this.props.level).substr(-4, 4);
        let bg_h = this.state.layoutWidth * 97 / 750;
        let bg_y = h / 2 - bg_h / 2;

        let star_wh = wh * .5;

        // Array of stars that floats around after completing a level
        let stars = []
        for (let i = 0; i < this.state.particleStars.length; i++) {
            let s = this.state.particleStars[i];
            let angle_string = String(this.state.currentFrame * 5) + 'deg';
            stars.push(<Image
                source={{ uri: 'juststar' }}
                style={{
                    position: 'absolute',
                    left: s.x - star_wh * .5,
                    top: s.y - star_wh * .5,
                    width: star_wh,
                    height: star_wh,
                    transform: [{ rotate: angle_string }],
                    opacity: s.opacity,
                }}
                key={i}
            />);
        }

        /*
        // cache jolt
        let jolt = [];
        //if(!this.imageCacheJoltPerformed) {
            for(let i = 0; i < 36; i++) {
                let img1 = 'gainstar_' + ('0000' + i + 1).substr(-4,4);
                jolt.push(<Image source={{uri: img1}} style={{position: 'absolute', left: i * 10, top: 0, width: wh, height: wh}} />);
            }
            //this.imageCacheJoltPerformed = true;
        //}
        */

        let antiFlicker = this.antiFlickerImages;

        return (
            <View style={{ flex: 1, flexDirection: 'column' }} onLayout={(event) => this.onLayout(event)}>
                <View
                    style={{
                        height: h,
                    }}>
                    <Image source={{ uri: bg_img }} style={{ position: 'absolute', left: 0, top: bg_y, width: this.state.layoutWidth, height: bg_h }} />
                    <Image source={{ uri: img1 }} style={{ position: 'absolute', left: x1, top: y, width: wh, height: wh }} />
                    <Image source={{ uri: img2 }} style={{ position: 'absolute', left: x2, top: y, width: wh, height: wh }} />
                    <Image source={{ uri: img3 }} style={{ position: 'absolute', left: x3, top: y, width: wh, height: wh }} />

                    {antiFlicker}

                    {stars}
                </View>
            </View>
        );
    }
}
