import React from 'react';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import HistoryPanel from 'components/organisms/HistoryPanel';
import MemberSettingsView from 'components/organisms/MemberSettingsView';

interface PropTypes {
  groupId: string,
  groupName: string,
  tokenName: string,
  balance: number|null,
  logoUri: string,
  sendTokenButton: JSX.Element,
  memberSettingsView: JSX.Element,
  blocks: { ym: Date; items: JSX.Element[]; }[],
};

export default (props: PropTypes) => {
  return (
    <>
      <header>
        <HeaderPanel
          groupId={props.groupName}
          groupName={props.groupName}
          logoUri={props.logoUri}
          memberSettingsView={props.memberSettingsView}
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
          <HistoryPanel blocks={props.blocks}/>
        </section>
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </>
  );
};
