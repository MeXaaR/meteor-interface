import React from 'react';
import { Spring, animated } from 'react-spring';

// Packages
import {
    Message,
    Header
} from 'semantic-ui-react';
import styled from 'styled-components';


const SettingsHome = ({ config = {} }) => {
    const { roles = [], collections = [] } = config
    const list = [
        'Create and manage users',
        'Decide who can see or edit what',
        'Change some important secret keys like AWS, Stripe or GoogleMaps',
    ]

    const header = 'Restricted area';
    const content = `Welcome in the settings area. Here you can administrate
    some important stuffs. Only people with the highest rank can access to this part
    of your Interface.
    `;

    const list2 = []

    roles.map((role, i) => {
        let view = `${role} can see `
        let edition = `${role} can edit `
        let creation = `${role} can create `
        collections.map(collection => {
            if (collection.visible.indexOf(role) > -1) {
                view = view + ' ' + collection.label + ','
            }
            if (collection.edit.indexOf(role) > -1) {
                edition = edition + ' ' + collection.label + ','
            }
            if (collection.create.indexOf(role) > -1 && !collection.single) {
                creation = creation + ' ' + collection.label + ','
            }
        })
        if (i === 0) {
            view = view + ' Users, General settings'
            edition = edition + ' Users, General settings'
            creation = creation + ' Users, General settings'
        }
        list2.push(view)
        list2.push(edition)
        list2.push(creation)

    })

    const header2 = 'Users roles rights listing';
    const content2 = `Each role give users access to different parts of Interface. 
    Here is the list.
    `;

    return (
        <SettingsHomeStyle>
            <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                {styles => (
                    <AnimatedMessage style={styles} size="large">
                        <Message.Header as={Header} dividing color="green">{header}</Message.Header>
                        <p>{content}</p>
                        <Message.List>
                            {list.map(item => <Message.Item key={item}>{item}</Message.Item>)}
                        </Message.List>
                    </AnimatedMessage>
                )}
            </Spring>
            <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                {styles2 => (
                    <AnimatedMessage style={styles2} size="large">
                        <Message.Header as={Header} dividing color="green">{header2}</Message.Header>
                        <p>{content2}</p>
                        <Message.List>
                            {list2.map(item => <Message.Item key={item}>{item}</Message.Item>)}
                        </Message.List>
                    </AnimatedMessage>
                )}
            </Spring>
        </SettingsHomeStyle>
    )
}

const AnimatedMessage = animated(Message)

export default SettingsHome

const SettingsHomeStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`