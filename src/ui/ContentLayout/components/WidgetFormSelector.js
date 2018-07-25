import React, { Component } from 'react';

import DynamicImporter from "../../../utils/DynamicImporter";
import { WidgetFormConsumer } from '../../../utils/contexts/WidgetFormContext'

import DateTimePicker from 'react-datetime-picker';
const TinyMCE = DynamicImporter(() => import('react-tinymce'));

// Packages
import {
    Segment,
    Label,
    Form,
    Button,
    Checkbox,
    Image,
    Message,
} from 'semantic-ui-react';
import ModalImageSelector from '../../MediaManager/components/ModalImageSelector';
import ErrorHandler from '../../../utils/ErrorHandler';
import ObjectsList from './items/ObjectsList'

const tinyConfig = {
    height: 300,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor textcolor colorpicker',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code emoticons',
    ],
    toolbar: 'undo redo | insert | fontsizeselect | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | forecolor backcolor emoticons | image',
};


const WidgetSelector = WidgetFormConsumer((props) => {
    let { collection, collection2, item2 } = props
    if (item2 && collection2) {
        collection = collection2
        item = item2
    }
    return collection.fields.map((field, i) => <SingleWidget key={i} field={field} {...props} />)
})

class SingleWidget extends Component {

    state = {
        id: Random.id()
    }

    updateNestedValue = (e, { name, value, checked }) => {
        const { index, collection2, item2, parent, context = {}, field } = this.props
        let { updateValue, item, collection, ready } = context;
        if (item2 && collection2) {
            collection = collection2
            item = item2
        }
        parent[index][name] = typeof checked === "undefined" ? value || '' : checked
        updateValue(e, {
            name: collection.name,
            value: parent,
        })
    }

    updateNormalValue = (e, { name, value, checked }) => {
        const { context = {}, field } = this.props
        let { updateValue } = context;
        updateValue(e, { name, value, checked })
    }

    updateListOrder = (e, newArray) => {
        const { nested, index, parent, context = {}, field } = this.props
        let { updateValue, item, collection } = context;
        if (nested) {
            parent[index][name] = newArray
            updateValue(e, {
                name: collection.name,
                value: parent,
            })
        } else {
            item[field.name] = newArray
            updateValue(e, { name: [field.name], value: item[field.name] })
        }
    }

    incrementeList = (e) => {
        const { nested, index, parent, context = {}, field } = this.props
        let { updateValue, item, collection } = context;
        if (nested) {
            parent[index][name] &&
                parent[index][name].length ?
                parent[index][name].push({})
                :
                parent[index][name] = [{}]

            updateValue(e, {
                name: collection.name,
                value: parent,
            })
        } else {
            item[field.name] &&
                item[field.name].length ?
                item[field.name].push({})
                :
                item[field.name] = [{}]

            updateValue(e, { name: [field.name], value: item[field.name] })
        }
    }

    decrementeList = (e, index) => {
        const { nested, collection2, item2, parent, context, field } = this.props;
        let { updateValue, item, collection } = context;
        if (nested) {
            parent[index][name].splice(index, 1)

            updateValue(e, {
                name: collection.name,
                value: parent,
            })
        } else {
            item[field.name].splice(index, 1)

            updateValue(e, { name: [field.name], value: item[field.name] })
        }
    }

    render() {
        const { id } = this.state
        const { nested, collection2, item2, context = {}, field } = this.props;
        let { item, ready } = context;

        if (item2 && collection2) {
            collection = collection2
            item = item2
        }

        switch (field.widget) {
            case 'number':
                return (
                    <Form.Input
                        value={item[field.name]}
                        label={field.label}
                        key={id}
                        type="number"
                        onChange={nested ? this.updateNestedValue : this.updateNormalValue}
                        name={field.name}
                    />
                )
            case 'string':
                return (
                    <Form.Input
                        value={item[field.name]}
                        label={field.label}
                        key={id}
                        onChange={nested ? this.updateNestedValue : this.updateNormalValue}
                        name={field.name}
                    />
                )

            case 'multiline':
                return (
                    <Form.TextArea
                        value={item[field.name]}
                        label={field.label}
                        key={id}
                        onChange={nested ? this.updateNestedValue : this.updateNormalValue}
                        name={field.name}
                    />
                )

            case 'html':
                if (typeof tinymce !== 'undefined' && ready) {
                    return (
                        <Form.Field className="tinymce-selector">
                            <label>{field.label}</label>
                            <div className="wrapper" >
                                <TinyMCE
                                    content={item[field.name]}
                                    config={tinyConfig}

                                    onChange={e => {
                                        const updateFunction = nested ? this.updateNestedValue : this.updateNormalValue
                                        updateFunction(e, {
                                            name: field.name,
                                            value: e.target.getContent()
                                        })
                                    }}
                                />
                            </div>
                        </Form.Field>
                    )
                }
                return <div key={id}>Loading TinyMCE Editor ... </div>

            case 'image':
                return (
                    <Form.Field className="image-selector" key={id} >
                        <label>{field.label}</label>
                        <div className="wrapper" >
                            <Image
                                rounded
                                src={item[field.name]}
                                size="tiny"
                            />
                            <div className="choice" >
                                <p>{item[field.name]}</p>
                                <ModalImageSelector
                                    selectPicture={nested ? this.updateNestedValue : this.updateNormalValue}
                                    currentPicture={item[field.name]}
                                    name={field.name}
                                />
                                {item[field.name] &&
                                    <Button
                                        onClick={nested ? this.updateNestedValue : this.updateNormalValue}
                                        value={null}
                                        name={field.name}
                                        size='mini'
                                        color="red">remove the picture</Button>
                                }
                            </div>
                        </div>
                    </Form.Field>
                )

            case 'boolean':
                return (
                    <Form.Field key={id}>
                        <label>{field.label}</label>
                        <Checkbox
                            checked={item[field.name]}
                            toggle
                            key={id}
                            onChange={nested ? this.updateNestedValue : this.updateNormalValue}
                            name={field.name}
                        />
                    </Form.Field>
                )

            case 'date':
                return (
                    <Form.Field key={id}>
                        <label>{field.label}</label>
                        <DateTimePicker
                            className="datepicker"
                            calendarClassName="calendar"
                            clockClassName="clock"
                            isClockOpen={false}
                            onChange={(date) => {
                                if (nested) {
                                    this.updateNestedValue({}, {
                                        name: field.name,
                                        value: date,
                                    })
                                }
                                else {
                                    this.updateNormalValue({}, {
                                        name: field.name,
                                        value: date,
                                    })
                                }
                            }
                            }
                            }
                        key={id}
                        value={item[field.name] instanceof Date ? item[field.name] : new Date()}
                        />
                    </Form.Field>
                )

            case 'list':
                if (field.fields) {
                    return (
                        <ObjectsList
                            item={item}
                            field={field}
                            ready={ready}
                            objectId={id}
                            incrementeList={this.incrementeList}
                            decrementeList={this.decrementeList}
                            updateListOrder={this.updateListOrder}
                        />
                    )

                } else {
                    const options = item[field.name] &&
                        item[field.name].length > 0 ?
                        item[field.name].map((mark, i) => ({ key: `${JSON.stringify(mark)}_${i}`, text: mark, value: mark }))
                        :
                        []
                    return (
                        <Form.Dropdown
                            key={id}
                            name={field.name}
                            fluid
                            multiple
                            label={field.label}
                            search
                            selection
                            allowAdditions
                            options={options}
                            onChange={nested ? this.updateNestedValue : this.updateNormalValue}
                            value={item[field.name] || []}
                        />
                    )
                }
            default:
                widget = <div>There is an error with the widget name {field.widget}</div>
                break
        }
    }
}


export default ErrorHandler(WidgetSelector);


