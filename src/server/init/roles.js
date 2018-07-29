
// Global Config
import configuration from '../../lib/configuration'

const createRoles = () => {
    const config = configuration.get()
    const { roles = [], logs } = config;
    logs && console.log('------ ROLES INIT ------')

    if (!roles || !roles[0]) {
        logs && console.log('There are no roles in your config file. Please add at least one role to have an administration security!')
    } else {
        roles.map((role) => {
            const isExisting = Meteor.roles.findOne({ name: role });
            if (!isExisting) {
                const newRole = Roles.createRole(role);
                logs && console.log('Role created: ' + role);
            }
        });
        Meteor.roles.find().map((role) => {
            let isExisting = false
            roles.map(baseRole => {
                if (baseRole === role.name) {
                    isExisting = true
                }
            })
            if (!isExisting) {
                Meteor.roles.remove({ _id: role._id });
                logs && console.log('Role deleted: ' + role)
            }
        });
        logs && console.log('All roles done: ' + JSON.stringify(roles))
    }
    logs && console.log('------ ROLES FINISHED ------')
}

export default createRoles
