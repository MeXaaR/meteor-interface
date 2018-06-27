import React, { createContext } from 'react';

export const WidgetSelectorContext = createContext();

export const WidgetFormProvider = (ComponentToWrap) => props => (
    <WidgetSelectorContext.Provider>
        {<ComponentToWrap {...props}/>}
    </WidgetSelectorContext.Provider>
);

export const WidgetFormConsumer = (ComponentToWrap) => props => (
    <WidgetSelectorContext.Consumer>
        {context => <ComponentToWrap context={context} {...props}/>}
    </WidgetSelectorContext.Consumer>
);

