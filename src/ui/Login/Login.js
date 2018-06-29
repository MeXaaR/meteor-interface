import React, { Component } from 'react';
import styled from 'styled-components';

import { Form, Button, Segment, Grid, Header, Image } from 'semantic-ui-react';
import { Spring } from 'react-spring';

class Login extends Component {
    state = {
        username: '',
        password: '',
        errorusername: false,
        errorPassword: false,
    };
    
    updateValue = (event, { name, value }) =>  this.setState({ [name]: value });
    
    handleFormSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        
        const { username, password } = this.state;
        if (username === '') {
            notify.error("You didn't provide an email or username");
            this.setState({ errorusername: true });
        } else {
            this.setState({ errorusername: false });
        }
        
        if (password === '') {
            notify.error("There's not password");
            this.setState({ errorPassword: true });
        } else {
            this.setState({ errorPassword: false });
        }
        
        if (username === '' || password === '') { return; }
        
        Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
                notify.error(error.reason)
            }
        });
    };
    
    
    render() {
        const { username, password, errorusername, errorPassword } = this.state
        const { config = {} } = this.props;
        console.log(config)
        return (
            <Formcontainer>
           
                <Grid stackable stretched centered >
                    <Grid.Column width={16}>

                        <Spring from={{ opacity: 0, transform: 'scale(0.5)' }} to={{ opacity: 1, transform: 'scale(1)' }}>
                        { styles => (
                            <Header 
                                as='h1' 
                                icon 
                                style={{ 
                                    ...styles, 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingTop: 50
                                }} 
                                textAlign='center'
                            >
                                <Image src="https://goo.gl/WQahB9" />
                                Welcome on Interface
                                <Header.Subheader>Please Login</Header.Subheader>
                            </Header>
                        )}
                        </Spring>
                    </Grid.Column>

                    <Grid.Column computer={4} tablet={8} desktop={16}>
                    <Spring from={{ opacity: 0, transform: 'scale(0.5)' }} to={{ opacity: 1, transform: 'scale(1)' }}>
                       {styles => 
                         <Segment.Group style={styles} raised>
                            <Segment>
                                <Header as='h1' content='Hello.' />
                            </Segment>
                            <Segment>
                                <Form onSubmit={this.handleFormSubmit} >
                                    <Form.Input
                                        name="username"
                                        fluid
                                        placeholder="Email or username"
                                        type="text"
                                        icon="user"
                                        onChange={this.updateValue}
                                        error={errorusername}
                                        value={username}
                                    />
                                    <Form.Input
                                        name="password"
                                        fluid
                                        placeholder="Password"
                                        type="password"
                                        icon="lock"
                                        onChange={this.updateValue}
                                        error={errorPassword}
                                        value={password}
                                    />
                                </Form>
                            </Segment>
                            <Segment>
                            <Button 
                                color="blue"
                                onClick={this.handleFormSubmit}
                                icon="sign in"
                                labelPosition="left"
                                content="Login"
                            />
                            </Segment>
                        </Segment.Group>}
                        </Spring>
                    </Grid.Column>
                </Grid>
            </Formcontainer>
        );
    }
} 

export default Login;

const Formcontainer = styled.main`
    height: 100vh;
   background-color: #EFF0F4 !important;
    .ui.segments {
        transform: translateY(50%);
        border-radius: 0px !important;
    }
    .ui.segments::before,
    .ui.segments::after {
        content: '';
        position: absolute;
        z-index: -1;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background: inherit;
        box-shadow: inherit;
        transform: rotate(2deg);
        background-color: white;
    }

    .ui.segments::after 
    { transform: rotate(-1deg) } 
`;