import React from 'react';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import HistoryPanel from 'components/organisms/HistoryPanel';

interface PropTypes {
  groupName: string
};

export default (props: PropTypes) => {
  return (
    <>
      <header>
        <HeaderPanel
          groupName={props.groupName}
          logoUri={"/images/logo.png"}
      />
      </header>
      <article>
        <section>
          <ControlPanel/>
        </section>
        <section>
          <HistoryPanel/>
        </section>
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </>
  );
};
