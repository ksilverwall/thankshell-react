import React from 'react';

const TextPageTemplate = ({ markdown, footer }: {
  markdown: JSX.Element,
  footer: JSX.Element,
}) => {
  return (
    <main>
      <article style={{ background: 'white', margin: '20px', padding: '10px' }}>
        {markdown}
      </article>
      <footer>
        {footer}
      </footer>
    </main>
  );
};

export default TextPageTemplate;
