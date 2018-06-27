import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import { Redirect } from 'react-router-dom'

import DynamicImporter from "../../../utils/DynamicImporter";
import LoadingComponent from "../../components/LoadingComponent";

const ContentList = DynamicImporter(() => import('../pages/ContentList'))

const params = new ReactiveVar({
    page: 1,
    search: ''
})

const ContentBalancer = ({ collection = {}, config = {}, root, ...rest }) => {
    if(collection.single){
        const { match, list = {}, ready } = rest
        const { collectionSlug } = match.params;
        if(!ready){
            return <LoadingComponent/>
        }
        if(list._id){
            return <Redirect to={`${root}/collections/${collectionSlug}/${list._id}`} />
        } 
        return <Redirect to={`${root}/collections/${collectionSlug}/new`} />
    } 
    return <ContentList params={params} collection={collection} {...rest} config={config} root={root} />
}

export default withTracker(({ match, config }) => {
    const { collections = [] } = config;
    const { collectionSlug } = match.params
    let collection = null;

    collections.map(coll => {
        const slug = slugify(coll.label, { lower: true })
        if(slug === collectionSlug){
            collection = coll
        }
    })

    const subscriptionName = collection.single ? `interface.single.${collectionSlug}` : `interface.all.${collectionSlug}`;
    const subscription = Meteor.subscribe(subscriptionName, params.get())
    const ready = subscription.ready()
    const firstField = collection.fields[0].name
    const number = Counts.get(`count-all-${slugify(collection.label, { lower: true })}`)
    const list = collection.single ? collection.mongo.findOne({}) :  collection.mongo.find({}, { sort: { [firstField]: 1, _id: 1 } }).fetch()    
    return { collection, ready, list, firstField, number };
  })(ContentBalancer);
