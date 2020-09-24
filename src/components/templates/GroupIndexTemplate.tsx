import React, { useState } from 'react';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import HistoryPanel, {Record} from 'components/organisms/HistoryPanel';

interface PropTypes {
  groupId: string,
  groupName: string,
  tokenName: string,
  records: Record[],
  balance: number|null,
  logoUri: string,
  sendTokenButton: JSX.Element,
};

export default (props: PropTypes) => {
  return (
    <>
      <header>
        <HeaderPanel
          groupId={props.groupName}
          groupName={props.groupName}
          logoUri={props.logoUri}
      />
      </header>
      <article>
        <section>
          <ControlPanel
            balance={props.balance}
            tokenName={props.tokenName}
            sendTokenButton={props.sendTokenButton}
          />
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
