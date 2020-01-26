import React from 'react'
import EventListener from 'react-event-listener'
import { Table } from 'react-bootstrap'


class HistoryList extends React.Component {
  getTimeString(timestamp) {
    let d = new Date(timestamp);
    let year  = d.getFullYear();
    let month = d.getMonth() + 1;
    let day   = d.getDate();
    let hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    let min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    let sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();

    return ( year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec );
  }

  render() {
    return (
      <dl className='transaction-history-list'>
        {
          this.props.transactionHistory.sort((a, b) => { return b.timestamp - a.timestamp; }).map((record)=> (
            <dt key={record.timestamp}>
              <table>
                <tbody>
                  <tr>
                    <td colSpan="2" className='transaction-datetime'>{this.getTimeString(record.timestamp)}</td>
                  </tr>
                  <tr>
                    <td className='transaction-partner'>{(record.to_account === this.props.userId) ? record.from_account : record.to_account}</td>
                    {
                      (record.to_account === this.props.userId) ? (
                        <td className='transaction-amount-in'>+{record.amount.toLocaleString()}</td>
                      ) : (
                        <td className='transaction-amount-out'>-{record.amount.toLocaleString()}</td>
                      )
                    }
                  </tr>
                  {
                    (record.comment) ?
                      (
                        <tr>
                          <td colSpan="2" className="transaction-message">{record.comment}</td>
                        </tr>
                      )
                    : ""
                  }
                </tbody>
              </table>
            </dt>
          ))
        }
      </dl>
    )
  }
}

class HistoryTable extends React.Component {
  getTimeString(timestamp) {
    let d = new Date(timestamp);
    let year  = d.getFullYear();
    let month = d.getMonth() + 1;
    let day   = d.getDate();
    let hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    let min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    let sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();

    return ( year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec );
  }

  render() {
    return (
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
            this.props.transactionHistory.sort((a, b) => { return b.timestamp - a.timestamp; }).map((record)=> (
              <tr>
                <td>{this.getTimeString(record.timestamp)}</td>
                <td>{record.from_account}</td>
                <td>{record.to_account}</td>
                <td className="text-right">{record.amount.toLocaleString()}</td>
                <td className="text-left">{record.comment ? record.comment : ''}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

class TransactionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isListMode: this.getListMode()
    }
  }

  getListMode() {
    return window.innerWidth < 600
  }

  handleResize() {
    this.setState({isListMode: this.getListMode()})
  }

  render() {
    return (
      <section className="transaction-log">
        <h3>取引履歴</h3>
        <EventListener target="window" onResize={this.handleResize.bind(this)} />
        {
          this.state.isListMode ? (
            <HistoryList transactionHistory={this.props.transactionHistory} userId={this.props.user.user_id}/>
          ) : (
            <HistoryTable transactionHistory={this.props.transactionHistory} userId={this.props.user.user_id}/>
          )
        }
      </section>
    )
  }
}

export default TransactionHistory
