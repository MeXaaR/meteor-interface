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
import ContentLeftMenu from './components/ContentLeftMenu';
import DynamicImporter from "../../utils/DynamicImporter";
import ConditionnalRoute from "../../utils/ConditionnalRoute";

// Pages 
const ContentHome = DynamicImporter(() => import('./pages/ContentHome'))
const ContentBalancer = DynamicImporter(() => import('./pages/ContentBalancer'))
const ContentView = DynamicImporter(() => import('./pages/ContentView'))
const ContentEdit = DynamicImporter(() => import('./pages/ContentEdit'))

const ContentLayout = ({ location, history, config, root }) => (
    <ContentLayoutStyle>
        <Container>
            <Grid centered stackable>
                <Grid.Column width={4}>
                    <ContentLeftMenu 
                        location={location}
                        history={history}
                        config={config}
                        root={root}
                    />
                </Grid.Column>
                <Grid.Column width={12}>
                    <Switch>

                    <ConditionnalRoute
                            exact
                            path={`${root}/collections`}
                            Element={ContentHome}  
                            computedProps={{ config, root }}  
                        />
                        <ConditionnalRoute
                            exact
                            path={`${root}/collections/:collectionSlug`}
                            Element={ContentBalancer}  
                            computedProps={{ config, root }}  
                        />
                        <ConditionnalRoute
                            exact
                            path={`${root}/collections/:collectionSlug/new`}
                            Element={ContentEdit}  
                            computedProps={{ config, root }}  
                        />
                        <ConditionnalRoute
                            exact
                            path={`${root}/collections/:collectionSlug/:itemId`}
                            Element={ContentView}  
                            computedProps={{ config, root }}  
                        />
                        <ConditionnalRoute
                            exact
                            path={`${root}/collections/:collectionSlug/:itemId/edit`}
                            Element={ContentEdit}  
                            computedProps={{ config, root }}  
                        />

                    </Switch>
                </Grid.Column>
            </Grid>
        </Container>            
    </ContentLayoutStyle>
)

export default ContentLayout

const ContentLayoutStyle = styled.div`
  
`