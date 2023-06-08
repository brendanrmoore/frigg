const mongoose = require('mongoose');
const nock = require('nock');
const querystring = require('querystring');
const logs = require('@friggframework/logs');
const Manager = require('./manager');
const { Api } = require('./api');
const { Entity } = require('./models/entity');
const { Credential } = require('./models/credential');
const config = require('./defaultConfig.json');

jest.mock('@friggframework/logs');

describe(`Should fully test the ${config.label} Manager`, () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterEach(async () => {
        await Manager.Credential.deleteMany();
        await Manager.Entity.deleteMany();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('#getName', () => {
        it('should return manager name', () => {
            expect(Manager.getName()).toEqual('frontify');
        });
    });

    describe('#getInstance', () => {
        describe('Create new instance', () => {
            let manager;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });
            });

            it('can create an instance of Module Manger', async () => {
                expect(manager).toBeDefined();
                expect(manager.api).toBeDefined();
                expect(manager.api.client_id).toEqual('frontify_client_id_test');
                expect(manager.api.client_secret).toEqual('frontify_client_secret_test');
                expect(manager.api.redirect_uri).toEqual('http://redirect_uri_test/frontify');
                expect(manager.api.scope).toEqual('frontify_scope_test');
                expect(manager.api.delegate).toEqual(manager);
            });
        });

        describe('Create new instance with entity Id', () => {
            let manager;

            beforeEach(async () => {
                const userId = new mongoose.Types.ObjectId();

                const creden = await Credential.create({
                    user: userId,
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                    auth_is_valid: true,
                });

                const enti = await Entity.create({
                    credential: creden.id,
                    user: userId,
                    name: 'name',
                    externalId: 'externalId',
                });

                manager = await Manager.getInstance({
                    entityId: enti.id,
                    userId
                });
            });

            it('can create an instance of Module Manger with credentials', async () => {
                expect(manager).toBeDefined();
                expect(manager.api).toBeDefined();
                expect(manager.api.access_token).toEqual('accessToken');
                expect(manager.api.refresh_token).toEqual('refreshToken');
            });
        });
    });

    describe('#testAuth', () => {
        describe('Perform test request', () => {
            const baseUrl = 'https://mine-domain/graphql';
            let manager, scope;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                manager.api.setDomain('mine-domain');

                scope = nock(baseUrl)
                    .post('', {
                        query: 'query CurrentUser { currentUser { id email name }}',
                    })
                    .reply(200, {
                        data: {
                            currentUser: 'currentUser'
                        }
                    });
            });

            it('should return true', async () => {
                const res = await manager.testAuth();
                expect(res).toBe(true);
                expect(scope.isDone()).toBe(true);
            });
        });

        describe('Perform test request to wrong URL', () => {
            const baseUrl = 'https://mine-domain/graphql';
            let manager, scope;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                manager.api.setDomain('mine-domain');

                scope = nock(baseUrl)
                    .post('/any')
                    .reply(200, {
                        sites: 'sites'
                    });
            });

            it('should return false', async () => {
                const res = await manager.testAuth();
                expect(res).toBe(false);
                expect(scope.isDone()).toBe(false);
            });
        });
    });

    describe('#getAuthorizationRequirements', () => {
        let manager;

        beforeEach(async () => {
            manager = await Manager.getInstance({
                userId: new mongoose.Types.ObjectId(),
            });
        });

        it('should return auth requirements', () => {
            const queryParams = querystring.stringify({
                client_id: 'frontify_client_id_test',
                response_type: 'code',
                redirect_uri: 'http://redirect_uri_test/frontify',
                scope: 'frontify_scope_test',
                state: ''
            });

            const requirements = manager.getAuthorizationRequirements();
            expect(requirements).toBeDefined();
            expect(requirements.type).toEqual('oauth2');
            expect(requirements.url).toEqual(`https://{{domain}}/api/oauth/authorize?${queryParams}`);
            expect(requirements.data).toEqual({
                jsonSchema: {
                    title: 'Auth Form',
                    type: 'object',
                    required: ['domain'],
                    properties: {
                        domain: {
                            type: 'string',
                            title: 'Your Frontify Domain',
                        }
                    }
                },
                uiSchema: {
                    domain: {
                        'ui:help':
                        'An Frontify domain, e.g: lefthook.frontify.com',
                        'ui:placeholder': 'Your Frontify domain...',
                    },
                }
            });
        });
    });

    describe('#processAuthorizationCallback', () => {
        describe('Perform authorization', () => {
            const baseUrl = 'https://domain/graphql';
            let authScope, userScope;
            let manager;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                jest.spyOn(manager, 'testAuth').mockImplementation(() => true);

                const body = querystring.stringify({
                    grant_type: 'authorization_code',
                    client_id: 'frontify_client_id_test',
                    client_secret: 'frontify_client_secret_test',
                    redirect_uri: 'http://redirect_uri_test/frontify',
                    scope: 'frontify_scope_test',
                    code: 'code'
                });

                authScope = nock('https://domain')
                    .post('/api/oauth/accesstoken', body)
                    .reply(200, {
                        access_token: 'access_token',
                        refresh_token: 'refresh_token',
                        expires_in: 'expires_in'
                    });

                userScope = nock(baseUrl)
                    .post('', {
                        query: 'query CurrentUser { currentUser { id email name }}',
                    })
                    .reply(200, {
                        data: {
                            currentUser: {
                                id: 'id',
                                name: 'name'
                            }
                        }
                    });
            });

            it('should return an entity_id, credential_id, and type for successful auth', async () => {
                const params = {
                    data: {
                        code: 'code',
                        domain: 'domain'
                    }
                };

                const res = await manager.processAuthorizationCallback(params);
                expect(res).toBeDefined();
                expect(res.entity_id).toBeDefined();
                expect(res.credential_id).toBeDefined();
                expect(res.type).toEqual(config.name);

                expect(manager.testAuth).toBeCalledTimes(1);

                expect(authScope.isDone()).toBe(true);
                expect(userScope.isDone()).toBe(true);
            });
        });

        describe('Perform authorization without code param', () => {
            const baseUrl = 'https://domain/graphql';
            let authScope, userScope;
            let manager;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                jest.spyOn(manager, 'testAuth').mockImplementation(() => true);

                const body = querystring.stringify({
                    grant_type: 'authorization_code',
                    client_id: 'frontify_client_id_test',
                    client_secret: 'frontify_client_secret_test',
                    redirect_uri: 'http://redirect_uri_test/frontify',
                    scope: 'frontify_scope_test',
                    code: 'test'
                });

                authScope = nock('https://domain')
                    .post('/api/oauth/accesstoken', body)
                    .reply(200, {
                        access_token: 'access_token',
                        refresh_token: 'refresh_token',
                        expires_in: 'expires_in'
                    });

                userScope = nock(baseUrl)
                    .post('', {
                        query: 'query CurrentUser { currentUser { id email name }}',
                    })
                    .reply(200, {
                        data: {
                            currentUser: {
                                id: 'id',
                                name: 'name'
                            }
                        }
                    });
            });

            it('should return an entity_id, credential_id, and type for successful auth', async () => {
                const params = {
                    data: {
                        domain: 'domain'
                    }
                };

                const res = await manager.processAuthorizationCallback(params);
                expect(res).toBeDefined();
                expect(res.entity_id).toBeDefined();
                expect(res.credential_id).toBeDefined();
                expect(res.type).toEqual(config.name);

                expect(manager.testAuth).toBeCalledTimes(1);

                expect(authScope.isDone()).toBe(true);
                expect(userScope.isDone()).toBe(true);
            });
        });

        describe('Perform authorization to wrong auth URL', () => {
            const baseUrl = 'https://domain/graphql';
            let authScope, userScope;
            let manager;

            beforeEach(async () => {
                // Silent error log when doing Auth request
                jest.spyOn(console, 'error').mockImplementation(() => {});

                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                jest.spyOn(manager, 'testAuth').mockImplementation(() => false);

                const body = querystring.stringify({
                    grant_type: 'authorization_code',
                    client_id: 'frontify_client_id_test',
                    client_secret: 'frontify_client_secret_test',
                    redirect_uri: 'http://redirect_uri_test/frontify',
                    scope: 'frontify_scope_test',
                    code: 'code'
                });

                authScope = nock('https://domain')
                    .post('/api/oauth/accesstoken', body)
                    .reply(200, {
                        access_token: 'access_token',
                        refresh_token: 'refresh_token',
                        expires_in: 'expires_in'
                    });

                userScope = nock(baseUrl)
                    .post('', {
                        query: 'query CurrentUser { currentUser { id email name }}',
                    })
                    .reply(200, {
                        data: {
                            currentUser: {
                                id: 'id',
                                name: 'name'
                            }
                        }
                    });
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should throw auth error', async () => {
                const params = {
                    data: {
                        code: 'code',
                        domain: 'domain'
                    }
                };

                try {
                    await manager.processAuthorizationCallback(params);
                } catch(e) {
                    expect(e).toEqual(new Error('Authentication failed'));
                }

                expect(manager.testAuth).toBeCalledTimes(1);

                expect(authScope.isDone()).toBe(true);
                expect(userScope.isDone()).toBe(false);
            });
        });
    });

    describe('#findOrCreateEntity', () => {
        describe('Search non existent entity', () => {
            let manager, userId, creden;

            beforeEach(async () => {
                userId = new mongoose.Types.ObjectId();

                creden = await Credential.create({
                    user: userId,
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                    auth_is_valid: true,
                });

                manager = await Manager.getInstance({
                    userId
                });

                manager.credential = creden;
            });

            it('should create new entity', async () => {
                await manager.findOrCreateEntity({
                    externalId: 'externalId',
                    name: 'name'
                });

                expect(manager.entity).toBeDefined();
                expect(manager.entity.name).toEqual('name');
                expect(manager.entity.externalId).toEqual('externalId');
                expect(manager.entity.credential.toString()).toEqual(creden.id);
                expect(manager.entity.user).toEqual(userId);
            });
        });

        describe('Search entity with same user and external Id', () => {
            let manager, userId, creden;

            beforeEach(async () => {
                userId = new mongoose.Types.ObjectId();

                creden = await Credential.create({
                    user: userId,
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                    auth_is_valid: true,
                });

                await Entity.create({
                    credential: creden.id,
                    user: userId,
                    name: 'other_name',
                    externalId: 'other_externalId',
                });

                manager = await Manager.getInstance({
                    userId
                });

                manager.credential = creden;
            });

            it('should assign it to entity property', async () => {
                await manager.findOrCreateEntity({
                    externalId: 'other_externalId',
                    name: 'other_name'
                });

                expect(manager.entity).toBeDefined();
                expect(manager.entity.name).toEqual('other_name');
                expect(manager.entity.externalId).toEqual('other_externalId');
                expect(manager.entity.credential.toString()).toEqual(creden.id);
                expect(manager.entity.user).toEqual(userId);
            });
        });

        describe('Search with multiple entities with same user and external Id', () => {
            let manager, userId, creden;

            beforeEach(async () => {
                userId = new mongoose.Types.ObjectId();

                creden = await Credential.create({
                    user: userId,
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                    auth_is_valid: true,
                });

                await Entity.create({
                    credential: creden.id,
                    user: userId,
                    name: 'other_name',
                    externalId: 'other_externalId',
                });

                await Entity.create({
                    credential: creden.id,
                    user: userId,
                    name: 'other_name',
                    externalId: 'other_externalId',
                });

                manager = await Manager.getInstance({
                    userId
                });

                manager.credential = creden;
            });

            it('should assign it to entity property', async () => {
                try {
                    await manager.findOrCreateEntity({
                        externalId: 'other_externalId',
                        name: 'other_name'
                    });
                } catch(e) {
                    expect(e).toEqual(new Error('Multiple entities found with the same external ID: other_externalId'));
                    expect(manager.entity).not.toBeDefined();
                }
            });
        });
    });

    describe('#receiveNotification', () => {
        describe('Notify DLGT_TOKEN_UPDATE to manager with credential', () => {
            let manager, api;

            beforeEach(async () => {
                api = new Api({
                    access_token: 'access_token',
                    refresh_token: 'refresh_token'
                });

                const userId = new mongoose.Types.ObjectId();

                const creden = await Credential.create({
                    user: userId,
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                    auth_is_valid: true,
                });

                manager = await Manager.getInstance({
                    userId,
                });

                manager.api = api;
                manager.credential = creden;
            });

            it('should update token property in credential', async () => {
                await manager.receiveNotification(api, api.DLGT_TOKEN_UPDATE);

                expect(manager.credential.accessToken).toEqual('access_token');
                expect(manager.credential.refreshToken).toEqual('refresh_token');
            });
        });

        describe('Notify DLGT_TOKEN_UPDATE to manager without credential', () => {
            let manager, api;

            beforeEach(async () => {
                api = new Api({
                    access_token: 'other_access_token',
                    refresh_token: 'other_refresh_token'
                });

                const userId = new mongoose.Types.ObjectId();

                await Credential.create({
                    user: userId,
                    accessToken: 'other_accessToken',
                    refreshToken: 'other_refreshToken',
                    auth_is_valid: true,
                });

                manager = await Manager.getInstance({
                    userId,
                });

                manager.api = api;
            });

            it('should assign credential and update its token property', async () => {
                await manager.receiveNotification(api, api.DLGT_TOKEN_UPDATE);

                expect(manager.credential.accessToken).toEqual('other_access_token');
                expect(manager.credential.refreshToken).toEqual('other_refresh_token');
            });
        });

        describe('Notify DLGT_TOKEN_UPDATE to manager with no existent credential', () => {
            let manager, api;

            beforeEach(async () => {
                api = new Api({
                    access_token: 'new_access_token',
                    refresh_token: 'new_refresh_token'
                });

                const userId = new mongoose.Types.ObjectId();

                manager = await Manager.getInstance({
                    userId,
                });

                manager.api = api;
            });

            it('should assign new credential and update its token property', async () => {
                await manager.receiveNotification(api, api.DLGT_TOKEN_UPDATE);

                expect(manager.credential.accessToken).toEqual('new_access_token');
                expect(manager.credential.refreshToken).toEqual('new_refresh_token');
            });
        });

        describe('Notify DLGT_TOKEN_UPDATE to manager with multiple credentials with same user Id', () => {
            let manager, api, userId;

            beforeEach(async () => {
                api = new Api({
                    access_token: 'other_access_token',
                    refresh_token: 'other_refresh_token'
                });

                userId = new mongoose.Types.ObjectId();

                await Credential.create({
                    user: userId,
                    accessToken: 'one_accessToken',
                    refreshToken: 'one_refreshToken',
                    auth_is_valid: true,
                });

                await Credential.create({
                    user: userId,
                    accessToken: 'two_accessToken',
                    refreshToken: 'two_refreshToken',
                    auth_is_valid: true,
                });

                manager = await Manager.getInstance({
                    userId,
                });

                manager.api = api;
            });

            it('should not assign any credential', async () => {
                await manager.receiveNotification(api, api.DLGT_TOKEN_UPDATE);

                expect(manager.credential).not.toBeDefined();
                expect(logs.debug).toBeCalledTimes(1);
                expect(logs.debug).toHaveBeenCalledWith('Multiple credentials found with the same user ID: ' + userId);
            });
        });

        describe('Notify DLGT_TOKEN_DEAUTHORIZED to manager', () => {
            let manager, api, userId;

            beforeEach(async () => {
                api = new Api({
                    access_token: 'other_access_token',
                    refresh_token: 'other_refresh_token'
                });

                userId = new mongoose.Types.ObjectId();

                manager = await Manager.getInstance({
                    userId,
                });

                manager.api = api;

                jest.spyOn(manager, 'deauthorize').mockImplementation(() => {});
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should call deauthorize method', async () => {
                await manager.receiveNotification(api, api.DLGT_TOKEN_DEAUTHORIZED);

                expect(manager.credential).not.toBeDefined();
                expect(manager.deauthorize).toBeCalledTimes(1);
            });
        });

        describe('Notify DLGT_INVALID_AUTH to manager', () => {
            let manager, api, userId;

            beforeEach(async () => {
                api = new Api({
                    access_token: 'other_access_token',
                    refresh_token: 'other_refresh_token'
                });

                userId = new mongoose.Types.ObjectId();

                manager = await Manager.getInstance({
                    userId,
                });

                manager.api = api;

                jest.spyOn(manager, 'markCredentialsInvalid').mockImplementation(() => {});
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should call deauthorize method', async () => {
                await manager.receiveNotification(api, api.DLGT_INVALID_AUTH);

                expect(manager.credential).not.toBeDefined();
                expect(manager.markCredentialsInvalid).toBeCalledTimes(1);
            });
        });
    });
});
