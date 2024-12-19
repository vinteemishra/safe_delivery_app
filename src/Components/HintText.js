import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppText from './AppText';
import ColorTheme from '../Constants/ColorTheme';

export default class HintText extends Component{
    
    render(){
        return(
            <AppText style={[this.props.style, {color: (this.props.showHint)? ColorTheme.PRIMARY : ColorTheme.SUB_LABEL, textAlign: 'center'}]}>{this.props.children}</AppText>
        )
    }
}

HintText.propTypes = {
    showHint: PropTypes.bool.isRequired
}
