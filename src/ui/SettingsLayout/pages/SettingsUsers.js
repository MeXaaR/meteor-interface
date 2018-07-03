import React, { Component } from 'react';
import { Spring } from 'react-spring'

// Packages
import { 
    Segment,
    Header,
    Input
} from 'semantic-ui-react';
import styled from 'styled-components';

import UsersCreator from '../components/UsersCreator';
import UsersList from '../components/UsersList';

class SettingsUsers extends Component {
    state = {
        search: '',
        page: 1
    }

    updateSearch = (e, { value }) => this.setState({ search: value, page: 1 })

    handlePaginationChange = (e, { activePage }) => this.setState({ page: activePage })

    render(){
        const { history, config  } = this.props
        const { search, page } = this.state;

        return (
            <SettingsUsersStyle>
            <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
            { styles => 
                <Segment style={{...styles, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Header style={{ marginBottom: 0 }} content="Users" icon="users" as="h5" />
                    <UsersCreator config={config} />
                </Segment> }
            </Spring>

            <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
            { styles => 
                <Input 
                    placeholder="Search..."
                    style={{ ...styles, marginBottom: 10, borderRadius: 5, boxShadow: "1px 1px 2px 0px rgba(0,0,0, 0.3)" }}
                    onChange={this.updateSearch}
                    fluid 
                    value={search}
                /> }
            </Spring>

                <Spring from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
                { styles2 => 
                    <UsersList 
                        style={styles2} 
                        history={history} 
                        collection={Meteor.users}
                        config={config}
                        search={search}
                        page={page}
                        handlePaginationChange={this.handlePaginationChange}
                    /> }
                </Spring>
            </SettingsUsersStyle>
        )
    }
}

export default SettingsUsers

const SettingsUsersStyle = styled.div`
  h5.header {
      letter-spacing:2px;
  }
  .single-vignette {
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: box-shadow 0.2s ease-in;
    cursor: pointer;
    .ui.statistic {
        margin-top: 0;
        .value{
            color: #21ba45!important;
        }
    }
    &:hover {
        box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.75);
    }
  }
`