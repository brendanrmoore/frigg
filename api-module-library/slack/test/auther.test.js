const { connectToDatabase, disconnectFromDatabase, createObjectId, Auther } = require('@friggframework/core');
const {
    Authenticator,
    testDefinitionRequiredAuthMethods,
    testAutherDefinition
} = require("@friggframework/devtools");
const { Definition} = require('../definition');


const mocks = {
    authTest: {
        "ok": true,
        "url": "https://lefthookhq.slack.com/",
        "team": "Left Hook",
        "user": "test_app",
        "team_id": "mock_team_id",
        "user_id": "mock_user_id",
        "bot_id": "mock_bot_id",
        "expires_in": 25341,
        "is_enterprise_install": false,
        "warning": "missing_charset",
        "response_metadata": {
            "warnings": [
                "missing_charset"
            ]
        }
    },
    authorizeResponse: {
        "base": "/redirect/slack",
        "data": {
            "code": "redacted",
            "state": "null"
        }
    },
    tokenResponse: {
        "ok": true,
        "app_id": "mock_app_id",
        "authed_user": {
            "id": "mock_user_id"
        },
        "scope": "channels:join,channels:manage,chat:write,chat:write.customize,chat:write.public,commands,channels:read,files:write,links:write,im:write,team:read,triggers:write,users:read.email,users:read,groups:write,app_mentions:read,channels:history,im:history,im:read",
        "token_type": "bot",
        "access_token": "readacted",
        "bot_user_id": "mock_bot_id",
        "refresh_token": "readacted",
        "expires_in": 25341,
        "team": {
            "id": "mock_team_id",
            "name": "Mock Team"
        },
        "enterprise": null,
        "is_enterprise_install": false
    },
}
testAutherDefinition(Definition, mocks)


describe(`${Definition.moduleName} Module Live Tests`, () => {
    let module, authUrl;
    beforeAll(async () => {
        await connectToDatabase();
        module = await Auther.getInstance({
            definition: Definition,
            userId: createObjectId(),
        });
    });

    afterAll(async () => {
        await module.CredentialModel.deleteMany();
        await module.EntityModel.deleteMany();
        await disconnectFromDatabase();
    });

    describe('getAuthorizationRequirements() test', () => {
        it('should return auth requirements', async () => {
            const requirements = await module.getAuthorizationRequirements();
            expect(requirements).toBeDefined();
            expect(requirements.type).toEqual('oauth2');
            expect(requirements.url).toBeDefined();
            authUrl = requirements.url;
        });
    });

    describe('Authorization requests', () => {
        let firstRes;
        it('processAuthorizationCallback()', async () => {
            const response = await Authenticator.oauth2(authUrl);
            firstRes = await module.processAuthorizationCallback(response);
            expect(firstRes).toBeDefined();
            expect(firstRes.entity_id).toBeDefined();
            expect(firstRes.credential_id).toBeDefined();
        });
        it.skip('retrieves existing entity on subsequent calls', async () =>{
            const response = await Authenticator.oauth2(authUrl);
            const res = await module.processAuthorizationCallback(response);
            expect(res).toEqual(firstRes);
        });
    });
    describe('Test credential retrieval and module instantiation', () => {
        it('retrieve by entity id', async () => {
            const newModule = await Auther.getInstance({
                userId: module.userId,
                entityId: module.entity.id,
                definition: Definition,
            });
            expect(newModule).toBeDefined();
            expect(newModule.entity).toBeDefined();
            expect(newModule.credential).toBeDefined();
            expect(await newModule.testAuth()).toBeTruthy();

        });

        it.skip('retrieve by credential id', async () => {
            const newModule = await Auther.getInstance({
                userId: module.userId,
                credentialId: module.credential.id,
                definition: Definition,
            });
            expect(newModule).toBeDefined();
            expect(newModule.credential).toBeDefined();
            expect(await newModule.testAuth()).toBeTruthy();

        });
    });

    describe.skip('Test team auth', () => {
        it('processAuthorizationCallback()', async () => {
            // const newModule = await Auther.getInstance({
            //     userId: module.userId,
            //     entityId: module.entity.id,
            //     definition: Definition,
            // });
            // await newModule.processAuthorizationCallback();
            // const res = await newModule.testAuth();
            // expect(res).toBeTruthy();
            // expect(newModule.api.graphApi.access_token).toBeTruthy();
            // expect(newModule.api.botFrameworkApi.access_token).toBeTruthy();
        })
    })

});
