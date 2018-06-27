import React, { Component } from 'react'

// Packages
import { 
    Menu, 
    Input
} from 'semantic-ui-react';
import { Transition, Spring } from 'react-spring'


const settingsItem = [
    { label: 'Users', path: 'users', icon: 'users' },
    { label: 'Keys', path: 'keys', icon: 'key' },
    // { label: 'Database', path: 'database', icon: 'database' },
]

const SettingsLeftMenu = ({ location = {}, history, root }) => (
    <Spring from={{ opacity: 0, marginLeft: -600 }} to={{ opacity: 1, marginLeft: 0 }}>
        { styles => (
            <Menu 
                pointing 
                fluid
                vertical 
                style={styles}
                color="green"
            >
                <Transition
                    keys={settingsItem.map(item => item.path)}
                    from={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                    enter={{ opacity: 1, height: 40, paddingTop: 13, paddingBottom: 13 }}
                    leave={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}>
                    { settingsItem.map(item => styles => (
                            <Menu.Item 
                                name={item.label}
                                style={styles}
                                icon={item.icon}
                                key={item.path}
                                active={location.pathname.indexOf(`${root}/settings/${item.path}`) > -1 }
                                onClick={() => history.push(`${root}/settings/${item.path}`)} 
                            />
                        )) 
                    }
                </Transition>
            </Menu>
        )}
    </Spring>
)

export default SettingsLeftMenu