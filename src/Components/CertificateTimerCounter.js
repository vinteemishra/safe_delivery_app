import React, { Component } from "react";
import AppText from "../Components/AppText";

export default class CertificateTimerCounter extends Component {
  constructor(props) {
    super(props);
    const { days_left_in_seconds } = this.props;
    this.state = { time: {}, seconds: days_left_in_seconds };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let days = Math.floor(secs / (24 * 60 * 60));

    let divisor_for_hours = secs % (24 * 60 * 60);
    let hours = Math.floor(divisor_for_hours / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  countDown() {
    let seconds = this.state.seconds - 1;

    if (seconds > 0) {
      // Remove one second, set state so a re-render happens.
      // let seconds = this.state.seconds - 1;
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
      });
    } else {
      this.stopTimer();
      this.props.handelZero();
    }
  }

  render() {
    return (
      <AppText
        style={[
          {
            fontSize: 22,
            fontWeight: "500",
            textAlign: "center",
            paddingTop: 12,
          },
          this.props.style,
        ]}
      >
        {this.state.time.d}
        d: {this.state.time.h}
        h: {this.state.time.m}
        m: {this.state.time.s}s
      </AppText>
    );
  }
}
