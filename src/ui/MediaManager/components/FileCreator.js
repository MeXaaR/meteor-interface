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
import { upload } from '../../components/Uploader/UploaderNotifier'

class FolderCreator extends Component {
    state = {
        loading: false,
        file: ''
    }

    createFile = () => {
        const { file } = this.state;
        const { refresh, route, loading } = this.props;
        console.log(this.props)
        this.toggleModal()
        upload({
            file,
            path: route,
            successCallback: () => refresh(route),
          });
    }

    toggleModal = () => this.setState({ open: !this.state.open });
    updateFile = (e) => {
        const file = e.target.files[0];
        this.setState({ file });
      }


    render(){
        const { loading, open, name, error } = this.state;

        if(error){
            throw new Error(error.message)
        }

        return(
            <Fragment>
                <Button
                    content="New File"
                    icon="file"
                    size='mini'
                    color="blue"
                    labelPosition="left"
                    onClick={this.toggleModal}
                />
                <Modal 
                    size='small'
                    open={open} 
                >
                    <Icon name="close" onClick={this.toggleModal} />
                    <Header icon='folder' content='File uploading' />
                    <Modal.Content>
                        <Input 
                            placeholder="Select the new file"
                            onChange={this.updateFile}
                            fluid
                            type="file"
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
                            content="Upload"
                            loading={loading}
                            onClick={this.createFile}
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