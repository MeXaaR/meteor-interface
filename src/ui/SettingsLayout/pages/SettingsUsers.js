import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Spring } from 'react-spring'
import moment from 'moment'
import Confirmation from '../../components/Confirmation'

// Packages
import { 
    Segment,
    Header,
    Table,
    Button,
} from 'semantic-ui-react';
import styled from 'styled-components';

import UsersCreator from '../components/UsersCreator';
import UsersEditor from '../components/UsersEditor';


const SettingsUsers = ({ history, ready, list = [], config  }) => (
    <SettingsUsersStyle>
        <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
        { styles => 
            <Segment style={{...styles, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Header style={{ marginBottom: 0 }} content="Users" icon="users" as="h5" />
                    <UsersCreator config={config} />

            </Segment> }
        </Spring>
        <Spring from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
        { styles2 => 
            <ListInTable 
                list={list} 
                style={styles2} 
                history={history} 
                collection={Meteor.users}
                config={config}
            /> }
        </Spring>
    </SettingsUsersStyle>
)


export default withTracker(() => {
    const subscription = Meteor.subscribe('interface.users.all');
    const ready = subscription.ready();
    const list = Meteor.users.find({}, { sort: { username: 1, _id: 1 } }).fetch();    
    return { ready, list };
})(SettingsUsers);

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
class ListInTable extends Component {
    state = {
        confirmationObject: {},
        confirmation: false
    }
    toggleConfirmationDelete = (e, { value }) => {
        e.preventDefault();
        const confirmationObject = {
          title: 'Delete the user',
          text: 'You are about to delete this user, this cannot be undone.',
          cancel: () => this.setState({ confirmation: !this.state.confirmation, userId: '' }),
          confirm: this.delete,
        };
        this.setState({
            confirmation: !this.state.confirmation, 
            confirmationObject,
            userId: value
        });
    }
    delete = () => {
        const { userId } = this.state
        this.setState({ loading: true })
        const self = this;
        self.setState({ loading: true })
        Meteor.call('interface.users.delete', { userId }, function(error, result){
            self.setState({ loading: false, confirmation: false, confirmationObject: {} })
            if(result){
                notify.success("User deleted")
            } else if (error){
                notify.error(error.reason)
            }
        })
    }

    render() {
        const { confirmation, confirmationObject, loading } = this.state;
        const { list = [], style, config = {} } = this.props;
        return(
            <Fragment>
                <Table size='small' celled selectable style={style} color="green">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Users</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Roles</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                    { list.map(item =>
                        <Table.Row key={item._id} >
                            <Table.Cell>
                                <Header as='h5'>
                                        <Header.Content>
                                            { item.username }
                                        { item.createdAt ? <Header.Subheader>{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Header.Subheader> : null }
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell> { item.emails[0].address } </Table.Cell>
                            <Table.Cell> { JSON.stringify(item.roles) } </Table.Cell>
                            <Table.Cell collapsing>
                                <UsersEditor user={item} config={config} />
                                {Meteor.userId() !== item._id && 
                                    <Button
                                        content="DELETE"
                                        size="mini"
                                        icon="trash"
                                        value={item._id}
                                        onClick={this.toggleConfirmationDelete}
                                        color="red"
                                        labelPosition="left"
                                    />}

                            </Table.Cell>
                        </Table.Row>
                    )}
                    </Table.Body>
                </Table>

                <Confirmation
                    confirmation={confirmation}
                    loading={loading}
                    confirmationObject={confirmationObject}
                />
            </Fragment>
        )
    }
}