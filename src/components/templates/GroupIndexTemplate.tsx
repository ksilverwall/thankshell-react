import React from 'react';


interface PropTypes {
  errorMessageElement: JSX.Element,
  headerElement: JSX.Element,
  controlPanelElement: JSX.Element,
  historyPanel: JSX.Element,
  modalElement: JSX.Element|null,
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
        <aside>
          {props.modalElement}
        </aside>
      </main>
      <footer>
        {props.footerElement}
      </footer>
    </>
  );
};
