import { Mongo } from 'meteor/mongo';
import { InterfaceCollections } from '../lib/core'

InterfaceCollections.settings = new Mongo.Collection('interface.settings');

if(Meteor.isServer && !InterfaceCollections.settings.findOne()){
    InterfaceCollections.settings.insert({
        _id: "interface.settings",
        AWSAccessKeyId: '',
        AWSSecretAccessKey: '',
        AWSBucket: ''
    })
}