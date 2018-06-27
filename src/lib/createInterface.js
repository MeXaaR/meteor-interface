import configuration from './configuration'

const createInterface = (newConfiguration) => {
    configuration.set(newConfiguration)
    if(Meteor.isServer){
        require('../server/init/index');
        require('../server/collections/index');
       
    }
}

export default createInterface