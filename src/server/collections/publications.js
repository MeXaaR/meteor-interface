import slugify from 'slugify';

// Global Config
import configuration from '../../lib/configuration'


const initPublications = () => {
    const config = configuration.get()
    // Extract datas from config
    const { collections = [] } = config

    Meteor.publish('interface.counters.all.collections', function () {
        collections.map(coll => {
            if (Roles.userIsInRole(Meteor.userId(), coll.visible)) {
                Counts.publish(this, `count-all-${slugify(coll.label, { lower: true })}`, coll.mongo.find());
            }
        })
    });

    collections.map(coll => {
        Meteor.publish(`interface.all.${slugify(coll.label, { lower: true })}`, function ({ search = '', page }) {
            const isAuthorized = Roles.userIsInRole(this.userId, coll.visible);
            if (!isAuthorized) {
                throw new Meteor.Error(403, "You aren't authorized to do that");
            }
            const regex = { $regex: new RegExp(search, 'i') };
            const research = { $or: coll.fields.map(field => ({ [field.name]: regex })) };
            Counts.publish(this, `count-all-${slugify(coll.label, { lower: true })}`, coll.mongo.find(research));
            return coll.mongo.find(research, { limit: 10, skip: (page - 1) * 10 });
        });
        Meteor.publish(`interface.one.${slugify(coll.label, { lower: true })}`, function ({ itemId }) {
            const isAuthorized = Roles.userIsInRole(this.userId, coll.visible);
            if (!isAuthorized) {
                throw new Meteor.Error(403, "You aren't authorized to do that");
            }
            return coll.mongo.find({ _id: itemId }, { sort: { _id: 1 }, limit: 1 });
        });
        Meteor.publish(`interface.single.${slugify(coll.label, { lower: true })}`, function () {
            const isAuthorized = Roles.userIsInRole(this.userId, coll.visible);
            if (!isAuthorized) {
                throw new Meteor.Error(403, "You aren't authorized to do that");
            }
            return coll.mongo.find({}, { sort: { _id: 1 }, limit: 1 });
        });
    })
}

export default initPublications