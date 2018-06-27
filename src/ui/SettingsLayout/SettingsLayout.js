import React from 'react';

// Packages
import { 
    Menu, 
    Container,
    Divider,
    Rail,
    Grid,
    Input
} from 'semantic-ui-react';
import { Switch, Route } from "react-router-dom";
import styled from 'styled-components';


// Components
import SettingsLeftMenu from './components/SettingsLeftMenu';
import DynamicImporter from "../../utils/DynamicImporter";
import UnderDev        from '../components/UnderDev'
import ConditionnalRoute from "../../utils/ConditionnalRoute";

// Pages 
const SettingsKeys = DynamicImporter(() => import('./pages/SettingsKeys'))
const SettingsUsers = DynamicImporter(() => import('./pages/SettingsUsers'))
const SettingsHome = DynamicImporter(() => import('./pages/SettingsHome'))

const SettingsLayout = ({ location, history, root, config }) => (
    <SettingsLayoutStyle>
        <Container>
        <Grid centered stackable>
            <Grid.Column width={4}>
                <SettingsLeftMenu 
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
                        path={`${root}/settings`}
                        Element={SettingsHome}  
                        computedProps={{ root, config }}  
                    />
                    <ConditionnalRoute
                        exact
                        path={`${root}/settings/users`}
                        Element={SettingsUsers}  
                        computedProps={{ root, config }}  
                    />
                    <ConditionnalRoute
                        exact
                        path={`${root}/settings/keys`}
                        Element={SettingsKeys}  
                        computedProps={{ root, config }}  
                    />
                </Switch>
            </Grid.Column>
            </Grid>
        </Container>            
    </SettingsLayoutStyle>
)

export default SettingsLayout

const SettingsLayoutStyle = styled.div`
  
`