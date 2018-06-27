import React from 'react'

// Packages
import { 
    Menu, 
} from 'semantic-ui-react';
import { Transition, Spring } from 'react-spring'


const ProfileLeftMenu = ({ location = {}, history, root, config }) => {
    
    
    const profilefItem = [
        { label: 'Profile', path: `${root}/profile`, icon: 'user' },
        { label: 'Security', path: `${root}/profile/security`, icon: 'lock' },
        { label: 'Logout', path: '', icon: 'sign out alternate', action: Meteor.logout },
    ]

    return (
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
                    keys={profilefItem.map(item => item.label)}
                    from={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                    enter={{ opacity: 1, height: 40, paddingTop: 13, paddingBottom: 13 }}
                    leave={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}>
                    { profilefItem.map(item => styles => (
                            <Menu.Item 
                                name={item.label}
                                style={styles}
                                icon={item.icon}
                                key={item.label}
                                active={item.action ? null : location.pathname === item.path }
                                onClick={item.action ? item.action : () => history.push(item.path)} 
                            />
                        )) 
                    }
                </Transition>
            </Menu>
        )}
    </Spring>
)}

export default ProfileLeftMenu