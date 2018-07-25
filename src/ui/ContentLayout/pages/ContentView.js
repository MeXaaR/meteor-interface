import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { Transition, Spring, animated } from 'react-spring'

// Packages
import {
    Segment,
    Header,
    Button,
    Label,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import LoadingComponent from '../../components/LoadingComponent'
import WidgetSelector from '../components/WidgetSelector'

const ContentView = ({ item = {}, history, ready, collection = {}, firstField, config = {}, root }) => {
    const editable = Roles.userIsInRole(Meteor.userId(), collection.edit)
    return (
        <ContentViewStyle>
            <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                {styles =>
                    <animated.div style={styles} >
                        <Segment style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Header content={`Single item from ${collection.label}`} as="h5" />
                            {editable &&
                                <Link to={`${root}/collections/${slugify(collection.label, { lower: true })}/${item._id}/edit`}>
                                    <Button
                                        content="EDIT"
                                        size="mini"
                                        icon="edit"
                                        color="blue"
                                        labelPosition="left"
                                    />
                                </Link>}
                        </Segment>
                    </animated.div>}
            </Spring>
            <Spring native from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
                {styles =>
                    <animated.div style={styles} >
                        <Segment color="green">
                            <WidgetSelector
                                collection={collection}
                                item={item}
                                ready={ready}
                            />
                        </Segment>
                    </animated.div>
                }
            </Spring>

        </ContentViewStyle>
    )
}


export default withTracker(({ match, config }) => {
    const { collectionSlug, itemId } = match.params
    let collection = null;
    const { collections = [] } = config

    collections.map(coll => {
        const slug = slugify(coll.label, { lower: true })
        if (slug === collectionSlug)
            collection = coll
    })

    const subscription = Meteor.subscribe(`interface.one.${slugify(collection.label, { lower: true })}`, { itemId })
    const ready = subscription.ready()

    const firstField = collection.fields[0].name
    const item = collection.mongo.findOne({ _id: itemId })

    return { collection, ready, item, firstField };
})(ContentView);




const ContentViewStyle = styled.div`
  h5.header {
      letter-spacing:2px;
      margin-bottom: 0;
      
  }
`