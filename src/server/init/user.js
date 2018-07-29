// Global Config
import configuration from '../../lib/configuration'

const initUser = () => {
    const config = configuration.get()
    // Extract datas from config
    const { roles = [], logs } = config


    const isThereSomeRoles = !!(roles && roles[0])
    if (!isThereSomeRoles) {
        logs && console.log('There are no roles in your config file. Please add at least one role to have an administration security!')
    } else if (isThereSomeRoles && !Meteor.users.findOne()) {
        logs && console.log('------ FIRST USER INITIALIZATION ------')
        console.log('ok')
        const firstUser = {
            username: 'admin',
            email: 'admin@admin.fr',
            password: 'admin'
        }
        const userId = Accounts.createUser(firstUser);
        Roles.addUsersToRoles(userId, [roles[0]])


        logs && console.log(`username: 'admin'`);
        logs && console.log(`email: 'admin@admin.fr'`);
        logs && console.log(`password: 'admin'`);
        logs && console.log(`roles: ${roles[0]}`);
        logs && console.log('------ FIRST USER INITIALIZED ------');
    }
}

export default initUser