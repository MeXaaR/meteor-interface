import React, { Component } from 'react';

import DynamicImporter from "../../../utils/DynamicImporter";
import { WidgetFormConsumer } from '../../../utils/contexts/WidgetFormContext'


// Packages
import {
    Form,
    Checkbox,
} from 'semantic-ui-react';
import ErrorHandler from '../../../utils/ErrorHandler';

const ObjectsList = DynamicImporter(() => import('./widgets/ObjectsList'))
const HtmlEditor = DynamicImporter(() => import('./widgets/HtmlEditor'))
const ImageWidget = DynamicImporter(() => import('./widgets/ImageWidget'))
const DatePicker = DynamicImporter(() => import('./widgets/DatePicker'))


const WidgetSelector = WidgetFormConsumer((props) => {
    let { collection, collection2, item2 } = props
    if (item2 && collection2) {
        collection = collection2
    }
    return collection.fields.map((field, i) => <SingleWidget key={i} field={field} {...props} />)
})

class SingleWidget extends Component {

    state = {
        id: Random.id()
    }

    updateNestedValue = (e, { name, value, checked }) => {
        let { i2, collection2, item2, parent, context = {}, onChange } = this.props
        let { collection } = context;
        if (item2 && collection2) {
            collection = collection2
            item = item2
        }
        parent[i2][name] = typeof checked === "undefined" ? value || '' : checked
        onChange(e, {
            name: collection.name,
            value: parent,
        })
    }

    updateNormalValue = (e, { name, value, checked }) => {
        const { context = {}, field } = this.props
        let { updateValue } = context;
        updateValue(e, { name, value, checked })
    }


    render() {
        const { id } = this.state
        const { nested, collection2, item2, context = {}, field = {}, parent, index } = this.props;
        let { item, ready, collection } = context;
        const { label, name, widget } = field;

        if (item2 && collection2) {
            collection = collection2
            item = item2
        }

        const value = widget === "boolean" ? item[field.name] || false : item[field.name] || ''
        const placeholder = "Write the " + name
        const onChange = nested ? this.updateNestedValue : this.updateNormalValue
        const computedProps = { label, name, value, onChange, key: id, placeholder }


        switch (widget) {
            case 'number':
                return <Form.Input type="number" {...computedProps} />;
            case 'string':
                return <Form.Input {...computedProps} />;
            case 'multiline':
                return <Form.TextArea {...computedProps} />;
            case 'html':
                return <HtmlEditor ready={ready} {...computedProps} />;
            case 'image':
                return <ImageWidget {...computedProps} />;
            case 'boolean':
                delete computedProps.value
                delete computedProps.label
                computedProps.checked = value
                return (
                    <Form.Field key={id}>
                        <label>{label}</label>
                        <Checkbox toggle {...computedProps} />
                    </Form.Field>
                )
            case 'date':
                return <DatePicker {...computedProps} />
            case 'list':
                if (field.fields) {
                    return (
                        <ObjectsList
                            item={item}
                            field={field}
                            ready={ready}
                            objectId={id}
                            key={id}
                            nested={nested}
                            parent={parent}
                            index={index}
                            collection={collection}
                            onChange={onChange}
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
                return (<div>There is an error with the widget name {field.widget}</div>)
                break
        }
    }
}


export default ErrorHandler(WidgetSelector);


