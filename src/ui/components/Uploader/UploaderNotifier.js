import React, { Component } from 'react';
import styled               from 'styled-components';
import SingleToast          from './SingleToast';


let _instance = null;

export const upload = (arg) =>  {
  _instance.upload(arg);
};

class UploaderComponent extends Component {
  constructor(props) {
    super(props);
    _instance = this;
    this.state = {
      list: [],
    };
  }

  upload = (arg) => {
    const { list = [] } = this.state;
    list.push(arg);
    this.setState({ list });
  }

  handleRemove = (index) => {
    const { list = [] } = this.state;
    list.splice(index, 1);
    this.setState({ list });
  }


  render() {
    const { list = [] } = this.state;
    return (
      <ToastContainerWrapper>
        {
          list.map((command, i) => (
            <SingleToast
              command={command}
              index={i}
              key={i}
              removeToast={this.handleRemove}
            />
          ))
        }
      </ToastContainerWrapper>
    );
  }
}


export default UploaderComponent;


const ToastContainerWrapper = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 10000;
`;

