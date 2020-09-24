import React from 'react';
import style from './HistoryPanel.module.css';

const Separater = () => <hr/>;

const SeparateList = (props: {separater: React.FunctionComponent, children: JSX.Element[]}) => {
  return (
    <>
      {
        props.children.map((item, index) => [item,  <props.separater key={`separater_${index}`}/>]).flat(Infinity).slice(0, -1)
      }
    </>
  );
};

const GroupList = (props: {datetime: Date, items: JSX.Element[]}) => {
  return (
    <>
      <div className={style.group_label}>
        <p>{props.datetime.toLocaleString()}</p>
      </div>
      <SeparateList separater={Separater}>
        {
          props.items.map((item, index) => (
            <div className={style.item} key={index}>
              {item}
            </div>
          ))
        }
      </SeparateList>
    </>
  );
};

export default (props: {blocks: { ym: Date; items: JSX.Element[]; }[]}) => {
  return (
    <div className={style.container}>
      {
        props.blocks.map((block, index)=>(
          <GroupList key={index} datetime={block.ym} items={block.items}/>
        ))
      }
    </div>
  );
};
