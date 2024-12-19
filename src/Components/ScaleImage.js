import React, { Component } from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';
export default class ScaleImage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imgWidth: 0,
      imgHeight: 0,
    }
  }

  componentDidMount() {
    Image.getSize(this.props.imageUrl, (width, height) => {
      // calculate image width and height 
      const screenWidth = Dimensions.get('window').width - 32
      const scaleFactor = width / screenWidth
      const imageHeight = height / scaleFactor
      this.setState({ imgWidth: screenWidth, imgHeight: imageHeight })
    })
  }

  render() {

    const { imgWidth, imgHeight } = this.state

    return (

      <Image
        style={{ width: imgWidth, height: imgHeight, marginBottom: 20 }}
        source={{ uri: this.props.imageUrl }}
        resizeMode='contain'
      />

    )
  }
}