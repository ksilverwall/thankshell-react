import React from 'react';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import HistoryPanel, {Record} from 'components/organisms/HistoryPanel';

interface PropTypes {
  groupName: string,
  tokenName: string,
  records: Record[],
  balance: number,
  logoUri: string,
};

export default (props: PropTypes) => {
  return (
    <>
      <header>
        <HeaderPanel
          groupName={props.groupName}
          logoUri={props.logoUri}
      />
      </header>
      <article>
        <section>
          <ControlPanel balance={props.balance} tokenName={props.tokenName}/>
        </section>
        <section>
          <HistoryPanel records={props.records}/>
        </section>
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </>
  );
};
