import React, { useState } from 'react';
import EventListener from 'react-event-listener'
import { Table } from 'react-bootstrap'

function zeroPadding(num,length){
  return ('0000000000' + num).slice(-length);
}

const getTimeString = (timestamp) => {
  const current = new Date()
  const d = new Date(timestamp)
  const year  = d.getFullYear()
  const month = d.getMonth() + 1;
  const day   = d.getDate();
  if (year !== current.getFullYear()) {
    return `${year}/${zeroPadding(month, 2)}/${zeroPadding(day, 2)}`
  }

  if (month !== current.getMonth()+1) {
    return `${month}/${day}`
  }

  if (day !== current.getDate()) {
    return `${month}/${day}`
  }

  return `${zeroPadding(d.getHours(), 2)}:${zeroPadding(d.getMinutes(), 2)}`
}

const getDisplayName = (userId, members) => {
  return members[userId] ? members[userId].displayName : userId
}

const HistoryListItem = ({timestamp, targetUser, amount, comment}) => (
  <table>
    <tbody>
      <tr>
        <td colSpan="2" className='transaction-datetime'>{getTimeString(timestamp)}</td>
      </tr>
      <tr>
        <td className='transaction-partner'>{targetUser}</td>
        {
          (amount >=0) ? (
            <td className='transaction-amount-in'>+{amount.toLocaleString()}</td>
          ) : (
            <td className='transaction-amount-out'>{amount.toLocaleString()}</td>
          )
        }
      </tr>
      {
        (comment) ?
          (
            <tr>
              <td colSpan="2" className="transaction-message">{comment}</td>
            </tr>
          )
        : ""
      }
    </tbody>
  </table>
)

const HistoryList = ({userId, group, transactionHistory}) => (
  <dl className='transaction-history-list'>
    {
      transactionHistory
        .sort((a, b) => { return b.timestamp - a.timestamp; })
        .map(({timestamp, from_account, to_account, amount, comment}, index)=> (
          <dt key={index}>
            <HistoryListItem
              timestamp={timestamp}
              comment={comment}
              amount={(to_account === userId) ? amount : -amount}
              targetUser={(to_account === userId) ?
                getDisplayName(
                  from_account,
                  group.members,
                ):
                getDisplayName(
                  to_account,
                  group.members,
                )
              }
            />
          </dt>
        ))
    }
  </dl>
)

const HistoryTable = ({group, transactionHistory}) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">取引日時</th>
        <th scope="col">FROM</th>
        <th scope="col">TO</th>
        <th scope="col" className="text-right">金額(selan)</th>
        <th scope="col" className="text-left">コメント</th>
      </tr>
    </thead>
    <tbody>
      {
        transactionHistory
          .sort((a, b) => { return b.timestamp - a.timestamp; })
          .map(({timestamp, from_account, to_account, amount, comment}, index)=> (
            <tr key={index}>
              <td>{getTimeString(timestamp)}</td>
              <td>{getDisplayName(from_account, group.members)}</td>
              <td>{getDisplayName(to_account, group.members)}</td>
              <td className="text-right">{amount.toLocaleString()}</td>
              <td className="text-left">{comment ? comment : ''}</td>
            </tr>
          ))
      }
    </tbody>
  </Table>
)

const TransactionHistory = ({group, transactionHistory}) => {
  const getListMode = () => window.innerWidth < 600
  const [isListMode, setListMode] = useState(getListMode())

  return (
    <section className="transaction-log">
      <h3>取引履歴</h3>
      <EventListener target="window" onResize={()=>setListMode(getListMode())} />
      {
        isListMode ? (
          <HistoryList
            transactionHistory={transactionHistory}
            userId={group.memberId}
            group={group}
          />
        ) : (
          <HistoryTable
            transactionHistory={transactionHistory}
            userId={group.memberId}
            group={group}
          />
        )
      }
    </section>
  )
}

export default TransactionHistory
