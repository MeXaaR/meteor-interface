import React from 'react';
import { Form, Image, Button } from 'semantic-ui-react';
import ModalImageSelector from '../../../MediaManager/components/ModalImageSelector';

const ImageWidget = ({ onChange, label, value, name }) => (
    <Form.Field className="image-selector" >
        <label>{label}</label>
        <div className="wrapper" >
            <Image
                rounded
                src={value}
                size="tiny"
            />
            <div className="choice" >
                <p>{value}</p>
                <ModalImageSelector
                    selectPicture={onChange}
                    currentPicture={value}
                    name={name}
                />
                {value &&
                    <Button
                        onClick={onChange}
                        value={null}
                        name={name}
                        size='mini'
                        color="red">remove the picture</Button>
                }
            </div>
        </div>
    </Form.Field>
)

export default ImageWidget