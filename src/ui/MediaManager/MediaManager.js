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
import MediaBrowser     from './components/MediaBrowser';

const MediaManager = (props) => (
        <MediaManagerStyle>
            <Container>
                <Grid centered stackable>
                    <Grid.Column width={16}>
                        <MediaBrowser {...props} />
                    </Grid.Column> 
                </Grid>
            </Container>            
        </MediaManagerStyle>
)

export default MediaManager

const MediaManagerStyle = styled.div`
  
`