import React from 'react';
import ReactMarkdown from 'react-markdown';

import ReadText from 'components/app/ReadText';
import FooterPanel from 'components/organisms/FooterPanel';


export default function TosPage() {
  return (
    <main>
      <article style={{ background: 'white', margin: '20px', padding: '10px' }}>
        <ReadText path='/text/tos.md' render={(text) => <ReactMarkdown source={text} />} />
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </main>
  );
};
