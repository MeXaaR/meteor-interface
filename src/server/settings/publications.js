import { InterfaceCollections } from '../../lib/core';

// Global Config
import configuration from '../../lib/configuration'


Meteor.publish('interface.settings.all', function(){
    const config = configuration.get()
    // Extract datas from config
    const { roles = [] } = config

    const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
    if (!isAuthorized) {
        throw new Meteor.Error(403, "You aren't authorized to do that");
    }
    return InterfaceCollections.settings.find()
})