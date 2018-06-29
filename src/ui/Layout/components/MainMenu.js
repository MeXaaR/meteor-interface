import React, { Component, Fragment }            from 'react';
import { Menu, Container, Sidebar, Button, Divider } from 'semantic-ui-react';
import styled                   from 'styled-components';

class SideBarWrapper extends Component {
    state = { visible: false }
  
    handleButtonClick = () => this.setState({ visible: !this.state.visible })
  
    handleSidebarHide = () => this.setState({ visible: false })
  
    render() {
      const { visible } = this.state
      const { children } = this.props
      const isMobile = window.innerWidth < 768

      if(!isMobile){
          return (
              <Fragment>
                <MenuStyle isMobile={isMobile}>
                    <Menu
                        pointing 
                        secondary 
                        fixed="top"
                        className="mainMenu"
                        color="green"
                    >
                    <Container>
                        <MainMenu { ...this.props } isMobile={isMobile} close={this.handleSidebarHide} />
                    </Container>
                    
                    </Menu>
                </MenuStyle>
                {children}
            </Fragment>
          ) 
      }
  
      return (
        <MenuStyle>
            {!visible &&
                <Button 
                onClick={this.handleButtonClick}
                icon='content'
                color="green"
                circular
                className="mobileButton"
            />}
  
          <Sidebar.Pushable >
            <Sidebar
              as={Menu}
              animation='overlay'
              inverted
              className="mainMenu mobile"
              vertical
              visible={visible}
              color="green"
              borderless
            >
            <MainMenu { ...this.props } isMobile={isMobile} close={this.handleSidebarHide} />
            </Sidebar>
  
            <Sidebar.Pusher dimmed={visible} onClick={visible ? this.handleSidebarHide : null} >
              { children }
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </MenuStyle>
      )
    }
  }

const MainMenu = ({ location, history, permissions, root, config, close, isMobile }) => (
    
            <Fragment>
                {!isMobile && 
                    <Menu.Item 
                    name='website' 
                    onClick={() =>{ close(); history.push('/')}}
                />}
                <Menu.Item 
                    name='home' 
                    active={location.pathname === root} 
                    onClick={() =>{ close(); history.push(root)}}
                />
                <Menu.Item 
                    name='content' 
                    active={location.pathname.indexOf(`${root}/collections`) > -1} 
                    onClick={() =>{ close(); history.push(`${root}/collections`)}} 
                />
                <Menu.Item 
                    name='media'
                    active={location.pathname.indexOf(`${root}/media`) > -1} 
                    onClick={() =>{ close(); history.push(`${root}/media`)}} 
                />
                {permissions[config.roles[0]] &&
                    <Menu.Item 
                        name='settings'
                        active={location.pathname.indexOf(`${root}/settings`) > -1} 
                        onClick={() =>{ close(); history.push(`${root}/settings`)}} 
                    />}
                <Menu.Item 
                    name='profile' 
                    active={location.pathname.indexOf(`${root}/profile`) > -1} 
                    onClick={() =>{ close(); history.push(`${root}/profile`)}} 
                    position='right'
                />
                {isMobile && 
                    <Fragment>
                        <Divider/>
                        <Menu.Item 
                            name='website' 
                            onClick={() =>{ close(); history.push('/')}}
                        />
                    </Fragment>
            }
            </Fragment>
)

export default SideBarWrapper

const MenuStyle = styled.div`
${({ isMobile }) => isMobile ? 'min-height: 100vh;' : ''}
.mainMenu:not(.mobile) {
    background-color: #EFF0F4!important;
}
.mainMenu.mobile {
    z-index: 4;
    .item {
        text-transform: uppercase;
    }
}
.pushable {
    min-height: 100vh !important;
    >.pusher {
        min-height: 100vh !important;
    }
}
.mobileButton {
    position: fixed;
    left: 5px;
    z-index: 1;
    top: 5px;
}
`
