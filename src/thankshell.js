export class ThankshellApi {
    constructor(auth, version) {
        this.auth = auth
        this.session = null
        this.basePath = 'https://api.thankshell.com/' + version;
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

    async getUser() {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/user/', {
            method: "GET",
            headers: this.getHeaders(this.session),
        });
        return await response.json();
    }

    async createUser(userId) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/user/', {
            method: "PUT",
            headers: this.getHeaders(this.session),
            body: JSON.stringify({
                id: userId,
            }),
        });

        return {
            status: response.status,
            body: await response.json(),
        };
    }

    //-------------------------------------------------
    // Groups

    async getGroup(groupName) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/groups/' + groupName, {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        return new GroupInfo(await response.json());
    }

    async sendGroupJoinRequest(groupName, userId) {
        if (!this.session) { await this.reloadSession() }
        await fetch(this.basePath + '/groups/' + groupName + '/requests/' + userId, {
            method: "PUT",
            headers: this.getHeaders(this.session),
        });
    }

    async cancelGroupJoinRequest(groupName, userId) {
        if (!this.session) { await this.reloadSession() }
        await fetch(this.basePath + '/groups/' + groupName + '/requests/' + userId, {
            method: "DELETE",
            headers: this.getHeaders(this.session),
        });
    }

    async acceptGroupJoinRequest(groupName, userId) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/groups/' + groupName + '/members/' + userId, {
            method: "PUT",
            headers: this.getHeaders(this.session),
        });
        let data = await response.json();
        console.log(data);
    }

    //-------------------------------------------------
    // Transactions

    async createTransaction(data) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/transactions', {
            method: "POST",
            headers: this.getHeaders(this.session),
            body: JSON.stringify(data),
        });

        if (response.status !== 200) {
            let data = await response.json();
            throw new Error(data.message);
        }
    }

    async loadTransactions(userId) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/transactions?user_id=' + userId, {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        let data = await response.json();

        if (response.status !== 200) {
            throw new Error(response.status + ":" + data.message);
        }

        return data.history.Items;
    }

    async loadAllTransactions() {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/transactions', {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        let data = await response.json();

        if (response.status !== 200) {
            throw new Error(response.status + ":" + data.message);
        }

        return data.history.Items;
    }

    //-------------------------------------------------
    // Publish

    async getPublished() {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/published', {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        return await response.json();
    }

    async publish(to, amount) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/published', {
            method: "POST",
            headers: this.getHeaders(this.session),
            body: JSON.stringify({
                to: to,
                amount: amount,
            }),
        });

        let data = await response.json();

        if (response.status !== 200) {
            throw new Error(response.status + ":" + data.message);
        }
    }

    //-------------------------------------------------
    // Holdings

    async getHoldings() {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/holders', {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        let json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.message)
        }

        return json;
    };

    async getHolding(userId) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/token/selan/holders', {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        let json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.message)
        }

        return json[userId];
    };

    //-------------------------------------------------
    // Holdings

    async getLinks() {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/user/link', {
            method: "GET",
            headers: this.getHeaders(this.session),
        });

        if (response.status !== 200) {
            let result = await response.json();
            throw new Error(result.message);
        }

        return await response.json();
    }

    async linkFacebook(fbLoginInfo) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/user/link/Facebook', {
            method: "PUT",
            headers: this.getHeaders(this.session),
            body: JSON.stringify({
                'id': fbLoginInfo.authResponse.userID,
                'token': fbLoginInfo.authResponse.accessToken,
            }),
        });

        if (response.status !== 200) {
            let result = await response.json();
            throw new Error(result.message);
        }

        return await response.json();
    }

    async unlinkFacebook(fbLoginInfo) {
        if (!this.session) { await this.reloadSession() }
        let response = await fetch(this.basePath + '/user/link/Facebook', {
            method: "DELETE",
            headers: this.getHeaders(this.session),
            body: JSON.stringify({
                'id': fbLoginInfo.authResponse.userID,
                'token': fbLoginInfo.authResponse.accessToken,
            }),
        });

        if (response.status !== 200) {
            let result = await response.json();
            throw new Error(result.message);
        }
    }
}

class GroupInfo {
    constructor(data) {
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

export const GetThankshellApi = (auth) => new ThankshellApi(auth, process.env.REACT_APP_THANKSHELL_API_VERSION)
