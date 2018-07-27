import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import { Spring, animated } from 'react-spring'

// Packages
import {
    Segment,
    Header,
    Button,
    Form,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import WidgetFormSelector from '../components/WidgetFormSelector'
import { WidgetSelectorContext } from '../../../utils/contexts/WidgetFormContext'
import ConfirmationButton from '../../components/ConfirmationButton'


class ContentEdit extends Component {
    state = {
        changes: false,
        loaded: false,
        itemState: {},
        confirmation: false,
        confirmationObject: {}
    }

    componentWillReceiveProps = (nextProps) => {
        const { item = {} } = nextProps
        if (!this.state.loaded && item._id) {
            const keys = Object.keys(item)
            const itemState = {}
            keys.map(key => {
                itemState[key] = item[key]
            })
            this.setState({ itemState, loaded: true })
        }
    }

    updateValue = (e, { name, value, checked }) => {
        const { itemState = {} } = this.state;
        itemState[name] = typeof checked === "undefined" ? value || '' : checked
        this.setState({ itemState, changes: true })
        return value;
    }

    save = () => {
        const { itemState } = this.state;
        const { history, collection = {}, item = {}, root } = this.props;
        const method = `interface.update.${slugify(collection.label, { lower: true })}`;
        this.setState({ confirmation: false, loading: true })
        const self = this
        Meteor.call(method, { item: itemState }, function (error, result) {
            self.setState({ loading: false })
            if (result) {
                const itemId = item._id || result
                notify.success('Changes saved')
                history.push(`${root}/collections/${slugify(collection.label, { lower: true })}/${itemId}`)
            } else if (error) {
                notify.error(error.reason)
            }
        })
    }

    delete = () => {
        const { history, collection = {}, item = {}, root } = this.props;
        this.setState({ confirmation: false, loading: true })
        const self = this
        const method = `interface.delete.${slugify(collection.label, { lower: true })}`;
        Meteor.call(method, { itemId: item._id }, function (error, result) {
            self.setState({ loading: false })
            if (result) {
                notify.success('Document deleted')
                history.push(`${root}/collections/${slugify(collection.label, { lower: true })}`)
            } else if (error) {
                notify.error(error.reason)
            }
        })
    }

    render() {
        const { itemState = {}, changes, loaded, confirmationObject, confirmation, loading } = this.state;
        const { item = {}, history, ready, collection = {}, firstField, config = {}, root } = this.props;

        // Extract datas from config
        const { collections = [] } = config;

        return (
            <WidgetSelectorContext.Provider
                value={{
                    collection,
                    item: itemState,
                    ready,
                    updateValue: this.updateValue
                }}
            >
                <ContentEditStyle>
                    <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                        {styles =>
                            <animated.div style={styles} >
                                <Segment style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <Header content={`Single item from ${collection.label}: ${item._id ? 'EDITION' : 'NEW'}`} as="h5" />
                                    <div>
                                        {item._id ?
                                            <ConfirmationButton
                                                dialog={["Delete", "Are You Sure?", "Once more to delete"]}
                                                action={this.delete}
                                                // action={() => console.log('yo')}
                                                type='trash'
                                            />
                                            : null}
                                        <ConfirmationButton
                                            dialog={!changes ? ["Saved"] : ["Save", "Are You Sure?"]}
                                            action={!changes ? () => console.log('no changes') : this.save}
                                            times={2}
                                            disabled={!changes}
                                            colors={!changes ? ['grey'] : null}
                                            type={"save"}
                                        />
                                    </div>
                                </Segment>
                            </animated.div>}
                    </Spring>
                    <Spring native from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
                        {styles =>
                            <animated.div style={styles} >
                                <Segment color="green">
                                    <Form loading={loading}>
                                        <WidgetFormSelector
                                            collection={collection}
                                            item={itemState}
                                            ready={ready}
                                            updateValue={this.updateValue}
                                        />
                                    </Form>
                                </Segment>
                            </animated.div>
                        }
                    </Spring>
                </ContentEditStyle>
            </WidgetSelectorContext.Provider>
        )
    }
}


export default withTracker(({ match, config = {} }) => {
    const { collectionSlug, itemId } = match.params
    const { collections = [] } = config
    let collection = null;

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
})(ContentEdit);




const ContentEditStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
   
    .image-selector {
        .choice {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            .button {
                margin-bottom: 3px;
            }
        }
        .wrapper {
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
    }
    .tinymce-selector .wrapper {
        padding: 0px !important;
    }
    .mce-panel.mce-tinymce {
        border: none !important;
        box-shadow: none;
        border-radius: 5px;
        overflow: hidden;
    }
    .mce-top-part::before {
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
    .incrementation {
        color: green;
        cursor: pointer;
        font-size: 12px;
    }
    .decrementation {
        color: red;
        cursor: pointer;
        font-size: 12px;
    }
`