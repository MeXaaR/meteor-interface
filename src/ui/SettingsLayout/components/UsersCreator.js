import React, { Component, Fragment } from 'react';

// Packages
import { 
    Header,
    Button,
    Modal,
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



const initialState = {
    error: null,
    username: '', 
    password: '', 
    checkPassword: '', 
    email: '', 
    loading: false,
    roles: []
}
class UserCreator extends Component {
    state = initialState

    createUser = () => {
        const { username, password, checkPassword, email } = this.state;

        const method = 'interface.users.create';
        this.setState({ loading: true })
        const user = { username, password, email, roles: this.state.roles }
        const self = this
        if(password !== checkPassword){
            notify.error("Passwords don't match")
        } else {
            Meteor.call(method, { user }, function(error, result = {} ){
                self.setState({ ...initialState })
                if(result){
                    notify.success("User created")
                    self.toggleModal()
                } else if (error){
                    notify.error(error.reason)
                }
            })
        }
    }

    toggleModal = () => this.setState({ open: !this.state.open });
    updateValue = (e, { value, name }) => this.setState({ [name]: value });

    render(){

        const { config } = this.props;
        const { roles } = config;

        const rolesOptions = roles.map(role => ({ key: role, text: role, value: role }))

        const { 
            loading, 
            open,
            error 
        } = this.state;


        if(error){
            throw new Error(error.message)
        }

        return(
            <Fragment>
                <Button
                    content="NEW"
                    size="mini"
                    icon="plus"
                    color="green"
                    labelPosition="left"
                    onClick={this.toggleModal}
                />
                <Transition visible={open} >
                    <Modal 
                        size='small'
                        open={open} 
                    >
                        <Icon name="close" onClick={this.toggleModal} />
                        <Header icon='users' content='User creation' />
                        <Modal.Content>
                            <Form>
                            { inputs.map(input => (
                                <Form.Input 
                                    key={input.label}
                                    placeholder={input.label}
                                    onChange={this.updateValue}
                                    fluid
                                    label={input.label}
                                    value={this.state[input.name] || ''}
                                    name={input.name}
                                    type={input.type}
                                />
                            ))}
                            <Form.Dropdown 
                                placeholder='Roles' 
                                label='Roles' 
                                fluid 
                                multiple 
                                selection 
                                name='roles'
                                value={this.state.roles || []}
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
                                content="Create"
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