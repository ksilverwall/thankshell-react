import React from 'react';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import ErrorMessage from 'components/ErrorMessage';

interface PropTypes {
  message: string,
  groupId: string,
  groupName: string,
  tokenName: string,
  balance: number|null,
  logoUri: string,
  sendTokenButton: JSX.Element,
  memberSettingsView: JSX.Element,
  historyPanel: JSX.Element,
};

export default (props: PropTypes) => {
  return (
    <>
      <ErrorMessage message={props.message}/>
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
          {props.historyPanel}
        </section>
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </>
  );
};
