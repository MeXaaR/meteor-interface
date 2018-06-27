import React            from 'react';
import { Menu, Container } from 'semantic-ui-react';
import styled                   from 'styled-components';

const MainMenu = ({ location, history, permissions, root, config }) => (
    <MenuStyle>
        <Menu 
            pointing 
            secondary 
            fixed="top"
            color="green"
        >
            <Container>
                <Menu.Item 
                    name='website' 
                    onClick={() => history.push('/')}
                />
                <Menu.Item 
                    name='home' 
                    active={location.pathname === root} 
                    onClick={() => history.push(root)}
                />
                <Menu.Item 
                    name='content' 
                    active={location.pathname.indexOf(`${root}/collections`) > -1} 
                    onClick={() => history.push(`${root}/collections`)} 
                />
                <Menu.Item 
                    name='media'
                    active={location.pathname.indexOf(`${root}/media`) > -1} 
                    onClick={() => history.push(`${root}/media`)} 
                />
                {permissions[config.roles[0]] &&
                    <Menu.Item 
                        name='settings'
                        active={location.pathname.indexOf(`${root}/settings`) > -1} 
                        onClick={() => history.push(`${root}/settings`)} 
                    />}
                <Menu.Item 
                    name='profile' 
                    active={location.pathname.indexOf(`${root}/profile`) > -1} 
                    onClick={() => history.push(`${root}/profile`)} 
                    position='right'
                />
            </Container>
        </Menu>
    </MenuStyle>
)

export default MainMenu

const MenuStyle = styled.div`
.menu {
    background-color: #EFF0F4!important;
}
`
