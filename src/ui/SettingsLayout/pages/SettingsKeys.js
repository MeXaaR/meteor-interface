import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { Transition, Spring, animated } from 'react-spring';

// Packages
import {
    Segment,
    Header,
    Button,
    Label,
    Form,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import Confirmation from '../../components/Confirmation'

// Collection
import { InterfaceCollections } from '../../../lib/core'
import ErrorHandler from '../../../utils/ErrorHandler';

const fields = [
    'AWSAccessKeyId',
    'AWSSecretAccessKey',
    'AWSBucket',
    'AWSRegion'
]

class SettingsKeys extends Component {
    state = {
        changes: false,
        loaded: false,
        itemState: {},
        confirmation: false,
        confirmationObject: {}
    }

    componentWillReceiveProps = (nextProps) => {
        const { interfaceSettings = {}, ready } = nextProps
        if (!this.state.loaded && ready && interfaceSettings && interfaceSettings._id) {
            const keys = Object.keys(interfaceSettings)
            const itemState = {}
            keys.map(key => {
                itemState[key] = interfaceSettings[key]
            })
            this.setState({ itemState, loaded: true })
        }
    }

    updateValue = (e, { name, value, checked }) => {
        const { itemState = {} } = this.state;
        itemState[name] = value || checked
        this.setState({ itemState, changes: true })
    }

    save = () => {
        const { itemState } = this.state;
        const { history, collection = {}, item = {} } = this.props;
        const method = 'interface.update.keys';
        this.setState({ confirmation: false, loading: true })
        const self = this
        Meteor.call(method, { keys: itemState }, function (error, result) {
            self.setState({ loading: false })
            if (result) {
                const itemId = item._id || result
                notify.success('Changes saved')
            } else if (error) {
                notify.error(error.reason)
            }
        })
    }

    toggleConfirmationSave = (e) => {
        e.preventDefault();
        const confirmationObject = {
            title: 'Save and publish the document',
            text: 'You are about to save your modification and publish it immediatly',
            cancel: () => this.setState({ confirmation: !this.state.confirmation }),
            confirm: this.save,
        };
        this.setState({ confirmation: !this.state.confirmation, confirmationObject });
    }

    render() {
        const { itemState = {}, changes, loaded, confirmationObject, confirmation, loading } = this.state;
        const { interfaceSettings = {}, history, ready } = this.props;
        return (
            <SettingsKeysStyle>
                <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                    {styles =>
                        <animated.div style={styles} >
                            <Segment style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Header content='Interface Settings' as="h5" />
                                <div>
                                    <Button
                                        content={changes === false ? "SAVED" : "SAVE"}
                                        size="mini"
                                        icon="save"
                                        onClick={changes === false ? null : this.toggleConfirmationSave}
                                        color={changes === false ? "grey" : "green"}
                                        labelPosition="left"
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
                                    {fields.map(key => (
                                        <Form.Input
                                            name={key}
                                            label={key}
                                            key={key}
                                            value={this.state.itemState[key] || ''}
                                            onChange={this.updateValue}
                                            fluid
                                        />
                                    ))}
                                </Form>
                            </Segment>
                        </animated.div>
                    }
                </Spring>
                <Confirmation
                    confirmation={confirmation}
                    loading={loading}
                    confirmationObject={confirmationObject}
                />
            </SettingsKeysStyle>
        )
    }
}




export default ErrorHandler(withTracker(({ config }) => {
    const { collections } = config

    const subscription = Meteor.subscribe('interface.settings.all')
    const ready = subscription.ready()

    console.log(InterfaceCollections)
    const interfaceSettings = InterfaceCollections.settings.findOne()
    return { ready, interfaceSettings };
})(SettingsKeys));




const SettingsKeysStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`