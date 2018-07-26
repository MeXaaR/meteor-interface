import React from 'react';
import { Form } from 'semantic-ui-react';
import DateTimePicker from 'react-datetime-picker';

const DatePicker = ({ onChange, label, value, name }) => (
    <Form.Field>
        <label>{label}</label>
        <DateTimePicker
            className="datepicker"
            calendarClassName="calendar"
            clockClassName="clock"
            isClockOpen={false}
            onChange={(date) => onChange({}, { name, value: date })}
            value={value instanceof Date ? value : new Date()}
        />
    </Form.Field>
)

export default DatePicker