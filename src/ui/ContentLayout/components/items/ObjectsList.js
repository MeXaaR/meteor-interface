import React, { Component } from 'react';
import { Segment, Label, Message, Header, Icon } from 'semantic-ui-react';
import WidgetSelector from '../WidgetFormSelector';
import { Transition, animated } from 'react-spring'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';


const ObjectsList = ({ item, field, incrementeList, decrementeList, ready, objectId, updateListOrder }) => {
    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newArray = arrayMove(item[field.name], oldIndex, newIndex)
        updateListOrder({}, newArray)
    };
    return (
        <Segment key={objectId} >
            <Label as='a' color='green' ribbon size="small">
                {field.name}
            </Label>
            <WrappedContainer
                field={field}
                objectId={objectId}
                ready={ready}
                item={item}
                useDragHandle={true}
                onSortEnd={onSortEnd}
                decrementeList={decrementeList}
            />
            <a className="incrementation" onClick={incrementeList}>Add entry</a>
        </Segment>
    )
}

export default ObjectsList

const WrappedContainer = SortableContainer(({ item, field, decrementeList, ready, objectId }) => (
    <div>
        {item[field.name] ? item[field.name].map((object, i) => (
            <WrappedSingleObject
                item={item}
                index={i}
                key={objectId + i}
                field={field}
                object={object}
                i={i}
                objectId={objectId}
                ready={ready}
                decrementeList={decrementeList}
            />
        )) : null}
    </div>
))


const DragHandle = SortableHandle(() => <Icon name="content" style={{ cursor: "-webkit-grab" }} />);

const WrappedSingleObject = SortableElement((props) => <SingleObject {...props} />)

class SingleObject extends Component {
    state = {
        open: false
    }

    toggleOpen = () => this.setState({ open: !this.state.open })

    render() {
        const { item, field, decrementeList, ready, objectId, i, object } = this.props;
        const { open } = this.state;

        return (
            <Message key={objectId + i} style={{ overflow: 'hidden' }}  >
                <div style={{
                    display: "flex",
                    alignItems: "center",
                }} >
                    <DragHandle />
                    <Header as='h4'>
                        <Icon name={`caret ${open ? 'down' : 'right'}`} size='small' onClick={this.toggleOpen} />
                        <Header.Content >
                            <span>{field.name} n°{i + 1}: {item[field.name][i][field.fields[0].name]} </span>
                        </Header.Content>
                    </Header>
                </div>

                <Transition native from={{ opacity: 0, height: 0 }} enter={{ opacity: 1, height: open ? 'auto' : 0 }} leave={{ opacity: 0, height: 0 }}>
                    {open ? styles =>
                        <animated.div style={styles}>
                            <WidgetSelector
                                collection2={field}
                                item2={object}
                                nested={true}
                                i2={i}
                                parent={item[field.name]}
                                ready={ready}
                            />
                        </animated.div> : null}
                </Transition>

                <a style={open ? null : { float: 'right', marginTop: -10 }} className="decrementation" onClick={(e) => decrementeList(e, i)}>Remove</a>
            </Message>
        )
    }
}