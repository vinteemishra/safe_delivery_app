import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';

var styles = StyleSheet.create({
    container: {
        backgroundColor: ColorTheme.TERTIARY,

    },
    viewStyle: {
        
    },
    indicator: {
        margin: 6,
        // height: 10,
        // width: 10, 
        // borderRadius: 5, 
        backgroundColor: '#ccc',
    }
});

class ValuePropIndicator extends Component {


    render(){
        const {indicatorCount, selectedIndicator, style} = this.props
        const dimensions = Dimensions.get('window');

        const widthOFIndocator = dimensions.width > 320 ? 10 : 8;
        const imageRadius = widthOFIndocator / 2;
       
        if(indicatorCount){
            let indicators = []
            for (var i = 1; i <= indicatorCount; i++) {
              
                if(selectedIndicator >= i){
                    indicators.push(<View key={i.toString()} style={[styles.indicator, {backgroundColor: ColorTheme.WHITE, width: widthOFIndocator, height: widthOFIndocator, borderRadius: imageRadius }]}/>);
                }else{
                    indicators.push(<View key={i.toString()} style={[styles.indicator, {opacity: 0.5, width: widthOFIndocator, height: widthOFIndocator, borderRadius: imageRadius}]}/>);
                }   
            }

            return (
                <View style={[{ }, style]}>
                    <View style={{flexDirection: 'row'}}>
                        {indicators}
                    </View>
                </View>
            )
        }else{
            return null
        }
        
    }
};

export default ValuePropIndicator;