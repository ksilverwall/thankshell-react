import React from 'react';
import ReactMarkdown from 'react-markdown';

import ReadText from 'components/app/ReadText';
import FooterPanel from 'components/organisms/FooterPanel';
import TextPageTemplate from 'components/templates/TextPageTemplate';


const TosPage = () => {
  return <ReadText
    path='/text/tos.md'
    render={(text)=>(
      <TextPageTemplate
        markdown={<ReactMarkdown children={text}/>}
        footer={<FooterPanel/>}
      />
    )}
  />
};

export default TosPage;
