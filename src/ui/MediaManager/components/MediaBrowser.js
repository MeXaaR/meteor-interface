import React, { Component } from 'react';
import { Transition, Spring } from 'react-spring';
import { withTracker } from 'meteor/react-meteor-data';

// Packages
import { 
    Segment,
    Header,
    Button,
    Modal,
    List,
    Image,
    Icon,
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import Confirmation from '../../components/Confirmation';
import ErrorHandler from '../../../utils/ErrorHandler';
import FolderCreator from './FolderCreator';
import FileCreator from './FileCreator';

class MediaBrowser extends Component {
    state = {
        changes: false,
        loaded: false,
        path: '/',
        files: [],
        folders: [],
        route: '/',
        error: null,
        loading: false
    }

    componentDidMount(){
        this.goFolder()
    }

    goFolder = (file) => {
        const method = 'interface.media.list.directories';
        this.setState({ confirmation: false, loading: true })
        const self = this
        Meteor.call(method, { path: file }, function(error, result = {} ){
            self.setState({ loading: false })
            if(result){
                const { CommonPrefixes, Contents, Prefix, link, err } = result
                console.log(result)
                if(err){
                    self.setState({ error: err })
                } else {
                    self.setState({
                        folders: CommonPrefixes,
                        files: Contents,
                        route: Prefix,
                        link
                    })
                }
            } else if (error){
                notify.error(error.reason)
            }
        })
    }

    deleteObject = () => {
        const { objectToDelete, route } = this.state
        const method = 'interface.media.delete.object';
        this.setState({ confirmation: false, loading: true })
        const self = this
        Meteor.call(method, { file: objectToDelete }, function(error, result = {} ){
            self.setState({ loading: false })
            if(result){
               console.log(result)
               self.goFolder(route)
               self.closeConfirm()
            } else if (error){
                notify.error(error.reason)
                self.closeConfirm()
            }
        })
    }
    closeConfirm = () => this.setState({ confirmation: false})

    openConfirmDeletionObject = (object) => {
        this.setState({
            confirmation: true,
            objectToDelete: object,
            confirmationObject: {
                title: "Are you sure ?",
                text: `You're about to delete ${object.replace(this.state.route, '')}`,
                cancel: this.closeConfirm,
                confirm: this.deleteObject,
            }
        })
    }

    togglePictureModal = (object) => this.setState({ selectedPicture: object });


    render(){
        const { changes, loaded, confirmation, confirmationObject, loading, folders, files, route, link, error, selectedPicture } = this.state;
        const { interfaceSettings = {}, history, ready, selector, updatePicture, currentPicture, config } = this.props;
        
        if(error){
            throw new Error(error.message)
        }

        const refresh = () =>this.goFolder(route)
        const isAuthorized = Roles.userIsInRole(Meteor.userId(), config.media_roles);

        return(
            <MediaBrowserStyle>
                <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                { styles => 
                    <Segment style={{...styles, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Header content='Media Manager' as="h5" />
                        <div>
                            <Button
                                icon="refresh"
                                onClick={refresh}
                                color="teal"
                                size='mini'
                                labelPosition="left"
                                content="Refresh"
                            />
                            {isAuthorized && 
                                <FileCreator 
                                refresh={refresh}
                                route={route}
                            />}
                            {isAuthorized && 
                                <FolderCreator 
                                refresh={refresh}
                                route={route}
                            />}
                        </div>
                    </Segment> }
                </Spring>

                <Spring from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
                { styles => 
                    <Segment loading={loading} style={styles} color="green" className="browser-container">
                    <List divided relaxed size='huge'>
                    { route !== '' && 
                        <List.Item key={Random.id()}>
                            <Icon name="left arrow" color="green" />
                            <List.Content>
                                <List.Header onClick={() => this.goFolder('')} >Go Back</List.Header>
                            </List.Content>
                        </List.Item>
                    }
                    {
                        folders.map((folder, i) => {
                            const onClick = () => this.goFolder(folder.Prefix)
                            
                            return (
                                <List.Item key={Random.id()}>
                                    {isAuthorized &&
                                        <List.Content floated='right'>
                                        <Button 
                                            icon="trash" 
                                            circular 
                                            size="small"
                                            color="red" 
                                            onClick={() => this.openConfirmDeletionObject(folder.Prefix)} 
                                        />
                                    </List.Content>}
                                    <Icon name="folder" />
                                    <List.Content>
                                        <List.Header onClick={onClick} >{folder.Prefix.replace(route, '')}</List.Header>
                                    </List.Content>
                                </List.Item>
                            )
                        })
                    }
                    {
                        files.map((file, i) => {
                            const isImage = file.Key.match(/\.(jpeg|jpg|gif|png|svg)$/)
                            const isRoot = file.Key === route
                            const onClick = () => this.goFolder(folder.Prefix)

                            if(isRoot){
                                return null 
                            } else if(!isImage){
                                return(
                                    <List.Item key={Random.id()}>
                                    { isAuthorized && 
                                        <List.Content floated='right'>
                                        <Button 
                                            icon="trash" 
                                            circular 
                                            size="small"
                                            color="red" 
                                            onClick={() => this.openConfirmDeletionObject(file.Key)} 
                                        />
                                    </List.Content>}
                                        <Icon name="file" />
                                        <List.Content>
                                            <List.Header onClick={onClick} >{file.Key.replace(route, '')}</List.Header>
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                            return (
                                <List.Item key={Random.id()} className={currentPicture === link + file.Key ? "active-picture" : null }>
                                    { isAuthorized &&
                                        <List.Content floated='right'>
                                        <Button 
                                            icon="trash" 
                                            circular 
                                            size="small"
                                            color="red" 
                                            onClick={() => this.openConfirmDeletionObject(file.Key)} 
                                        />
                                    </List.Content>}
                                    <Image size="mini" src={link + file.Key} />
                                    <List.Content>
                                        <List.Header 
                                            onClick={
                                            selector ? 
                                            (e) => updatePicture(e, link + file.Key)
                                            :
                                            () => this.togglePictureModal(file)
                                        } 
                                        >
                                            {file.Key.replace(route, '')}
                                        </List.Header>
                                    </List.Content>
                                </List.Item>
                                )
                        })
                    }
                    </List>
    
                    </Segment>
                }
                </Spring>
                <Confirmation
                    confirmation={confirmation}
                    loading={loading}
                    confirmationObject={confirmationObject}
                />

                {!!selectedPicture && 
                        <PictureModal 
                            link={link + selectedPicture.Key}
                            togglePictureModal={this.togglePictureModal}
                            selectedPicture={selectedPicture}
                        /> 
                }
            </MediaBrowserStyle>
        )
    }
}
export default ErrorHandler(MediaBrowser)



const MediaBrowserStyle = styled.div`
    h5.header {
        letter-spacing:2px;
        margin-bottom: 0;
    }
    .button {
        transition: all 0.3s ease-in !important;
    }

    .browser-container {
        min-height: 200px;
        .item {
            transition: all 0.2s ease-in;
            cursor: pointer;
            &:hover {
                color: #21ba45 !important;
                text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);
            }
            .content {
            }
        }
        .active-picture {
            color: #21ba45 !important;
        }
    }
`

const PictureModal = ({ selectedPicture, link, togglePictureModal }) => (
    <Modal 
        size='small'
        open={!!selectedPicture} 
    >
        <Icon name="close" onClick={() => togglePictureModal()} />
        <Header icon='picture' content='Picture' />
        <Modal.Content 
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'column'
            }}
        >
        <Image size="big" src={link}  />

        </Modal.Content>
    </Modal>
)