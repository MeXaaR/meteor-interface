import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from 'semantic-ui-react';

export default class ConfirmationButton extends Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
        times: PropTypes.number
    };

    static defaultProps = {
        times: 3
    };

    state = {
        timesPressed: 0,
        timer: -1
    };

    componentDidMount = () => {
        if (this.props.started) {
            this.onPress()
        }
    }

    onPress = () => {
        let { timesPressed, timer } = this.state;
        const { action, times } = this.props;
        timesPressed++
        this.setState({ timesPressed, timer: 3 },
            () => {
                if (this.state.timesPressed === times) {
                    action();
                    this.setState({ timesPressed: 0 });
                } else {
                    this.startInterval(timesPressed)
                }
            }
        );
    }

    startInterval = (timesPressed, timer = 3) => {
        setTimeout(() => {
            if (timesPressed === this.state.timesPressed && this.state.timer !== 0) {
                this.setState({
                    timer: timer - 1
                }, () => this.startInterval(timesPressed, timer - 1));
            } else if (this.state.timer === 0) {
                this.setState({ timesPressed: 0, timer: -1 });
                if (this.props.onCancel) {
                    this.props.onCancel()
                }
            }
        }, 1000)
    }


    render() {
        const { timesPressed, timer } = this.state;
        const { dialog, type, colors, disabled, loading } = this.props;
        const colorsData = colors ? colors : colorsDefault[type]
        return (
            <ButtonWrapped
                level={timesPressed}
                onClick={this.onPress}
                label={timer !== -1 && !loading ? timer : null}
                icon={type}
                loading={loading}
                disabled={disabled}
                className='mini'
                color={colorsData[timesPressed]}
                labelPosition="left"
                content={dialog[timesPressed]}
            />
        );
    }
}

const colorsDefault = {
    trash: ['grey', 'orange', 'red'],
    save: ['green', 'green'],
}

const ButtonWrapped = styled(Button)`
  background: #e54b4b;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 2rem;
  margin-top: 1rem;
  text-transform: uppercase !important;
  font-weight: 900;

`;
