import React, { Component, Fragment } from 'react'
import { Segment, Button, Header } from 'semantic-ui-react';

const ErrorHandlerWrapper = (WrappedComponent) => {
    return class ErrorHandler extends Component {
        state = {
            error: null,
            info: null,
            details: false
        }
    
        componentDidCatch(error, info) {     
            this.setState({ error, info });
        }

        details = () => this.setState({ details: true })
    
        render() {
            const { error, info, details } = this.state;
          
            if (error) {
                return (
                    <Segment>
                        <Header content="Oh-no! Something went wrong" as="h2" />
                        <Header color="red" content={error && error.toString()} as="h4" />

                        { details ?
                            <Fragment>
                                <div>Component Stack Error Details:</div>
                                <p className="red">{info.componentStack}</p>
                            </Fragment>
                        :
                            <Button size="tiny" color="blue" content="Check details" onClick={this.details} />
                        }
                    </Segment>
                )
            }
            return <WrappedComponent {...this.props} />
        }
    }
}
export default ErrorHandlerWrapper
