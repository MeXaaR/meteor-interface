import React                from 'react'
import {
  Loader,
  Dimmer
} from "semantic-ui-react";
import { Spring } from 'react-spring';


const LoadingComponent = ({ message }) =>
<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
  {styles => 
    <Dimmer active style={styles}>
      <Loader content={ message || "Loading in progress"}/>
    </Dimmer> }
</Spring>;

export default LoadingComponent
