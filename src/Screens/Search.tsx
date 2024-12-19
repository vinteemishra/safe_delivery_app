import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import AppText from '../Components/AppText';
import UserInputField from '../Components/UserInputField';
import ANTICONS from 'react-native-vector-icons/AntDesign';
import ColorTheme from '../Constants/ColorTheme';
import { COLOR } from '../Constants/Constants';
import { NavigationScreenProp } from 'react-navigation';
import * as helpers from '../Utils/helpers';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import CheckBox from '../Components/CheckBox';
import AnimatedAvoidKeyboardContainer from '../Components/AnimatedAvoidKeyboardContainer';
import Accordian from '../Components/Accordion';

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}

interface PropsFromState {
  drugs: Array<{ content; description }>;
  actionCards: Array<any>;
  procedures: Array<any>;
  screen: any;
  getTextFromCMS(screenKey: string, fallback: string): string;
}
interface State {
  searchString: string;
  results: Object;
  showComment: boolean;
  animateModal: boolean;
  filter: Array<String>;
}
type Props = PropsFromState & OwnProps;

class Search extends Component<Props, State> {
  constructor(props) {
    super(props);
  }
  state = {
    searchString: '',
    results: {},
    showComment: false,
    animateModal: false,
    filter: ['actioncard', 'procedure', 'drugs']
  };
  allFilters = ['actioncard', 'procedure', 'drugs'];

  onOptionPressed(content, description, id, contentType) {
    if (content.length == 1) {
      this.props.navigation.navigate('ActioncardScreen', {
        title: description,
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        content: content[0].content,
        id,
        contentType,
        index: 0
      });
    } else {
      this.props.navigation.navigate('ChapterOptionScreen', {
        title: description,
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        content,
        id,
        contentType
      });
    }
  }

  searchInDrugs(searchString) {
    const { drugs } = this.props;

    const drugsResult = drugs.filter(
      (el) =>
        (el.content &&
          el.content.toLowerCase().includes(searchString.toLowerCase())) ||
        (el.description &&
          el.description.toLowerCase().includes(searchString.toLowerCase()))
    );
    return drugsResult;
  }

  goToDrug(property) {
    this.props.navigation.navigate('DrugScreen', {
      title: property.description,
      backButtonTitle: helpers.getBackText(
        this.props.getTextFromCMS('back', 'back')
      ),
      content: property.content,
      id: property.id
    });
  }

  searchInActionCardsOrProcedures(searchString, obj) {
    let result = [];
    for (var i = 0; i < obj.length; i++) {
      if (obj[i] && obj[i].description) {
        const { description: heading } = obj[i];
        if (result.filter((el) => el.id === obj[i].id).length === 0) {
          if (obj[i].chapters && obj[i].chapters.length > 0) {
            const newVal = obj[i]['chapters'].filter(
              (el) =>
                el.content.match(searchString.toLowerCase(), 'i') ||
                (el.description &&
                  el.description.match(searchString.toLowerCase(), 'i'))
            );
            if (
              newVal.length > 0 ||
              heading.match(searchString.toLowerCase(), 'i')
            ) {
              result.push({
                ...obj[i],
                chapters: newVal,
                onPress: (content, description, id, contentType) =>
                  this.onOptionPressed(content, description, id, contentType)
              });
            }
          }
        }
      }
    }
    return result;
  }

  handleSearch = (searchString) => {
    const { actionCards, procedures } = this.props;
    if (searchString.length > 0) {
      const drugsResult = this.searchInDrugs(searchString);
      const actionCardsResult = this.searchInActionCardsOrProcedures(
        searchString,
        actionCards
      );
      const proceduresResult = this.searchInActionCardsOrProcedures(
        searchString,
        procedures
      );
      this.setState({
        results: {
          actioncard:
            actionCardsResult && actionCardsResult.length > 0
              ? actionCardsResult
              : undefined,
          procedure:
            proceduresResult && proceduresResult.length > 0
              ? proceduresResult
              : undefined,
          drugs: drugsResult && drugsResult.length > 0 ? drugsResult : undefined
        }
      });
    } else {
      this.setState({ results: {} });
    }
  };

  private getTotalSearchResult = () => {
    const { results } = this.state;
    let total = 0;
    if (results && Object.keys(results).length > 0) {
      Object.keys(results).forEach(
        (el) => (total += results[el] ? results[el].length : 0)
      );
    } else {
      return 0;
    }
    return total;
  };

  render() {
    const {
      searchString,
      results,
      showComment,
      animateModal,
      filter
    } = this.state;

    return (
      <AnimatedAvoidKeyboardContainer>
        <View style={{ backgroundColor: ColorTheme.TERTIARY, flex: 1 }}>
          <View style={{ marginTop: 10, flex: 1 }}>
            <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
              <UserInputField
                placeholder='Search for drugs, action cards and practical procedures...'
                value={searchString}
                onChangeText={(value) => {
                  this.setState({ searchString: value });
                  this.handleSearch(value);
                }}
                style={{ flex: 1 }}
                textInputStyle={{
                  fontSize: ColorTheme.FONT_SIZE * 0.75,
                  fontWeight: '900'
                }}
              />
              {searchString.length > 0 && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0
                  }}
                  onPress={() =>
                    this.setState({ searchString: '', results: {} })
                  }
                >
                  <ANTICONS
                    name='closecircle'
                    size={20}
                    color='black'
                    style={{ alignSelf: 'center' }}
                  />
                </TouchableOpacity>
              )}
            </View>
            {results && Object.keys(results).length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 10
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 14,
                      color: COLOR.IMPORTANT_RED,
                      marginVertical: 10
                    }}
                  >
                    Total Results: {this.getTotalSearchResult()}
                  </AppText>
                  <TouchableOpacity
                    onPress={() => this.setState({ showComment: true })}
                  >
                    <Image
                      source={require('../../img/filter.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  contentContainerStyle={{
                    flexGrow: 1
                  }}
                  data={
                    results &&
                    Object.keys(results).length > 0 &&
                    Object.keys(results)
                  }
                  keyExtractor={(item, index) =>
                    `search-result-group-${index}-${item}`
                  }
                  renderItem={({ item }) =>
                    results[item] &&
                    filter.indexOf(item) !== -1 && (
                      <View>
                        <AppText
                          style={{
                            backgroundColor: ColorTheme.PRIMARY,
                            color: COLOR.WHITE,
                            paddingVertical: 20,
                            borderTopWidth: 1,
                            paddingHorizontal: 10,
                            borderTopColor: '#cdcdcd',
                            textTransform: 'capitalize'
                          }}
                        >
                          {item === 'actioncard'
                            ? 'Action Cards'
                            : item === 'procedure'
                            ? 'Practial Procedures'
                            : item.replace('-', ' ')}
                          ({results[item] ? results[item].length : 0})
                        </AppText>
                        <FlatList
                          keyExtractor={(el: any, index) =>
                            `search-result-group-${item}-${index}`
                          }
                          data={results[item]}
                          renderItem={({ item: el }) => {
                            return (
                              el && (
                                <Accordian
                                  headerPress={
                                    item === 'drugs'
                                      ? () => this.goToDrug(el)
                                      : el.chapters && el.chapters.length === 1
                                      ? () =>
                                          el.onPress &&
                                          el.onPress(
                                            el.chapters,
                                            el.description || '',
                                            el.id,
                                            item.replace('-', '')
                                          )
                                      : undefined
                                  }
                                  showChevron={
                                    el &&
                                    el.chapters &&
                                    el.chapters.constructor.name === 'Array' &&
                                    el.chapters.length > 1
                                      ? true
                                      : false
                                  }
                                  style={[
                                    {
                                      paddingVertical: 20,
                                      borderTopWidth: 1,
                                      paddingHorizontal: 10,
                                      borderTopColor: '#cdcdcd'
                                    },
                                    { marginLeft: 20 }
                                  ]}
                                  title={el.description || ''}
                                >
                                  {el &&
                                    el.chapters &&
                                    el.chapters.constructor.name === 'Array' &&
                                    el.chapters.length > 1 && (
                                      <FlatList
                                        keyExtractor={(el: any, index) =>
                                          `search-result-group-${item}-${index}`
                                        }
                                        data={el.chapters}
                                        renderItem={({
                                          item: subChildern,
                                          index: subChildernIndex
                                        }) => {
                                          return (
                                            <TouchableOpacity
                                              style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#cdcdcd'
                                              }}
                                              onPress={() =>
                                                this.onOptionPressed(
                                                  [
                                                    {
                                                      content:
                                                        subChildern.chapters ||
                                                        subChildern.content
                                                    }
                                                  ],
                                                  subChildern.description,
                                                  subChildern.id,
                                                  item.replace('-', '')
                                                )
                                              }
                                            >
                                              <AppText
                                                style={{
                                                  marginVertical: 20,
                                                  paddingHorizontal: 40,
                                                  fontSize: 12
                                                }}
                                              >
                                                {`${subChildernIndex +
                                                  1 +
                                                  ')'} ${subChildern.label ||
                                                  subChildern.description}` ||
                                                  ''}
                                              </AppText>
                                            </TouchableOpacity>
                                          );
                                        }}
                                      />
                                    )}
                                </Accordian>
                              )
                            );
                          }}
                        />
                      </View>
                    )
                  }
                />
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 15
                }}
              >
                <AppText style={{ textAlign: 'center' }}>
                  {searchString.length > 0
                    ? 'No results found. Please try a different search'
                    : 'Search action cards, practical procedures and drugs'}
                </AppText>
              </View>
            )}
          </View>
        </View>
        <SwipeUpDownModal
          modalVisible={showComment}
          PressToanimate={animateModal}
          DisableHandAnimation={true}
          MainContainerModal={{ flex: 1 }}
          ContentModal={
            <View
              style={{
                width: '100%',
                position: 'absolute',
                bottom: 0
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ animateModal: true })}
                style={{ alignSelf: 'center', paddingBottom: 10 }}
              >
                <Image
                  style={{
                    height: 20,
                    width: 20
                  }}
                  source={require('../../img/notification_message/close.png')}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  padding: 40
                }}
              >
                <AppText
                  style={{
                    fontSize: ColorTheme.FONT_SIZE * 1.25
                  }}
                >
                  Filter By Type
                </AppText>
                <View>
                  {this.allFilters.map((el) => (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', marginTop: 20 }}
                    >
                      <CheckBox
                        checked={filter.indexOf(el) !== -1}
                        onPress={() => {
                          let newFilter = Object.assign([], filter);
                          const i = filter.indexOf(el);
                          if (i === -1) {
                            newFilter.push(el);
                          } else {
                            newFilter.splice(i, 1);
                          }
                          this.setState({ filter: newFilter });
                        }}
                        label={
                          el === 'actioncard'
                            ? 'Action Cards'
                            : el === 'procedure'
                            ? 'Practical Procedures'
                            : 'Drugs'
                        }
                      />
                      <AppText
                        style={{
                          textTransform: 'capitalize',
                          marginLeft: 10
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          }
          onClose={() =>
            this.setState({ showComment: false, animateModal: false })
          }
        />
      </AnimatedAvoidKeyboardContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];
  let actionCardsRetval = [];
  let proceduresRetval = [];
  for (var i = 0; i < language['modules'].length; i++) {
    const { actionCards, procedures } = language['modules'][i];
    (actionCards || []).forEach((el) => {
      actionCardsRetval.push(language[el]);
    });
    (procedures || []).forEach((el) => proceduresRetval.push(language[el]));
  }
  actionCardsRetval = actionCardsRetval.filter(function(item, pos) {
    return actionCardsRetval.indexOf(item) == pos;
  });
  proceduresRetval = proceduresRetval.filter(function(item, pos) {
    return proceduresRetval.indexOf(item) == pos;
  });
  const { drugs, screen } = language;
  return {
    drugs,
    actionCards: actionCardsRetval,
    procedures: proceduresRetval,
    screen,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
};

export default connect(mapStateToProps)(Search);
