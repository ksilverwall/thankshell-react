import React from 'react';


interface PropTypes {
  errorMessageElement: JSX.Element,
  headerElement: JSX.Element,
  controlPanelElement: JSX.Element,
  historyPanel: JSX.Element,
  footerElement: JSX.Element,
};

export default (props: PropTypes) => {
  return (
    <>
      {props.errorMessageElement}
      <header>
        {props.headerElement}
      </header>
      <main>
        <section>
          {props.controlPanelElement}
        </section>
        <section>
          {props.historyPanel}
        </section>
      </main>
      <footer>
        {props.footerElement}
      </footer>
    </>
  );
};
