import { Meteor } from 'meteor/meteor';
import slugify from 'slugify';

// Global Config
import configuration from '../../lib/configuration'


const initMethods = () => {
  const config = configuration.get()
  const methods = {}
  const {
    collections = [],
    logs
  } = config
  logs && console.log('------ METHODS CREATION STARTED ------')

  collections.map(coll => {
    methods[`interface.update.${slugify(coll.label, { lower: true })}`] = function ({ item = {} }) {
      const isAuthorizedToUpdate = Roles.userIsInRole(this.userId, coll.edit);
      const isAuthorizedToCreate = Roles.userIsInRole(this.userId, coll.edit);
      try {
        if (!isAuthorizedToUpdate && !isAuthorizedToCreate) {
          throw new Meteor.Error(403, "You aren't authorized to do that");
        }
        if (item._id && isAuthorizedToUpdate) {
          return coll.mongo.update({ _id: item._id }, { $set: { ...item } })
        } else if (!item._id && isAuthorizedToCreate) {
          return coll.mongo.insert({ ...item })
        } else {
          throw new Meteor.Error(403, "You aren't authorized to do that");
        }
      } catch (error) {
        throw new Meteor.Error(error.error, error.message);
      }
    }

    methods[`interface.delete.${slugify(coll.label, { lower: true })}`] = function ({ itemId, itemIds = [] }) {
      const isAuthorized = Roles.userIsInRole(this.userId, coll.edit);
      try {
        if (!isAuthorized) {
          throw new Meteor.Error(403, "You aren't authorized to do that");
        }
        if (itemIds.length > 0) {
          return coll.mongo.remove({ _id: { $in: itemIds } })
        } else {
          return coll.mongo.remove({ _id: itemId })
        }
      } catch (error) {
        throw new Meteor.Error(error.error, error.message);
      }
    }

    methods[`interface.duplicate.${slugify(coll.label, { lower: true })}`] = function ({ itemIds = [] }) {
      const isAuthorized = Roles.userIsInRole(this.userId, coll.edit);
      try {
        if (!isAuthorized) {
          throw new Meteor.Error(403, "You aren't authorized to do that");
        }
        return itemIds.map(itemId => {
          const item = coll.mongo.findOne({ _id: itemId }, { fields: { _id: 0 } });
          coll.mongo.insert({ ...item })
        })
      } catch (error) {
        throw new Meteor.Error(error.error, error.message);
      }
    }
  })

  logs && console.log(methods)
  logs && console.log('------ METHODS CREATION FINISHED------');

  Meteor.methods({ ...methods });
}

export default initMethods