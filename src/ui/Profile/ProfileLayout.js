import React from 'react';

// Packages
import { 
    Container,
    Grid,
} from 'semantic-ui-react';
import { Switch, Route } from "react-router-dom";
import styled from 'styled-components';

// Components
import ProfileLeftMenu from './components/ProfileLeftMenu';
import DynamicImporter from "../../utils/DynamicImporter";
import ConditionnalRoute from "../../utils/ConditionnalRoute";

// Pages 
const ProfileEdition = DynamicImporter(() => import('./pages/ProfileEdition'))
const ProfileSecurity = DynamicImporter(() => import('./pages/ProfileSecurity'))


// Global Config
import ErrorHandler from '../../utils/ErrorHandler';


const ProfileLayout = ({ location, history, root, config }) => (
    <ProfileLayoutStyle>
        <Container>
        <Grid centered stackable>
            <Grid.Column width={4}>
                <ProfileLeftMenu 
                    location={location}
                    history={history}
                    root={root}
                    config={config}
                />
            </Grid.Column>
            <Grid.Column width={12}>
                <Switch>
                    <ConditionnalRoute
                        exact
                        path={`${root}/profile`}
                        Element={ProfileEdition}  
                        computedProps={{ root, config }}  
                    />
                    <ConditionnalRoute
                        exact
                        path={`${root}/profile/security`}
                        Element={ProfileSecurity}  
                        computedProps={{ root, config }}  
                    />
                </Switch>
            </Grid.Column>
            </Grid>
        </Container>            
    </ProfileLayoutStyle>
)

export default ErrorHandler(ProfileLayout)

const ProfileLayoutStyle = styled.div`
  
`