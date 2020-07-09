export class Session {
  constructor(auth) {
    this.auth = auth
    this.session = null
  }

  getSession() {
    return new Promise((resolve, reject) => {
      this.auth.userhandler = {
        onSuccess: resolve,
        onFailure: reject,
      };

      this.auth.getSession();
    })
  }

  async reload() {
    this.session = await this.getSession()
    if (!this.session) {
      throw Error('セッションの読み込みに失敗しました。再読込してください')
    }
  }

  async getJwtToken() {
    if (!this.session) { await this.reload() }
    return this.session.idToken.jwtToken
  }
}

export class RestApi {
  constructor(session, basePath) {
    this.session = session
    this.basePath = basePath
  }

  async getHeaders() {
    return {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: await this.session.getJwtToken()
    }
  }

  async get(path) {
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

  async post(path, data) {
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

  async put(path, data) {
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

  async put2(path, data) {
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
  
  async patch(path, data) {
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

  async delete(path) {
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
    constructor(restApi) {
        this.restApi = restApi
    }

    //-------------------------------------------------
    // Users

    async getUser() {
        return await this.restApi.get('/user/')
    }

    async updateUser(userId, user) {
        await this.restApi.patch(`/user/${userId}`, user)
    }

    //-------------------------------------------------
    // Groups

    async getGroup(groupName) {
        return await this.restApi.get('/groups/' + groupName)
    }

    async addUserToGroup(groupId, name) {
        const result = await this.restApi.put(`/groups/${groupId}/members/${name}`)
        if (result.status != 200) {
            throw new Error(result.body.message)
        }
    }

    async deleteUserFromGroup(groupId, name) {
        await this.restApi.delete(`/groups/${groupId}/members/${name}`)
    }

    async entryToGroup(groupId, params) {
        const {m: memberId, hash} = params
        if (!memberId || !hash){
            throw new Error("Invalid memberId")
        }
        await this.restApi.put2(`/groups/${groupId}/members/${memberId}/user`, {hash: hash})
    }

    //-------------------------------------------------
    // Transactions

    async createTransaction(tokenName, data) {
        await this.restApi.post('/token/' + tokenName + '/transactions', data)
    }

    async loadTransactions(tokenName, userId) {
        const data = await this.restApi.get('/token/' + tokenName + '/transactions?user_id=' + userId)

        return data.history.Items
    }

    async loadAllTransactions(tokenName) {
        const data = await this.restApi.get('/token/' + tokenName + '/transactions')

        return data.history.Items;
    }

    //-------------------------------------------------
    // Publish

    async publish(tokenName, to, amount) {
        return await this.restApi.post(
            '/token/' + tokenName + '/published',
            {
                to: to,
                amount: amount,
            }
        )
    }

    //-------------------------------------------------
    // Holdings

    async getHoldings(tokenName) {
        return await this.restApi.get('/token/' + tokenName + '/holders')
    }

    async getHolding(groupId: string, memberId: string): Promise<number> {
        const holdings = await this.getHoldings(groupId);
        if (!(memberId in holdings)) {
            throw new Error(`${memberId}の保有情報を取得できませんでした`);
        }

        return holdings[memberId];
    }
}
