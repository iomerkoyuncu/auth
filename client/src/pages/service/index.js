import httpHelper from '../../utils/httpHelper';
import { appConfig } from '../../constants/appConfig';

const service = {
    async login(data) {
        return await httpHelper.makePostRequest(appConfig.baseUrl, '/login', data);
    },
    async register(data) {
        return await httpHelper.makePostRequest(appConfig.baseUrl, '/register', data);
    },
    async getAllUsers() {
        return await httpHelper.makeGetRequest(appConfig.baseUrl, '/all');
    },
    async getUserById(id) {
        return await httpHelper.makeGetRequest(appConfig.baseUrl, `/user/${id}`);
    },
    async updateUser(id, data) {
        return await httpHelper.makePutRequest(appConfig.baseUrl, `/${id}`, data);
    },
    async deleteUser(id) {
        return await httpHelper.makeDeleteRequest(appConfig.baseUrl, `/${id}`);
    },
    async addUser(data) {
        return await httpHelper.makePostRequest(appConfig.baseUrl, '/', data);
    },
    async getUserRole(id) {
        return await httpHelper.makeGetRequest(appConfig.baseUrl, `/role/${id}`);
    },
    async giveRootAccess(id) {
        return await httpHelper.makePutRequest(appConfig.baseUrl, `/give-root-access/${id}`);
    },
    async giveObserverAccess(id) {
        return await httpHelper.makePutRequest(appConfig.baseUrl, `/give-observer-access/${id}`);
    },
}

export default service;