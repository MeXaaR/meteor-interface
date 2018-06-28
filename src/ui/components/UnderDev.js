import React from 'react';
import { Container, Image } from 'semantic-ui-react';
import { Spring } from 'react-spring';

const UnderDev = ({ config }) => (
    <Container>
        <Spring 
            from={{ opacity: 0, marginTop: 600 }} 
            to={{ opacity: 1, marginTop: 0 }} 
        >
        { styles => <Image style={styles} src="https://goo.gl/WQahB9" centered /> }
        </Spring>
    </Container>
)

export default UnderDev