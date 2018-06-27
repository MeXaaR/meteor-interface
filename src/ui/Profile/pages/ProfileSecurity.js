import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { Transition, Spring } from 'react-spring';

// Packages
import { 
    Segment,
    Header,
    Button,
    Divider,
    Message,
    Form,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import Confirmation from '../../components/Confirmation'

// Collection
import ErrorHandler from '../../../utils/ErrorHandler';

class ProfileSecurity extends Component {
    state = {
        changes: false,
        loaded: false,
        edition: false,
        itemState: {},
        confirmation: false,
        confirmationObject: {}
    }
    
    componentDidMount(){

        this.setState({ 
            username: Meteor.user().username,
            email: Meteor.user().emails[0].address
        })
    }

    toggleEdition = () => this.setState({ 
        edition: !this.state.edition,
        username: Meteor.user().username,
        email: Meteor.user().emails[0].address
    })
    
    updateValue = (e, { name, value }) => this.setState({ [name]: value, changes: true })

    save = () => {
        const { checkPassword, newPassword, oldPassword } = this.state;

        const method = 'interface.users.update.password';
        if(checkPassword !== newPassword){
            notify.error("Your passwords don't match");
        } else {
            this.setState({ confirmation: false, loading: true });
            const self = this;
    
            Accounts.changePassword(oldPassword, newPassword, function(error){
                if(!error){
                    self.setState({ loading: false, edition: false, changes: false })
                    notify.success('Changes saved')
                } else if (error){
                    self.setState({ loading: false })
                    notify.error(error.reason)
                }
            })
        }
    }

    toggleConfirmationSave = (e) => {
        e.preventDefault();
        const confirmationObject = {
          title: 'Save and publish your information',
          text: 'You are about to save your modification and use it immediatly',
          cancel: () => this.setState({ confirmation: !this.state.confirmation }),
          confirm: this.save,
        };
        this.setState({ confirmation: !this.state.confirmation, confirmationObject });
    }

    render(){
        const { changes, confirmationObject, confirmation, loading, edition } = this.state;
        return(
            <ProfileSecurityStyle>
            <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
            { styles => 
                <Segment style={{...styles, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Header content='Your security information' as="h5" />
                    <div>
                        <Button
                            content={ edition ? "CANCEL": "EDIT" }
                            size="mini"
                            icon={ edition ? "remove" : "edit" }
                            onClick={this.toggleEdition}
                            color={ edition ? "red" : "blue"}
                            labelPosition="left"
                        />
                        { edition &&
                            <Button
                                content={ changes === false ? "SAVED" : "SAVE"}
                                size="mini"
                                icon="save"
                                onClick={ changes === false ? null : this.toggleConfirmationSave}
                                color={ changes === false ? "grey" : "green"}
                                labelPosition="left"
                            />
                        }
                        </div>

                </Segment> }
            </Spring>
            {edition ?
            <Spring from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
            { styles => 
                <Segment style={styles} color="green">
                    <Form loading={loading}>
                        <Form.Input
                            type="password"
                            name='oldPassword'
                            label='Type your old password'
                            placeholder='Type your old password'
                            key='oldPassword'
                            value={this.state.oldPassword}
                            onChange={this.updateValue}
                            fluid
                        />
                        <Divider />
                        <Form.Input
                            type="password"
                            name='newPassword'
                            label='Type your new password'
                            placeholder='Type your new password'
                            key='newPassword'
                            value={this.state.newPassword}
                            onChange={this.updateValue}
                            fluid
                        />
                        <Form.Input
                            type="password"
                            name='checkPassword'
                            label='Type it again'
                            placeholder='Type it again'
                            key='checkPassword'
                            value={this.state.checkPassword}
                            onChange={this.updateValue}
                            fluid
                        />
                    </Form>
                </Segment>
            }
            </Spring>
            :
            <Spring from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
            { styles => 
                <Segment style={styles} color="green">
                    <Message
                        header='Security'
                        icon="lock"
                        content="Here you can change your password"
                    />
                </Segment>
            }
            </Spring>
            }
            <Confirmation
                confirmation={confirmation}
                loading={loading}
                confirmationObject={confirmationObject}
            />
    </ProfileSecurityStyle>
        )
    }
}




export default ErrorHandler(ProfileSecurity);




const ProfileSecurityStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`