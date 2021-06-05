import { ApiGroup, ApiRecord, RestApi, ThankshellApi } from "./thankshell";


export interface Group {
  memberId: string,
  members: {[key: string]: {state: string, displayName: string}},
  groupName: string,
  tokenName: string,
  logoUri: string,
}


export type TransactionType = 'send' | 'receive';


export interface Record {
  type: TransactionType,
  memberName: string,
  amount: number,
  comment: string,
  datetime: Date,
}


export default class GroupRepository {
  groupId: string;
  api: ThankshellApi;

  constructor(groupId: string, api: RestApi) {
    this.groupId = groupId;
    this.api = new ThankshellApi(api);
  }

  async send(fromMemberId: string, toMemberId: string, amount: number, comment: string): Promise<void> {
    await this.api.createTransaction('selan', {
      from:    fromMemberId,
      to:      toMemberId,
      amount:  amount,
      comment: comment,
    });
  }

  async updateMemberName(value: string): Promise<void> {
    await this.api.updateUser(this.groupId, {displayName: value});
  }

  async getGroup(): Promise<Group> {
    const apiGroup = await this.api.getGroup(this.groupId);

    return {
      groupName: 'sla',
      logoUri: "/images/logo.png",
      ...apiGroup,
    };
  }

  async getHolding(memberId: string): Promise<number> {
    return await this.api.getHolding(this.groupId, memberId);
  }

  async getTransactions(group: any, memberId: string): Promise<Record[]> {
    const records = await this.api.loadTransactions(this.groupId, memberId);

    return this.__convert(records, group);
  } 

  __convert (records: [], group: ApiGroup): Record[] {
    return records.map((record)=>this.convertRecord(record, group));
  }

  getType (memberId: string, fromMemberId: string, toMemberId: string) {
    if (memberId === fromMemberId) {
      return 'send';
    }
    if (memberId === toMemberId) {
      return 'receive';
    }

    // FIXME
    return 'send';
  };

  getMemberName (memberId: string, members: {[key: string]: {displayName: string}}) {
    return members[memberId] ? members[memberId].displayName : memberId
  };

  convertRecord (record: ApiRecord, group: ApiGroup): Record {
    const transactionType = this.getType(group.memberId, record.from_account, record.to_account);
    return (transactionType === 'send') ? {
      type: transactionType,
      memberName: this.getMemberName(record.to_account, group.members),
      amount: record.amount,
      comment: record.comment,
      datetime: new Date(record.timestamp),
    } : {
      type: transactionType,
      memberName: this.getMemberName(record.from_account, group.members),
      amount: record.amount,
      comment: record.comment,
      datetime: new Date(record.timestamp),
    }
  };
};
