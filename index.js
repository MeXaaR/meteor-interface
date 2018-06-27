import  Interface from './src/router';
import  createInterface from './src/lib/createInterface';
import  configuration from './src/lib/configuration';

if(Meteor.isServer){
    require('./src/server/index');
} else {
    require('./src/client/index');
}

export { configuration, createInterface };
export default Interface