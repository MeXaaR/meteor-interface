import React, { Component, Fragment } from 'react'
import MediaBrowser from './MediaBrowser';
import { Modal, Button, Header, Icon } from 'semantic-ui-react';

const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column'
}

class ModalImageSelector extends Component {
    state = {
        open: false,
    }
    toggleModal = () => this.setState({ open: !this.state.open })

    updatePicture = (e, link) => {
        this.props.selectPicture(e, {
            name: this.props.name,
            value: link
        })
        this.toggleModal()
        console.log(link)
    }

    render() {
        const { open } = this.state;
        const { selectPicture, link, currentPicture, config } = this.props;
        return (
            <Fragment>
                <Button
                    size='mini'
                    color="blue"
                    content="Choose a picture"
                    onClick={this.toggleModal}
                />
                <Modal
                    open={open}
                    size='large'
                >
                    <Header style={{ display: 'flex', justifyContent: "space-between" }} >
                        <span>
                            <Icon name="picture" />
                            Picture
                        </span>
                        <Button
                            icon="close"
                            onClick={this.toggleModal}
                            style={{
                                fontSize: 15,
                                height: 35,
                                width: 35,
                                padding: 5,
                            }}
                            color="green"
                            circular
                        />
                    </Header>
                    <Modal.Content>
                        <MediaBrowser
                            selector={true}
                            currentPicture={currentPicture}
                            updatePicture={this.updatePicture}
                            config={config}
                        />
                    </Modal.Content>

                </Modal>
            </Fragment>
        )
    }
}

export default ModalImageSelector

// <Modal.Actions>
//     <Button 
//         color="red"
//         size="mini"
//         fluid
//         style={{ width: "100%" }}
//         content="Delete picture"
//     />
// </Modal.Actions>