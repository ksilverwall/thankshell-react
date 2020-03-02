export class ThankshellApi {
    constructor(auth, host, version) {
        this.auth = auth
        this.session = null
        this.basePath = `https://${host}/${version}`
    }

    getSession() {
        return new Promise((resolve, reject) => {
            this.auth.userhandler = {
                onSuccess: resolve,
                onFailure: reject,
            };

            this.auth.getSession();
        });
    }

    async reloadSession() {
        this.session = await this.getSession()
        if (!this.session) {
            throw Error('セッションの読み込みに失敗しました。再読込してください')
        }
    }

    getHeaders(session) {
        return {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: session.idToken.jwtToken
        }
    }

    async get(path) {
        if (!this.session) { await this.reloadSession() }
        const response = await fetch(this.basePath + path, {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(response.status + ":" + data.message);
        }

        return data
    }

    async put(path, data) {
        if (!this.session) { await this.reloadSession() }
        const response = await fetch(this.basePath + path, {
            method: "PUT",
            headers: this.getHeaders(this.session),
            body: JSON.stringify(data),
        })

        return {
            status: response.status,
            body: await response.json(),
        }
    }

    async post(path, data) {
        if (!this.session) { await this.reloadSession() }
        const response = await fetch(this.basePath + path, {
            method: "POST",
            headers: this.getHeaders(this.session),
            body: JSON.stringify(data),
        })

        const body = await response.json()
        if (response.status !== 200) {
            throw new Error(body.message)
        }

        return body
    }

    async delete(path) {
        if (!this.session) { await this.reloadSession() }
        const response = await fetch(this.basePath + path, {
            method: "DELETE",
            headers: this.getHeaders(this.session),
        })

        const body = await response.json()
        if (response.status !== 200) {
            throw new Error(body.message)
        }

        return body
    }

    //-------------------------------------------------
    // Users

    async getUser() {
        return await this.get('/user/')
    }

    async createUser(userId) {
        // FIXME: should be post
        const data = await this.put('/user/', {id: userId})
        const responseBody = data.body;
        switch (data.status) {
          case 200:
            break;
          case 403:
            switch (responseBody.code) {
              case 'AUTHINFO_ALREADY_REGISTERD':
                break
              default:
                throw new Error(responseBody.message)
            }
            break
          default:
            throw new Error(responseBody.message)
        }

        return data
    }

    //-------------------------------------------------
    // Groups

    async getGroup(groupName) {
        return await this.get('/groups/' + groupName)
    }

    async addUserToGroup(groupId, name) {
        const result = await this.put(`/groups/${groupId}/members/${name}`)
        if (result.status != 200) {
            throw new Error(result.body.message)
        }
    }

    async deleteUserFromGroup(groupId, name) {
        await this.delete(`/groups/${groupId}/members/${name}`)
    }

    //-------------------------------------------------
    // Transactions

    async createTransaction(tokenName, data) {
        await this.post('/token/' + tokenName + '/transactions', data)
    }

    async loadTransactions(tokenName, userId) {
        const data = await this.get('/token/' + tokenName + '/transactions?user_id=' + userId)

        return data.history.Items
    }

    async loadAllTransactions(tokenName) {
        const data = await this.get('/token/' + tokenName + '/transactions')

        return data.history.Items;
    }

    //-------------------------------------------------
    // Publish

    async publish(tokenName, to, amount) {
        return await this.post(
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
        return await this.get('/token/' + tokenName + '/holders')
    }

    async getHolding(tokenName, userId) {
        return (await this.getHoldings(tokenName))[userId]
    }
}

export class GroupInfo {
    constructor(data) {
        this.groupId = data['group_id']
        this.data = data;
    }

    getAdmins() {
        if (!this.data.admins) {
            return [];
        }

        return this.data.admins;
    }

    getMembers() {
        if (!this.data.members) {
            return [];
        }

        return this.data.members;
    }

    getRequests() {
        if (!this.data.requests) {
            return [];
        }

        return this.data.requests;
    }
}

export const GetThankshellApi = (auth) => new ThankshellApi(auth, process.env.REACT_APP_THANKSHELL_API_HOST, process.env.REACT_APP_THANKSHELL_API_VERSION)
