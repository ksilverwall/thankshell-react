import React from 'react';
import ReactMarkdown from 'react-markdown';

import ReadText from 'components/app/ReadText';
import FooterPanel from 'components/organisms/FooterPanel';
import TextPageTemplate from 'components/templates/TextPageTemplate';


const PrivacyPolicyPage = () => {
  return <ReadText
    path='/text/privacy-policy.md'
    render={(text) => (
      <TextPageTemplate
        markdown={<ReactMarkdown source={text} />}
        footer={<FooterPanel/>}
      />
    )}
  />
}

export default PrivacyPolicyPage;
