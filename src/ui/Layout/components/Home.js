import React from 'react';
import { Spring } from 'react-spring';

// Packages
import { 
    Message,
    Header,
    Image,
    Grid,
    Container
} from 'semantic-ui-react';
import styled from 'styled-components';

const list = [
    'Create, view and edit your database',
    'Manage you media drive hosted by Amazon S3',
    'Create account for your collaborators',
    'Decide who can see or edit what',
  ]

const header = 'Your content management system';
const content = `Here will be a few others features. At the moment, you can do these actions:`;



const Home = ({ config = {} }) => (
    <HomeStyle>
        <Container>
            <Spring from={{ opacity: 0, transform: 'scale(0.5)' }} to={{ opacity: 1, transform: 'scale(1)' }}>
            { styles => (
                <Header 
                    as='h1' 
                    icon 
                    style={{ 
                        ...styles, 
                        marginBottom: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }} 
                    textAlign='center'
                >
                    <Image src={config.logo} />
                    Welcome on Interface
                    <Header.Subheader>Manage your content, media and database.</Header.Subheader>
                </Header>
            )}
            </Spring>
            <Grid centered stackable>
                <Grid.Column width={10}>
                <Spring from={{ opacity: 0, transform: 'scale(0.5)' }} to={{ opacity: 1, transform: 'scale(1)' }}>
                { styles => (
                        <Message style={styles} size="large">
                            <Message.Header as={Header} dividing color="green">{header}</Message.Header>
                            <p>{content}</p>
                            <Message.List>
                                { list.map(item => <Message.Item key={item}>{item}</Message.Item>)}
                            </Message.List>
                        </Message>
                    )}
                    </Spring>
                </Grid.Column>
            </Grid>
        </Container>
    </HomeStyle>
)

export default Home

const HomeStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`