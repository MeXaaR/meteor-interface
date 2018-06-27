// Global Config
import configuration from '../../lib/configuration'


Meteor.publish('interface.users.all', function(){
    const config = configuration.get()
    // Extract datas from config
    const { roles = [] } = config
    
    const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
    if (!isAuthorized) {
        throw new Meteor.Error(403, "You aren't authorized to do that");
    }
    return Meteor.users.find();
});

Meteor.publish('interface.users.one', function({ userId }){
    const config = configuration.get()
    // Extract datas from config
    const { roles = [] } = config
    
    const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
    if (!isAuthorized) {
        throw new Meteor.Error(403, "You aren't authorized to do that");
    }
    return Meteor.users.find({ _id: userId });
});