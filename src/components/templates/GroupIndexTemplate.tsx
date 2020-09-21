import React from 'react';
import HeaderPanel from 'components/organisms/HeaderPanel';
import FooterPanel from 'components/organisms/FooterPanel';
import ControlPanel from 'components/organisms/ControlPanel';
import HistoryPanel from 'components/organisms/HistoryPanel';

interface PropTypes {
  groupName: string
};

export default (props: PropTypes) => {
  const records = [
    {
      type: 'receive',
      memberName: "田中",
      amount: 100,
      comment: "あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
      datetime: new Date('2020-09-15 10:10:10'),
    },
    {
      type: 'send',
      memberName: "田中",
      amount: 100,
      comment: "XXXXXX",
      datetime: new Date('2020-09-15 03:00:00'),
    },
    {
      type: 'receive',
      memberName: "田中",
      amount: 100,
      comment: "Yes I do",
      datetime: new Date('2020-08-15 10:10:10'),
    },
    {
      type: 'send',
      memberName: "田中",
      amount: 100,
      comment: "XXXXXX",
      datetime: new Date('2020-08-15 03:00:00'),
    },
  ];

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
          <HistoryPanel records={records}/>
        </section>
      </article>
      <footer>
        <FooterPanel/>
      </footer>
    </>
  );
};
