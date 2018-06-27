import React, { createContext } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import configuration from '../../lib/configuration'


export const UserContext = createContext();


const UserProvider = ({ children, ...rest}) => (
  <UserContext.Provider value={rest} >
    {children}
  </UserContext.Provider>
)


export default withTracker(() => {
  const config = configuration.get();
    const { roles = [] } = config
    const permissions = {};
     roles.map(role => {
      permissions[role] = Meteor.isClient && Roles.userIsInRole(Meteor.userId(), [role])
    })
    
    return {
      user: Meteor.isServer ? false : Meteor.user(),
      loggingIn: Meteor.isServer ? true : Meteor.loggingIn(),
      authenticated: Meteor.isServer ? false : Meteor.userId() !== null && Meteor.userId() !== undefined,
      authorized: Meteor.isServer ? false : Roles.userIsInRole(Meteor.userId(), roles),
      config,
      permissions
    };
  })(UserProvider);

export const ContextHOC = (ComponentWrapped) => props => (
  <UserContext.Consumer>
    {context => <ComponentWrapped {...props} {...context} /> }
  </UserContext.Consumer>
)