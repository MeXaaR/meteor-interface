import React, { Component } from 'react'

// Packages
import {
    Menu,
    Input
} from 'semantic-ui-react';
import slugify from 'slugify';
import { Transition, Spring, animated } from 'react-spring'


const AnimatedMenu = animated(Menu)

class ContentLeftMenu extends Component {
    state = {
        search: new RegExp('', 'i')
    }

    updateSearch = (e, { value }) => this.setState({ search: new RegExp(value, 'i') })

    render() {
        const { search } = this.state;
        const { location = {}, history, config = {}, root } = this.props
        const list = []
        // Extract datas from config
        const { collections = [] } = config

        collections.map(coll => {
            if (search.test(coll.label)) {
                list.push(coll)
            }
        })
        return (
            <Spring native from={{ opacity: 0, marginLeft: -600 }} to={{ opacity: 1, marginLeft: 0 }}>
                {styles => (
                    <AnimatedMenu
                        pointing
                        fluid
                        vertical
                        style={styles}
                        color="green"
                    >
                        <Menu.Item
                            header
                            name='collections'
                            onClick={() => history.push(`${root}/collections`)}
                        />
                        <Menu.Item>
                            <Input
                                onChange={this.updateSearch}
                                size="small"
                                icon='search'
                                placeholder='Search all...'
                            />
                        </Menu.Item>
                        <Transition
                            keys={list.map(coll => slugify(coll.label, { lower: true }))}
                            from={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                            enter={{ opacity: 1, height: 40, paddingTop: 13, paddingBottom: 13 }}
                            leave={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}>
                            {list.map(coll => styles => {
                                if (!search.test(coll.label) || !Roles.userIsInRole(Meteor.userId(), coll.visible)) {
                                    return null
                                }

                                return (
                                    <Menu.Item
                                        name={coll.label}
                                        style={styles}
                                        icon={coll.icon}
                                        key={slugify(coll.label, { lower: true })}
                                        active={location.pathname.indexOf(`${root}/collections/${slugify(coll.label, { lower: true })}`) > -1}
                                        onClick={() => history.push(`${root}/collections/${slugify(coll.label, { lower: true })}`)}
                                    />
                                )
                            })}
                        </Transition>
                    </AnimatedMenu>
                )}
            </Spring>
        )
    }
}

export default ContentLeftMenu