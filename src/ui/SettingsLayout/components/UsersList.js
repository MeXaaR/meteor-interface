import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment'
import Confirmation from '../../components/Confirmation'

// Packages
import { 
    Header,
    Table,
    Button,
    Pagination
} from 'semantic-ui-react';

import UsersEditor from '../components/UsersEditor';

class UsersList extends Component {
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
        const { list = [], style, config = {}, total, page, handlePaginationChange } = this.props;
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
                            <Table.Cell> { item.emails && item.emails[0].address } </Table.Cell>
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

                        <Table.Footer >
                        <Table.Row>
                            <Table.HeaderCell colSpan="4">
                                <Pagination
                                    activePage={page}
                                    onPageChange={handlePaginationChange}
                                    totalPages={total}
                                    size='small'
                                    color='green'
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
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

export default withTracker(({ search, page = 1 }) => {
    const subscription = Meteor.subscribe('interface.users.all', { search, page });
    const ready = subscription.ready();
    const total = Math.ceil(Counts.get('interface.users.count.all')/10)
    const list = Meteor.users.find({}, { sort: { username: 1, _id: 1 } }).fetch();    
    return { ready, list, total };
})(UsersList);