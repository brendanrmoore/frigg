const { get, ApiKeyRequester } = require('@friggframework/core-rollup');

class coreApi extends ApiKeyRequester {
    constructor(params) {
        super(params);
        this.apiKey = get(params, 'apiKey', null);
        this.apiKeySecret = get(params, 'secret', null);
        this.baseUrl = 'https://api.yotpo.com/core';
        this.store_id = get(params, 'store_id', null);
        this.API_KEY_VALUE = get(params, 'API_KEY_VALUE', null);

        this.URLs = {
            token: () =>
                `${this.baseUrl}/v3/stores/${this.store_id}/access_tokens`,
            createOrder: () =>
                `${this.baseUrl}/v3/stores/${this.store_id}/orders`,
            createOrderFulfillment: (yotpo_order_id) =>
                `${this.baseUrl}/v3/stores/${this.store_id}/orders/${yotpo_order_id}/fulfillments`,
            listOrders: () =>
                `${this.baseUrl}/v3/stores/${this.store_id}/orders`,
            getOrder: (yotpo_order_id) =>
                `${this.baseUrl}/v3/stores/${this.store_id}/orders/${yotpo_order_id}`,
            listProducts: () =>
                `${this.baseUrl}/v3/stores/${this.store_id}/products`,
        };
    }

    async getToken() {
        const options = {
            url: this.URLs.token(),
            // url: 'https://webhook.site/7ad1431a-9180-49e5-9ed5-b6008befd420',
            body: {
                secret: this.apiKeySecret,
            },
            headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
            },
        };

        const res = await this._post(options);
        const { access_token } = await res;
        this.setApiKey(access_token);
    }
    async addAuthHeaders(headers) {
        if (this.API_KEY_VALUE) headers['X-Yotpo-Token'] = this.API_KEY_VALUE;
        return headers;
    }

    async createOrder(body) {
        const options = {
            url: this.URLs.createOrder(),
            headers: {
                'content-type': 'application/json',
            },
            body,
        };

        const res = await this._post(options);
        return res;
    }

    async listOrders() {
        const options = {
            url: this.URLs.listOrders(),
        };

        const res = await this._get(options);
        return res;
    }

    async listProducts(query) {
        const options = {
            url: this.URLs.listProducts(),
            query
        };

        const res = await this._get(options);
        return res;
    }
}

module.exports = { coreApi };
