import React, { Component, Fragment } from 'react';

// Packages
import { 
    Header,
    Button,
    Modal,
    Message,
    Icon,
    Form,
    Transition
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import ErrorHandler from '../../../utils/ErrorHandler'


const inputs = [
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'email', label: 'Email address', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'checkPassword', label: 'Repeat the password', type: 'password' },
]


class UserCreator extends Component {
    constructor(props){
        super(props)
        const { user } = props;
        this.state = {
            roles: user.roles,
            userId: user._id,
            username: user.username
        }
    }
    
    createUser = () => {
        const { user } = this.state;
        
        const method = 'interface.users.update.roles';
        this.setState({ loading: true })
        const self = this
        Meteor.call(method, { newRoles: this.state.roles, userId: this.state.userId }, function(error, result = {} ){
            self.setState({ loading: false })
            if(result){
                notify.success("User rights updated")
                self.toggleModal()
            } else if (error){
                notify.error(error.reason)
            }
        })
    }
    
    toggleModal = () => this.setState({ open: !this.state.open });
    updateValue = (e, { value, name }) => this.setState({ [name]: value });
    
    
    render(){
        const { 
            loading, 
            open,
            error 
        } = this.state;

        const { config } = this.props;
        const { roles } = config
        
        const rolesOptions = roles.map(role => ({ key: role, text: role, value: role }))
        if(error){
            throw new Error(error.message)
        }
        
        return(
            <Fragment>
                <Button
                    content="EDIT"
                    size="mini"
                    icon="edit"
                    color="blue"
                    labelPosition="left"
                    onClick={this.toggleModal}
                />
                <Transition visible={open} >
                    <Modal 
                        size='small'
                        open={open} 
                    >
                        <Icon name="close" onClick={this.toggleModal} />
                        <Header icon='user' content={this.state.username +' roles'} />
                        <Modal.Content>
                            <Form>
                            <Form.Dropdown 
                                placeholder='Roles' 
                                label='Roles' 
                                fluid 
                                multiple 
                                selection 
                                name='roles'
                                value={this.state.roles}
                                onChange={this.updateValue}
                                options={rolesOptions} 
                            />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button 
                                color="red"
                                content="Cancel"
                                loading={loading}
                                onClick={this.toggleModal}
                            />
                            <Button 
                                color="blue"
                                content="Update"
                                loading={loading}
                                onClick={this.createUser}
                            />
                        </Modal.Actions>

                    </Modal>
                </Transition>
            </Fragment>
        )
    }
}

export default ErrorHandler(UserCreator)



const UserCreatorStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`