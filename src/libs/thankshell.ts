interface Auth {
  userhandler: {},
  getSession: () => {},
};

interface AuthSession {
  idToken: {jwtToken: string},
};


export interface ApiGroup {
  memberId: string,
  members: {[key: string]: {state: string, displayName: string}},
}

export interface ApiRecord {
  from_account: string,
  to_account: string,
  amount: number,
  comment: string,
  timestamp: number,
}

export class Session {
  auth: Auth;
  session: AuthSession | null;

  constructor(auth: Auth) {
    this.auth = auth;
    this.session = null;
  }

  getSession(): Promise<AuthSession> {
    return new Promise((resolve, reject) => {
      this.auth.userhandler = {
        onSuccess: resolve,
        onFailure: reject,
      };

      this.auth.getSession();
    })
  }

  async reload(): Promise<void> {
    this.session = await this.getSession()
    if (!this.session) {
      throw Error('セッションの読み込みに失敗しました。再読込してください')
    }
  }

  async getJwtToken() {
    if (!this.session) {
      await this.reload()
    }
    if (!this.session) {
      throw Error('セッションの読み込みに失敗しました。再読込してください')
    }
    return this.session.idToken.jwtToken
  }
}

export class RestApi {
  session: Session;
  basePath: string;

  constructor(session: Session, basePath: string) {
    this.session = session
    this.basePath = basePath
  }

  async getHeaders(): Promise<{}> {
    return {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: await this.session.getJwtToken()
    }
  }

  async get(path: string): Promise<{}> {
    const response = await fetch(this.basePath + path, {
      method: "GET",
      headers: await this.getHeaders(),
    })

    const body = await response.json();

    if (response.status !== 200) {
      throw new Error(response.status + ":" + body.message);
    }

    return body
  }

  async post(path: string, data: {}): Promise<{}> {
    const response = await fetch(this.basePath + path, {
      method: "POST",
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    const body = await response.json()

    if (response.status !== 200) {
      throw new Error(response.status + ":" + body.message);
    }

    return body
  }

  async put(path: string, data: {}): Promise<{status: number, body: {}}> {
    const response = await fetch(this.basePath + path, {
      method: "PUT",
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    return {
      status: response.status,
      body: await response.json(),
    }
  }

  async put2(path: string, data: {}): Promise<{}> {
    const response = await fetch(this.basePath + path, {
      method: "PUT",
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    const body = await response.json()

    if (response.status !== 200) {
      throw new Error(response.status + ":" + body.message);
    }

    return body
  }
  
  async patch(path: string, data: {}): Promise<{}> {
    const response = await fetch(this.basePath + path, {
      method: "PATCH",
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    const body = await response.json()

    if (response.status !== 200) {
      throw new Error(response.status + ":" + body.message);
    }

    return body
  }

  async delete(path: string): Promise<{}> {
    const response = await fetch(this.basePath + path, {
      method: "DELETE",
      headers: await this.getHeaders(),
    })

    const body = await response.json()

    if (response.status !== 200) {
      throw new Error(response.status + ":" + body.message);
    }

    return body
  }
}

export class ThankshellApi {
  restApi: RestApi;

  constructor(restApi: RestApi) {
    this.restApi = restApi
  }

  //-------------------------------------------------
  // Users

  async getUser(): Promise<{}> {
    const groupId = 'sla';
    return await this.restApi.get(`/groups/${groupId}/members/self`);
  }

  async updateUser(groupId: string, user: {}): Promise<void> {
    await this.restApi.patch(`/groups/${groupId}/members/self`, user);
  }

  //-------------------------------------------------
  // Groups

  async getGroup(groupId: string): Promise<any> {
    return await this.restApi.get(`/groups/${groupId}`);
  }

  async addUserToGroup(groupId: string, name: string): Promise<void> {
    await this.restApi.post(`/groups/${groupId}/members`, {memberId: name});
  }

  async deleteUserFromGroup(groupId: string, name: string) {
    await this.restApi.delete(`/groups/${groupId}/members/${name}`)
  }

  async entryToGroup(groupId: string, params: {m: string, hash: string}): Promise<void> {
    const memberId = params.m
    const hash = params.hash
    if (!memberId || !hash){
      throw new Error("Invalid memberId");
    }
    await this.restApi.post(`/groups/${groupId}/entry`, {memberId: memberId, hash: hash});
  }

  //-------------------------------------------------
  // Transactions

  async createTransaction(tokenName: string, data: any): Promise<void> {
    const groupId = 'sla';
    await this.restApi.post(`/groups/${groupId}/token/transactions`, {
      type: 'send',
      toMemberId: data.to,
      fromMemberId: data.from,
      ...data
    });
  }

  async loadTransactions(groupId: string, userId: string): Promise<[]> {
    const data = await this.restApi.get(`/groups/${groupId}/token/transactions?user_id=${userId}`);
    if (!('history' in data)) {
      throw new Error("key 'history' is not in data");
    }
    const history = data['history'];
    if (!('Items' in history)) {
      throw new Error("key 'history' is not in data");
    }

    return history['Items'];
  }

  async loadAllTransactions(groupId: string): Promise<[]> {
    const data = await this.restApi.get(`/groups/${groupId}/token/transactions`);
    if (!('history' in data)) {
      throw new Error("key 'history' is not in data");
    }
    const history = data['history'];
    if (!('Items' in history)) {
      throw new Error("key 'history' is not in data");
    }

    return history['Items'];
  }

  //-------------------------------------------------
  // Publish

  async publish(tokenName: string, to: string, amount: string): Promise<{}> {
    const groupId = 'sla';
    return await this.restApi.post(`/groups/${groupId}/token/transactions`, {
      type: 'publish',
      to: to,
      amount: amount,
    })
  }

  //-------------------------------------------------
  // Holdings

  async getHoldings(groupId: string): Promise<{[id:string]: number}> {
    return await this.restApi.get(`/groups/${groupId}/token/holders`);
  }

  async getHolding(groupId: string, memberId: string): Promise<number> {
    const holdings = await this.getHoldings(groupId);
    if (!(memberId in holdings)) {
      throw new Error(`${memberId}の保有情報を取得できませんでした`);
    }

    return holdings[memberId];
  }
}
