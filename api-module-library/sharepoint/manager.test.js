const mongoose = require('mongoose');
const nock = require('nock');
const querystring = require('querystring');
const Manager = require('./manager');
const { Entity } = require('./models/entity');
const { Credential } = require('./models/credential');
const config = require('./defaultConfig.json');

describe(`Should fully test the ${config.label} Manager`, () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterEach(async () => {
        await Manager.Credential.deleteMany();
        await Manager.Entity.deleteMany();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('#getName', () => {
        it('should return manager name', () => {
            expect(Manager.getName()).toEqual('microsoft-sharepoint');
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
            const baseUrl = 'https://graph.microsoft.com/v1.0';
            let manager, scope;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                scope = nock(baseUrl)
                    .get('/sites?search=*')
                    .reply(200, {
                        sites: 'sites'
                    });
            });

            it('should return true', async () => {
                const res = await manager.testAuth();
                expect(res).toBe(true);
                expect(scope.isDone()).toBe(true);
            });
        });

        describe('Perform test request to wrong URL', () => {
            const baseUrl = 'https://graph.microsoft.com/v1.0';
            let manager, scope;

            beforeEach(async () => {
                // Silent error log when doing Auth request
                jest.spyOn(console, 'error').mockImplementation(() => {});

                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                scope = nock(baseUrl)
                    .get('/sites?search=****')
                    .reply(200, {
                        sites: 'sites'
                    });
            });

            afterEach(() => {
                jest.clearAllMocks();
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
                client_id: 'sharepoint_client_id_test',
                response_type: 'code',
                redirect_uri: 'http://redirect_uri_test/microsoft-sharepoint',
                scope: 'sharepoint_scope_test',
                state: '',
                prompt: 'select_account'
            });

            const requirements = manager.getAuthorizationRequirements();
            expect(requirements).toBeDefined();
            expect(requirements.type).toEqual('oauth2');
            expect(requirements.url).toEqual(`${manager.api.authorizationUri}?${queryParams}`);
        });
    });

    describe('#processAuthorizationCallback', () => {
        describe('Perform authorization', () => {
            const baseUrl = 'https://graph.microsoft.com/v1.0';
            let authScope, sitesScope, userScope;
            let manager;

            beforeEach(async () => {
                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                const body = querystring.stringify({
                    grant_type: 'authorization_code',
                    client_id: 'sharepoint_client_id_test',
                    client_secret: 'sharepoint_client_secret_test',
                    redirect_uri: 'http://redirect_uri_test/microsoft-sharepoint',
                    scope: 'sharepoint_scope_test',
                    code: 'test'
                });

                authScope = nock('https://login.microsoftonline.com')
                    .post('/common/oauth2/v2.0/token', body)
                    .reply(200, {
                        access_token: 'access_token',
                        refresh_token: 'refresh_token',
                        expires_in: 'expires_in'
                    });

                sitesScope = nock(baseUrl)
                    .get('/sites?search=*')
                    .reply(200, {
                        sites: 'sites'
                    });

                userScope = nock(baseUrl)
                    .get('/me')
                    .reply(200, {
                        id: 'id',
                        displayName: 'displayName',
                        userPrincipalName: 'userPrincipalName'
                    });
            });

            it('should return an entity_id, credential_id, and type for successful auth', async () => {
                const params = { code: 'code ' };

                const res = await manager.processAuthorizationCallback(params);
                expect(res).toBeDefined();
                expect(res.entity_id).toBeDefined();
                expect(res.credential_id).toBeDefined();
                expect(res.type).toEqual(config.name);

                expect(authScope.isDone()).toBe(true);
                expect(sitesScope.isDone()).toBe(true);
                expect(userScope.isDone()).toBe(true);
            });
        });

        describe('Perform authorization to wrong auth URL', () => {
            const baseUrl = 'https://graph.microsoft.com/v1.0';
            let authScope, sitesScope, userScope;
            let manager;

            beforeEach(async () => {
                // Silent error log when doing Auth request
                jest.spyOn(console, 'error').mockImplementation(() => {});

                manager = await Manager.getInstance({
                    userId: new mongoose.Types.ObjectId(),
                });

                const body = querystring.stringify({
                    grant_type: 'authorization_code',
                    client_id: 'sharepoint_client_id_test',
                    client_secret: 'sharepoint_client_secret_test',
                    redirect_uri: 'http://redirect_uri_test/microsoft-sharepoint',
                    scope: 'sharepoint_scope_test',
                    code: 'test'
                });

                authScope = nock('https://login.microsoftonline.com')
                    .post('/common/oauth2/v2.0/token', body)
                    .reply(200, {
                        access_token: 'access_token',
                        refresh_token: 'refresh_token',
                        expires_in: 'expires_in'
                    });

                sitesScope = nock(baseUrl)
                    .get('/sites?search=WRONG')
                    .reply(200, {
                        sites: 'sites'
                    });

                userScope = nock(baseUrl)
                    .get('/me')
                    .reply(200, {
                        id: 'id',
                        displayName: 'displayName',
                        userPrincipalName: 'userPrincipalName'
                    });
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should throw auth error', async () => {
                const params = { code: 'code ' };

                try {
                    await manager.processAuthorizationCallback(params);
                } catch(e) {
                    expect(e).toEqual(new Error('Authentication failed'));
                }

                expect(authScope.isDone()).toBe(true);
                expect(sitesScope.isDone()).toBe(false);
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
});
