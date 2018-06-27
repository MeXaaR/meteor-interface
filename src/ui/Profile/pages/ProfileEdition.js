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
    Message,
    Form,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import Confirmation from '../../components/Confirmation'

class ProfileEdition extends Component {
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
        const { email, username } = this.state;

        const method = 'interface.users.update.profile';
        this.setState({ confirmation: false, loading: true });
        const self = this;
        Meteor.call(method, { email, username }, function(error, result){
            if(result){
                self.setState({ loading: false, edition: false, changes: false })
                notify.success('Changes saved')
            } else if (error){
                self.setState({ loading: false })
                notify.error(error.reason)
            }
        })
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
            <ProfileEditionStyle>
            <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
            { styles => 
                <Segment style={{...styles, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Header content='Your profile information' as="h5" />
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
                            name='username'
                            label='Username'
                            placeholder='Username'
                            key='Username'
                            value={this.state.username}
                            onChange={this.updateValue}
                            fluid
                        />
                        <Form.Input
                            name='email'
                            label='Email'
                            placeholder='Email'
                            key='email'
                            value={this.state.email}
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
                        header='Your username'
                        icon="user"
                        content={this.state.username}
                    />
                    <Message
                        header='Your email address'
                        icon="mail"
                        content={this.state.email}
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
    </ProfileEditionStyle>
        )
    }
}




export default ProfileEdition;




const ProfileEditionStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`