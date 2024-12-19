import React, { Component } from "react";
import { View, StyleSheet, SectionList } from "react-native";
// import ListView from "deprecated-react-native-listview";

import { connect } from "react-redux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import DrugListItem from "../Components/DrugListItem";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "../Components/AppText";
import * as helpers from "../Utils/helpers";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { analytics } from "../Utils/analytics";

const styles = StyleSheet.create({
  scrollableTabView: {
    flex: 1,
    backgroundColor: ColorTheme.SECONDARY,
  },
  listViewContainer: {
    backgroundColor: ColorTheme.TERTIARY,
  },
  separator: {
    height: 1,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: ColorTheme.SEPARATOR,
  },
  header: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: ColorTheme.SECONDARY,
  },
});

class DrugListScreen extends Component {
  constructor(props) {
    super(props);

    let all_drugs = getDrugs(props.drugs, props.language);
    let module_drugs = getDrugs(props.specified_drugs, props.language);
    // console.log("allDrugs", props.drugs, "moduleDrugs", props.specified_drugs)
    const all = this.formatData(all_drugs);
    const module = this.formatData(module_drugs);
    const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
    const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
    // const ds = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2,
    //   sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    //   getSectionData,
    //   getRowData,
    // });

    this.state = {
      specified: props.specified_drugs.length > 0,
      // dataSourceAll: ds.cloneWithRowsAndSections(all.dataBlob, all.sectionIds, all.rowIds),
      // dataSourceModule: ds.cloneWithRowsAndSections(module.dataBlob, module.sectionIds, module.rowIds),
      dataSourceAll: all,
      dataSourceModule: module,
    };
  }

  formatData(data) {
    // We're sorting by alphabetically so we need the alphabet
    const alphabet_string = this.props.getTextFromCMS(
      "alphabet",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ"
    );
    let alphabet = "";
    if (alphabet_string.indexOf(" ") < 0) {
      alphabet = alphabet_string.split("");
    } else {
      alphabet = alphabet_string.split(" ");
    }

    // Need somewhere to store our data
    const dataBlob = {};
    const sectionIds = [];
    const rowIds = [];

    const formattedData = [];
    alphabet.map((character, index) => {
      const formatData = {};
      //Get only drugs with rich text content
      const valid_data = data.filter((data) => data && data.content.length > 0);
      // Get drugs whose name starts with the current letter
      const items = valid_data.filter(
        (user) => user.description.toUpperCase().indexOf(character) === 0
      );
      if (items.length > 0) {
        formattedData.push({ title: character, data: items });
      }
    });
    // Each section is going to represent a letter in the alphabet so we loop over the alphabet
    for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
      // Get the character we're currently looking for
      const currentChar = alphabet[sectionId];

      //Get only drugs with rich text content
      const valid_data = data.filter((data) => data && data.content.length > 0);
      // Get drugs whose name starts with the current letter
      const users = valid_data.filter(
        (user) => user.description.toUpperCase().indexOf(currentChar) === 0
      );

      // If there are any users who have a first name starting with the current letter then we'll
      // add a new section otherwise we just skip over it
      if (users.length > 0) {
        // Add a section id to our array so the listview knows that we've got a new section
        sectionIds.push(sectionId);

        // Store any data we would want to display in the section header. In our case we want to show
        // the current character
        dataBlob[sectionId] = { character: currentChar };

        // Setup a new array that we can store the row ids for this section
        rowIds.push([]);

        // Loop over the valid users for this section
        for (let i = 0; i < users.length; i++) {
          // Create a unique row id for the data blob that the listview can use for reference
          const rowId = `${sectionId}:${i}`;

          // Push the row id to the row ids array. This is what listview will reference to pull
          // data from our data blob
          rowIds[rowIds.length - 1].push(rowId);

          // Store the data we care about for this row
          dataBlob[rowId] = users[i];
        }
      }
    }
    console.log("formattedData", JSON.stringify(formattedData));
    return formattedData;
    // return { dataBlob, sectionIds, rowIds };
  }

  render() {
    const { dataSourceAll, dataSourceModule } = this.state;
    const { getTextFromCMS } = this.props;

    const {
      screen,
      drugs,
      specified_drugs,
      language,
      selectedModule,
    } = this.props;

    const hasSpecifiedDrugs = specified_drugs.length > 0;
    console.log("Has specified drug list: ", hasSpecifiedDrugs);
    const moduleDrugTab = hasSpecifiedDrugs ? (
      <SectionList
        tabLabel={getTextFromCMS("module_drugs", "specified drug list")}
        ListHeaderComponent={() => (
          <Header style={styles.header}>
            {getTextFromCMS("module_drugs_description", "drugs specified for")}
            {language[selectedModule].description}
          </Header>
        )}
        ItemSeparatorComponent={(sectionId, rowId) => (
          <View key={rowId} style={styles.separator} />
        )}
        sections={dataSourceModule}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => {
          const { content, description, id } = item;
          // console.log("renderItem", item)
          return (
            <DrugListItem onPress={() => this.goToDrug(item)}>
              {description}
            </DrugListItem>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeader character={title} />
        )}
      />
    ) : null;
    // <ListView tabLabel={screen.module_drugs}
    //   style={styles.listViewContainer}
    //   dataSource={this.state.dataSourceModule}
    //   removeClippedSubviews={false} //To prevent that the ListView will render empty until scrolled. IOS only problem!
    //   renderRow={(data) => <DrugListItem onPress={() => this.goToDrug(data)}>{data.description}</DrugListItem>}
    //   renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
    //   renderHeader={() => <Header style={styles.header}>{language.screen.module_drugs_description ? language.screen.module_drugs_description : 'drugs specified for'} {language[selectedModule].description} </Header>}
    //   renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
    //   renderFooter={() => <View style={{
    //     height: 1, marginTop: -1, backgroundColor: ColorTheme.TERTIARY, shadowColor: 'rgba(0, 0, 0, 0.25)',
    //     shadowRadius: 3,
    //     shadowOffset: {
    //       height: 3,
    //       width: 1,
    //     }
    //   }} />}
    // />

    return (
      <View style={{ flex: 1 }}>
        <AnalyticsTracker
          eventType="druglist"
          eventData={`:${this.state.specified ? `specified:` : `all`}`}
        />
        <ScrollableTabView
          tabBarTextStyle={{
            color: ColorTheme.TEXT,
            fontFamily: helpers.getFont(),
            fontWeight: "500",
          }}
          tabBarUnderlineStyle={{ backgroundColor: ColorTheme.PRIMARY }}
          style={styles.scrollableTabView}
          onChangeTab={(obj) => {
            if (obj.i !== obj.from) {
              switch (obj.i) {
                case 0:
                  // console.log('analytics', 'changeDruglistFilter', ':specified:')
                  this.setState({ specified: true });
                  analytics.event("changeDruglistFilter", ":specified:");
                  break;
                case 1:
                  // console.log('analytics', 'changeDruglistFilter', ':all:')
                  this.setState({ specified: false });
                  analytics.event("changeDruglistFilter", ":all:");
                  break;
                default:
                  break;
              }
            }
          }}
        >
          {moduleDrugTab}
          <SectionList
            tabLabel={screen.all_drugs}
            ListHeaderComponent={() => (
              <Header style={styles.header}>
                {getTextFromCMS(
                  "all_drugs_description",
                  "all drugs in application"
                )}
              </Header>
            )}
            ItemSeparatorComponent={(sectionId, rowId) => (
              <View key={rowId} style={styles.separator} />
            )}
            sections={dataSourceAll}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => {
              const { content, description, id } = item;
              // console.log("renderItem", item)
              return (
                <DrugListItem onPress={() => this.goToDrug(item)}>
                  {description}
                </DrugListItem>
              );
            }}
            renderSectionHeader={({ section: { title } }) => (
              <SectionHeader character={title} />
            )}
          />
          {/* <ListView tabLabel={screen.all_drugs}
            style={styles.listViewContainer}
            dataSource={this.state.dataSourceAll}
            removeClippedSubviews={false} //To prevent that the ListView will render empty until scrolled. IOS only problem!
            renderRow={(data) => <DrugListItem onPress={() => this.goToDrug(data)}>{data.description}</DrugListItem>}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderHeader={() => <Header style={styles.header}>{(screen.all_drugs_description) ? screen.all_drugs_description : 'all drugs in application'}</Header>}
            renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
          /> */}
        </ScrollableTabView>
      </View>
    );
  }

  goToDrug(property) {
    this.props.navigation.navigate("drug", {
      title: property.description,
      backButtonTitle: helpers.getBackText(
        this.props.getTextFromCMS("back", "back")
      ),
      content: property.content,
      id: property.id,
    });
  }
}

function getDrugs(array, lang) {
  let drugs = [];
  for (item in array) {
    if (array[item].id) {
      drugs.push(lang[array[item].id]);
    } else drugs.push(lang[array[item]]);
  }
  return drugs;
}

const Header = (props) => (
  <View style={styles.header}>
    <AppText style={{ color: ColorTheme.SUB_LABEL }}>{props.children}</AppText>
  </View>
);
const SectionHeader = (props) => (
  <View
    style={{
      flex: 1,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 16,
      justifyContent: "center",
      backgroundColor: ColorTheme.SECONDARY,
    }}
  >
    <AppText
      style={{
        fontWeight: "500",
        paddingLeft: 8,
        paddingRight: 8,
        fontSize: ColorTheme.FONT_SIZE * 1.25,
      }}
    >
      {props.character}
    </AppText>
    <View
      style={{ height: 1, backgroundColor: ColorTheme.SEPARATOR, marginTop: 8 }}
    />
  </View>
);

function mapStateToProps(state, props) {
  const { selectedLang, contentByLanguage, selectedModule } = state;
  const { screen, drugs } = contentByLanguage[selectedLang];
  const language = contentByLanguage[selectedLang];
  let specified_drugs = [];
  const getTextFromCMS = (screenKey, fallback) =>
    helpers.getTextFromCMS(screen, screenKey, fallback);

  if (
    selectedModule !== "none" &&
    typeof contentByLanguage[selectedLang][selectedModule !== "undefined"] &&
    props.navigation.state.params.module
  )
    specified_drugs = contentByLanguage[selectedLang][selectedModule].drugs;
  return {
    screen,
    drugs,
    specified_drugs,
    language,
    selectedModule,
    getTextFromCMS,
  };
}

export default connect(mapStateToProps)(DrugListScreen);
