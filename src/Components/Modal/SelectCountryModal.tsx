import React from "react";
import { TouchableOpacity, FlatList, View, ViewStyle, TextStyle } from "react-native";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { updateCountryAndClose } from "../../Actions/modalActions";
import AppText from "../../Components/AppText";
import ColorTheme from "../../Constants/ColorTheme";
import { StoreState } from "../../Reducers/reducers";
import { countryInfo } from "../../Utils/countries";
import * as helpers from "../../Utils/helpers";
import FramedButton from "../FramedButton";

interface CountryEntry {
    iso: string;
    name: string;
    native: string;
    phone: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string;
    numeric: string;
}

interface CountryEntryViewProps {
    item: CountryEntry;
    active: boolean;
    onClick(value: string): void;
}
const CountryEntryView = ({ item, active, onClick }: CountryEntryViewProps) => {
    const wrapperStyle: ViewStyle = {height: 60, justifyContent: "center", borderBottomColor: ColorTheme.TERTIARY, borderBottomWidth: 2 };
    const nativeStyle: TextStyle = { textAlign: "center", fontWeight: active ? "bold" : "normal", color: active ? ColorTheme.PRIMARY : "black" };
    const nameStyle: TextStyle = { fontSize: ColorTheme.FONT_SIZE * 0.7, marginTop: 2, textAlign: "center", fontWeight: active ? "bold" : "normal" };

    const clickHandler = () => {
        onClick(item.iso);
    }

    return (
        <TouchableOpacity style={wrapperStyle} onPress={clickHandler}>
            <AppText style={nativeStyle}>{item.native}</AppText>
            <AppText style={nameStyle}>{item.name}</AppText>
        </TouchableOpacity>
    )
}

interface State {
    country?: string;
}

interface OwnProps {}

interface PropsFromDispatch {
    updateCountry(country: string): void;
}

interface PropsFromState {
    screen: { [key: string]: string };
    language: { [key: string]: string };
    country: string | null;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

const wrapperStyle: ViewStyle = {
    backgroundColor: ColorTheme.WHITE,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: ColorTheme.WHITE,
    height: "100%"
}

const headerStyle: TextStyle = {
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
}

const descStyle: TextStyle = {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
}

class SelectCountryModal extends React.Component<Props, State> {
    countries: CountryEntry[];
    constructor(props: Props) {
        super(props);

        this.state = {
            country: this.props.country,
        };

        this.countries = Object.keys(countryInfo.countries)
            .map((key) => ({ iso: key, ...countryInfo.countries[key] }))
            .sort((c1, c2) => (c1.name || "").localeCompare(c2.name || ""));
    }

    private _getTextFromCMS(screenKey, fallback) {
        return helpers.getTextFromCMS(this.props.screen, screenKey, fallback);
    }

    public render() {
        const { country } = this.state;
        const header = this._getTextFromCMS("select_your_country_header", "please select your country");
        const description = this._getTextFromCMS("select_your_country_description", "certain functionality in the app needs to know which country you are in.");

        const initScroll = this.state.country === undefined ? 0 : this.countries.findIndex(c => c.iso === this.state.country);

        const onChange = (iso: string) => {
            this.setState({country: iso});
        }

        const onFinish = () => {
            const { country } = this.state;
            if (country) {
                this.props.updateCountry(country);
            }
        }

        return (
            <View style={wrapperStyle}>
                <AppText style={headerStyle}>{header}</AppText>
                <AppText style={descStyle}>{description}</AppText>
                <FlatList
                    // style={{height: "100%"}}
                    data={this.countries}
                    extraData={this.state}
                    renderItem={({item}) => <CountryEntryView item={item} active={country === item.iso} onClick={onChange} />}
                    initialScrollIndex={initScroll}
                    getItemLayout={(_, index) => ({ length: 60, offset: 60 * index, index })}
                    keyExtractor={(item) => item.iso}
                    showsVerticalScrollIndicator={false}
                />
                <FramedButton disabled={country === undefined} onPress={onFinish} label={this._getTextFromCMS("ok", "ok")} />
            </View>
        );
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (state) => ({
    screen: state.contentByLanguage[state.selectedLang].screen,
    language: state.contentByLanguage[state.selectedLang],
    country: state.selectedCountry,
});

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (dispatch) => ({
    updateCountry(country) {
        dispatch(updateCountryAndClose({country}));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectCountryModal);
