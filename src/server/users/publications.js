// Global Config
import configuration from '../../lib/configuration'


Meteor.publish('interface.users.all', function({ search, page }){
    const config = configuration.get()
    // Extract datas from config
    const { roles = [] } = config
    
    const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
    if (!isAuthorized) {
        throw new Meteor.Error(403, "You aren't authorized to do that");
    }
    const regex = { $regex: new RegExp(search, 'i') };
    const research = { $or: [
        { username: regex },
        { 'emails.0.address': regex },
    ]};
    Counts.publish(this, 'interface.users.count.all', Meteor.users.find(research));
    return Meteor.users.find(research, { limit: 10, skip: (page - 1) * 10 });
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