import React, { Component, Fragment } from 'react';

// Packages
import { 
    Header,
    Button,
    Modal,
    Icon,
    Input,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import ErrorHandler from '../../../utils/ErrorHandler'

class FolderCreator extends Component {
    state = {
        changes: false,
        loaded: false,
        path: '/',
        route: '/',
        error: null,
        name: ''
    }

    createFolder = () => {
        const { name } = this.state;
        const { refresh, route } = this.props;
        const method = 'interface.media.create.directory';
        this.setState({ loading: true })
        const self = this
        Meteor.call(method, { name: route + name }, function(error, result = {} ){
            self.setState({ loading: false })
            if(result){
                const { err, link } = result
                console.log(result)
                if(err){
                    self.setState({ error: err })
                    self.toggleModal()
                    refresh()
                } else {
                    notify.success("Folder created")
                    self.toggleModal()
                    refresh()
                }
            } else if (error){
                notify.error(error.reason)
            }
        })
    }

    toggleModal = () => this.setState({ open: !this.state.open });
    updateName = (e, { value }) => this.setState({ name: value });


    render(){
        const { isMobile } = this.props
        const { loading, open, name, error } = this.state;

        if(error){
            throw new Error(error.message)
        }

        return(
            <Fragment>
                <Button
                    content="New Folder"
                    icon="folder"
                    size='mini'
                    color="blue"
                    fluid={isMobile}
                    labelPosition="left"
                    onClick={this.toggleModal}
                />
                <Modal 
                    size='small'
                    open={open} 
                >
                    <Icon name="close" onClick={this.toggleModal} />
                    <Header icon='folder' content='Folder creation' />
                    <Modal.Content>
                        <Input 
                            placeholder="Name the new folder"
                            onChange={this.updateName}
                            fluid
                            value={name}
                        />

                    </Modal.Content>
                    <Modal.Actions>
                        <Button 
                            color="red"
                            content="Cancel"
                            loading={loading}
                            onClick={this.toggleModal}
                        />
                        <Button 
                            color="blue"
                            content="Create"
                            loading={loading}
                            onClick={this.createFolder}
                        />
                    </Modal.Actions>

                </Modal>
            </Fragment>
        )
    }
}

export default ErrorHandler(FolderCreator)



const FolderCreatorStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }
`