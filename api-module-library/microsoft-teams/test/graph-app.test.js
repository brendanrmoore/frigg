const Authenticator = require('@friggframework/test-environment/Authenticator');
const Api = require('../api/graph');
const config = require('../defaultConfig.json');
const chai = require('chai');
const should = chai.should();
describe(`${config.label} API Tests`, () => {
    const apiParams = {
        client_id: process.env.TEAMS_CLIENT_ID,
        client_secret: process.env.TEAMS_CLIENT_SECRET,
        team_id: process.env.TEAMS_TEAM_ID,
        tenant_id: process.env.TEAMS_TENANT_ID,
        scope: process.env.TEAMS_CRED_SCOPE,
        forceConsent: false
    };
    const api = new Api.graphApi(apiParams);

    beforeAll(async () => {
        await api.getTokenFromClientCredentials();
    });
    describe('OAuth Flow Tests', () => {
        it('Should generate an access_token', async () => {
            api.access_token.should.exist;
        });
    });

    describe('Basic Identification Requests', () => {
        it('Should retrieve information about the Organization', async () => {
            const org = await api.getOrganization();
            org.should.exist;
        });
    });

    let groups;
    describe('Retrieve teams for tenant/org', () => {
        it('Should retrieve a list of groups/teams', async () => {
            groups = await api.getGroups();
            groups.should.exist;
        });
    });


    describe('Retrieve channels for a team', () => {
        it('Should retrieve a list of channels for a team', async () => {
            // const aTeamId = groups.value[0].id;
            // const channels = await api.getChannels(aTeamId);
            // for now use .env team id
            const channels = await api.getChannels();
            channels.should.exist;
        });
    });


    describe('Channel Create, Modification and Deletion', () => {
        const mwebberUserId = 'c1cb384d-8a26-464e-8fe3-7117e5fd7918'
        let createChannelResponse;

        it('Should create channel', async () => {
            const conversationMember = {
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: ['owner'],
                'user@odata.bind': `https://graph.microsoft.com/v1.0/users(\'${mwebberUserId}\')`
            };
            const body = {
                "displayName": `Test channel ${Date.now()}`,
                "description": "Test channel created by api.test",
                "membershipType": "private",
                "members":
                    [
                        conversationMember
                    ]
            };
            createChannelResponse = await api.createChannel(body);
            createChannelResponse.should.exist;
        });

        it('Should Add user to channel Request', async () => {
            const conversationMember = {
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: [],
                'user@odata.bind': `https://graph.microsoft.com/v1.0/users(\'${mwebberUserId}\')`
            };
            const response = await api.addUserToChannel(createChannelResponse.id, conversationMember);
            response.should.exist;
        });

        it('Should list users in channel', async () => {
            const response = await api.listChannelMembers(createChannelResponse.id);
            response.should.exist;
            expect(response.value[0].userId).toBe(mwebberUserId)
        });

        it('Should delete the channel', async () => {
            const response = await api.deleteChannel(createChannelResponse.id);
            expect(response.status).toBe(204);
        });
    });

    describe('App info, installation, deletion', () => {
        it('Should retrieve app info', async ()=> {
            const response = await api.getAppCatalog();
            expect(response.value.length).toBeDefined();
            expect(response.value.length).toBeGreaterThan(10);
        })
        it('Should filter for specific app', async () => {
            // test app id
            const appExternalId = 'd0f523b9-97e8-42d9-9e0a-d82da5ec3ed1'
            const response = await api.getAppCatalog(`$filter=externalId eq '${appExternalId}'`);
            expect(response.value).toHaveLength(1);
        })
    });











});
