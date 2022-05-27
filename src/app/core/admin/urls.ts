import { environment } from '../../../environments/environment';

class Urls {
    serverUrl: string;

    constructor() {
        this.serverUrl = `${environment.apiUrl}/admin`;
    }

    get plants() {
        return this.serverUrl + '/plants';
    }
    get employees() {
        return this.serverUrl + '/employees';
    }
    get products() {
        return this.serverUrl + '/products';
    }
    get deliveries() {
        return this.serverUrl + '/deliveries';
    }
    get businesses() {
        return this.serverUrl + '/businesses';
    }
}
export const adminUrls = new Urls();