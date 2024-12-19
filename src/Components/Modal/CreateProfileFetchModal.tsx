import * as React from 'react';
import FetchingBox from '../FetchingBox';
interface OwnProps {
  getTextFromCMS(key: string, fallback: string): string;
  method?: string;
}

export default class CreateProfileFetchModal extends React.Component<OwnProps> {
  render() {
    const { getTextFromCMS, method } = this.props;
    const loadingText = getTextFromCMS('creating_user', 'creating user...');

    return <FetchingBox loadingText={loadingText} />;
  }
}
