// Global Config
import configuration from '../../lib/configuration'

Meteor.methods({
    'interface.users.create'({ user }) {
        const config = configuration.get()
        // Extract datas from config
        const { roles = [] } = config

        const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
        try {
            if (!isAuthorized) {
                throw new Meteor.Error(403, "You aren't authorized to do that");
            }
            const userId = Accounts.createUser(user)
            Roles.addUsersToRoles(userId, user.roles)
            return userId
        } catch (error) {
            throw new Meteor.Error(error.error, error.message);
        }
    },
    'interface.users.delete'({ userId }) {
        const config = configuration.get()
        // Extract datas from config
        const { roles = [] } = config

        const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
        try {
            if (!isAuthorized) {
                throw new Meteor.Error(403, "You aren't authorized to do that");
            } else if (this.userId === userId) {
                throw new Meteor.Error(403, "You can't delete your own account");
            }
            return Meteor.users.remove({ _id: userId })
        } catch (error) {
            throw new Meteor.Error(error.error, error.message);
        }
    },
    'interface.users.update.roles'({ newRoles, userId }) {
        const config = configuration.get()
        // Extract datas from config
        const { roles = [] } = config

        const isAuthorized = Roles.userIsInRole(this.userId, [roles[0]]);
        try {
            if (!isAuthorized) {
                throw new Meteor.Error(403, "You aren't authorized to do that");
            } else if (this.userId === userId && newRoles.indexOf(roles[0]) === -1) {
                throw new Meteor.Error(403, `You can't delete the ${roles[0]} role from you account`);
            }
            return Meteor.users.update({ _id: userId }, { $set: { roles: newRoles } })
        } catch (error) {
            throw new Meteor.Error(error.error, error.message);
        }
    },
    'interface.users.update.profile'({ email, username }) {

        try {
            //get old email
            const user = Meteor.users.findOne(this.userId);
            const oldEmail = user.emails[0].address
            const oldUsername = user.username

            if (email !== oldEmail) {
                Accounts.addEmail(this.userId, email);
                Accounts.removeEmail(this.userId, oldEmail);
            }
            if (oldUsername !== username) {
                Accounts.setUsername(this.userId, username)
            }
            return true

        } catch (error) {
            throw new Meteor.Error(error.error, error.message);
        }
    }
})