import React from 'react';
import ReactMarkdown from 'react-markdown';

import ReadText from 'components/app/ReadText';
import FooterPanel from 'components/organisms/FooterPanel';
import TextPageTemplate from 'components/templates/TextPageTemplate';


export default () => {
  return <ReadText
    path='/text/tos.md'
    render={(text)=>(
      <TextPageTemplate
        markdown={<ReactMarkdown source={text}/>}
        footer={<FooterPanel/>}
      />
    )}
  />
};
