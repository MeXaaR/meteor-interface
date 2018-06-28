import React from 'react';

// Packages
import { 
    Segment,
    List,
    Label,
    Image,
    Message,
    Icon,
} from 'semantic-ui-react';


const WidgetSelector = ({ item = {}, collection = {}, ready }) => {
    if(!ready){
        return null
    }

    const list = collection.fields ? collection.fields.map(field => {
        let widget = null
        switch (field.widget){
            case 'string':
                widget = <div>{item[field.name]}</div>
                break
            case 'multiline':
            widget = <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: item[field.name] }} />
            break
            case 'html':
                widget = <div dangerouslySetInnerHTML={{ __html: item[field.name] }} />
                break
            case 'date':
                widget = <div>{(item[field.name] || '').toString()}</div>
                break
            case 'image':
                widget = <Image size="small" centered rounded src={item[field.name]} />
                break
            case 'boolean':
                widget = <Icon size="huge" color={item[field.name] ? 'green' : 'red' } name={item[field.name] ? 'check' : 'remove' } />
                break
            case 'list':
                if(field.fields && field.fields.length){
                    widget = item[field.name] ? item[field.name].map((mark, i) => (
                            <Message key={i}>
                                <Segment.Group>
                                    <WidgetSelector 
                                        collection={field}
                                        item={mark}
                                        ready={ready}
                                    />
                                </Segment.Group>
                            </Message>
                        )) : null

                } else if (item[field.name] && item[field.name].length && typeof item[field.name][0] === 'string') {
                    widget = (
                        <List bulleted>
                            { item[field.name].map((mark,i) => <List.Item key={i}>{mark}</List.Item>)}
                        </List>
                    )
                }
                break
        }
        return (
            <Segment key={field.name} >
                <Label as='a' color='green' ribbon size="small">
                {field.label}
                </Label>
                {widget}
            </Segment>
        )
    }) : null

    return list
} 


export default WidgetSelector;
