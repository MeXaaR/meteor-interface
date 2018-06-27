import { InterfaceCollections } from '../../lib/core';

// Global Config
import configuration from '../../lib/configuration'

Meteor.methods({
    'interface.update.keys'({ keys }){
        const config = configuration.get()
        // Extract datas from config
        const { 
            roles = [],
        } = config

        const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
        try {
          if (!isAuthorized) {
              throw new Meteor.Error(403, "You aren't authorized to do that");
          }
            const result = InterfaceCollections.settings.update({ _id: "interface.settings" }, { $set: { ...keys } }, { upsert: true })
            return result
        } catch (error) {
          throw new Meteor.Error(error.error, error.message);
        }
    }
})