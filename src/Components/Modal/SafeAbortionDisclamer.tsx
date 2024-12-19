import * as React from 'react';
import { View } from 'react-native';
import ColorTheme from '../../Constants/ColorTheme';
import AppText from '../AppText';
import { connect } from 'react-redux';

interface PropsFromState {
  selectedLang: string | null;
}

type Props = PropsFromState;

class SafeAbortionDisclamer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedLang } = this.props;
    const isFrench = selectedLang === '6a146956-9f21-206a-98cf-55db7b0a8301';
    const isUkraine = selectedLang === 'f2546fdb-9ef6-62e0-3ade-ed94cd3f1156';
    return (
      <View style={{ padding: 20 }}>
        <AppText
          style={{
            fontSize: ColorTheme.FONT_SIZE * 1.1,
            textAlign: 'center',
            marginBottom: 15,
            fontWeight: 'bold'
          }}
        >
          {isUkraine
            ? 'Модуль «Безпечний Аборт»'
            : isFrench
            ? 'Module Avortement Sécurisé'
            : 'Safe Abortion Module'}
        </AppText>
        <AppText>
          {isUkraine
            ? 'Зміст модуля «Безпечні Пологи - Аборт» базується на рекомендаціях ВООЗ (2022). Щоб отримати конкретні вказівки щодо забезпечення безпечних абортів у вашій країні, зверніться до національного законодавства та протоколів. Надання послуг щодо абортів має відповідати відповідним національним законам і нормам.'
            : isFrench
            ? 'Le contenu du module Avortement sécurisé est basé sur les directives de l’OMS (2022). Pour des conseils spécifiques sur la fourniture d’avortements sécurisés dans votre pays, veuillez consulter les lois et directives nationales. La fourniture de services d’avortement doit être conforme aux lois et réglementations nationales pertinentes.'
            : 'The content of the Safe Abortion module is based on WHO guidelines (2022). For specific guidance on safe abortion provision in your country, please consult national laws and guidelines. Provision of abortion services must comply with the national relevant laws and regulations.'}
        </AppText>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedLang: state.selectedLang
  };
}

export default connect(mapStateToProps)(SafeAbortionDisclamer);
