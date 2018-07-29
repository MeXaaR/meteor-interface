import React, { Component } from 'react';
import styled from 'styled-components';
import {
    Header,
    Transition,
    Icon
} from 'semantic-ui-react';

class SingleToast extends Component {
  state = {
    mounted: false,
    complete: false,
  }

  componentDidMount() {
    this.uploadSimple();
  }

  toBase64 = (image, extension) => {

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = function(e) {
        resolve(
          reader.result.replace(`data:image/${extension};base64`, '')
        )
      }
      reader.onerror = function(error){
        reject(error)
      }
      reader.readAsDataURL(image)
    })
  }

  getExtension = (type) => type.split('/')[1]

  async uploadSimple() {
    try {
      const { command = {}, index } = this.props;
      const { file, path, successCallback } = command
      const uploadVar = new ReactiveVar()
      this.setState({ mounted: true });

      const base64 = await this.toBase64(file, this.getExtension(file.type))

      const self = this;

      Meteor.call('interface.media.upload.object', { file: base64, path, mimeType: file.type, name: file.name }, function(error, result){
        if(error){
          self.setState({ error: error.message });
          self.setState({ complete: false })
        } else {
          const { err, link } = result
          if(err){
              self.setState({ error: err.message || "There has been an error !!" })
              successCallback()
          } else {
              self.setState({ complete: true })
              successCallback()
          }
        }
      })
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  closeToast = () => {
    this.setState({ mounted: false });
    setTimeout(() => {
      this.props.removeToast(this.props.index);
    }, 2000);
  }

  render() {
    const { mounted, progress, complete, error } = this.state;
    const { command = {}, removeToast, index, config = {} } = this.props;

    return (
      <Transition
        duration={700}
        animation="fly left"
        visible={mounted}
      >
        <ToastWrapper onClick={error || complete ? this.closeToast : null}>
          <Header as={error ? 'h4' : 'h3'} color={error ? 'red' : complete ? 'green' : 'black'} >
            <Icon name={complete ? 'check' : error ? 'warning circle' : 'upload'} color={complete ? 'green' : error ? 'red' : 'black'} />
            <Header.Content>
              {error || command.name}
              <Header.Subheader>
                { error && !complete && 'Error while uploading your file' }
                { complete && !error && 'File(s) uploaded with success !' }
                { !error && !complete && `Upload in progress... ` }
              </Header.Subheader>
            </Header.Content>
          </Header>
        </ToastWrapper>
      </Transition>
    );
  }
}

export default SingleToast;


const ToastWrapper = styled.div`
    position: relative;
    min-height: 48px;
    margin-bottom: 1rem;
    padding: 10px;
    border-radius: 1px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, .1), 0 2px 15px 0 rgba(0, 0, 0, .05);
    display: flex;
    justify-content: space-between;
    max-height: 800px;
    overflow: hidden;
    font-family: sans-serif;
    cursor: pointer;
    background: #fff;
    margin-top: 10px;
`;

