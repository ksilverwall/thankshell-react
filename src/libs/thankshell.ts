interface Auth {
  userhandler: {},
  getSession: () => {},
};

interface AuthSession {
  idToken: {jwtToken: string},
};

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
    return await this.restApi.get('/user/')
  }

  async updateUser(userId: string, user: {}): Promise<void> {
    await this.restApi.patch(`/user/${userId}`, user)
  }

  //-------------------------------------------------
  // Groups

  async getGroup(groupId: string): Promise<{}> {
    return await this.restApi.get(`/groups/${groupId}`)
  }

  async addUserToGroup(groupId: string, name: string): Promise<void> {
    const result = await this.restApi.put(`/groups/${groupId}/members/${name}`, {})
    if (result.status != 200) {
      throw new Error(('message' in result.body) ? result.body['message'] : 'No message');
    }
  }

  async deleteUserFromGroup(groupId: string, name: string) {
    await this.restApi.delete(`/groups/${groupId}/members/${name}`)
  }

  async entryToGroup(groupId: string, params: {m: string, hash: string}): Promise<void> {
    const memberId = params.m
    const hash = params.hash
    if (!memberId || !hash){
      throw new Error("Invalid memberId")
    }
    await this.restApi.put2(`/groups/${groupId}/members/${memberId}/user`, {hash: hash})
  }

  //-------------------------------------------------
  // Transactions

  async createTransaction(groupId: string, data: {}): Promise<void> {
    await this.restApi.post(`/token/${groupId}/transactions`, data)
  }

  async loadTransactions(groupId: string, userId: string): Promise<[]> {
    const data = await this.restApi.get(`/token/${groupId}/transactions?user_id=${userId}`);
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
    const data = await this.restApi.get(`/token/${groupId}/transactions`);
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

  async publish(groupId: string, to: string, amount: string): Promise<{}> {
    return await this.restApi.post(
      `/token/${groupId}/published`,
      {
        to: to,
        amount: amount,
      }
    );
  }

  //-------------------------------------------------
  // Holdings

  async getHoldings(groupId: string): Promise<{[id:string]: number}> {
    return await this.restApi.get(`/token/${groupId}/holders`);
  }

  async getHolding(groupId: string, memberId: string): Promise<number> {
    const holdings = await this.getHoldings(groupId);
    if (!(memberId in holdings)) {
      throw new Error(`${memberId}の保有情報を取得できませんでした`);
    }

    return holdings[memberId];
  }
}
