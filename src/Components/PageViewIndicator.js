import React, {Component} from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import ColorTheme from '../Constants/ColorTheme';

styles = StyleSheet.create({
    indicator: {
        margin: 8,
        height: 12,
        width: 12, 
        borderRadius: 12, 
        backgroundColor: '#ccc'
    }
})
class PageViewIndicator extends Component{
    render(){
        const {indicatorCount, style} = this.props
        const {selectedIndicator} = this.props
       
        if(indicatorCount){
            let indicators = []
            for (var i = 1; i <= indicatorCount; i++) {
              
                if(selectedIndicator == i){
                    indicators.push(<View style={[styles.indicator, {backgroundColor: ColorTheme.PRIMARY}]} key={i}/>);
                }else{
                    indicators.push(<View style={styles.indicator} key={i}/>);
                }
                
            }
            return (
                <View style={[{justifyContent: 'flex-end', alignItems: 'center', margin: 8}, style]}>
                    <View style={{flexDirection: 'row'}}>
                        {indicators}
                    </View>
                </View>
            )
        }else{
            return null
        }
        
    }
}

export default PageViewIndicator