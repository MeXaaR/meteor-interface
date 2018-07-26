import React from 'react';
import { Form } from 'semantic-ui-react';

import TinyMCE from 'react-tinymce'

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

const HtmlEditor = ({ onChange, label, value, name, ready }) => {
    if (typeof tinymce !== 'undefined' && ready) {
        return (
            <Form.Field className="tinymce-selector">
                <label>{label}</label>
                <div className="wrapper" >
                    <TinyMCE
                        content={value}
                        config={tinyConfig}

                        onChange={e => onChange(e, { name, value: e.target.getContent() })}
                    />
                </div>
            </Form.Field>
        )
    }
    return <div>Loading TinyMCE Editor ... </div>
}

export default HtmlEditor