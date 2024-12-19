import React, {Component} from 'react';
import {View, FlatList} from 'react-native';

class CountryListItem extends Component{
    onPress(){
        this.props.onPress(this.props.id);
    }

    render(){
        return (
            <TouchableOpacity onPress={() => this.onPress()}>
              <View style={{backgroundColor: ColorTheme.SECONDARY, minHeight: 45, padding: 8, flexDirection: 'column'}} key={index}>
                {/* <AppText>{country.native} </AppText>
                <AppText style={{fontSize: ColorTheme.FONT_SIZE * 0.70, marginTop: 2}}>{country.name}</AppText> */}
                <View style={{marginTop: 4, borderBottomWidth: 1, borderBottomColor: (this.state.selected == index) ? ColorTheme.PRIMARY : ColorTheme.SECONDARY }}/>
              </View>
            </TouchableOpacity>)
    }
}

export default class SingleSelectList extends Component {

    state = {selected: (new Map())};

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) =>{ 
    // console.log('render item', item)
      return (
    <CountryListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  )};

  render() {
    // console.log('this.props.data', this.props.data)
    return (
      <FlatList
        data={this.props.data}
        renderItem={this._renderItem}
      />
    );
  }

}