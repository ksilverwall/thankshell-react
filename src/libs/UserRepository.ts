import { RestApi } from 'libs/thankshell';

export default class UserRepository {
  groupId: string;
  restApi: RestApi;

  constructor(groupId: string, restApi: RestApi) {
    this.groupId = groupId;
    this.restApi = restApi;
  }

  async getUser(): Promise<{}> {
    return await this.restApi.get(`/groups/${this.groupId}/members/self`);
  }
}
;
