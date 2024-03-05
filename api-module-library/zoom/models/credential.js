const { Credential: Parent } = require('@friggframework/core');
'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    access_token: { type: String, trim: true, lhEncrypt: true },
    refresh_token: { type: String, trim: true, lhEncrypt: true },
});

const name = 'ZoomCredential';
const Credential =
    Parent.discriminators?.[name] || Parent.discriminator(name, schema);
module.exports = { Credential };
