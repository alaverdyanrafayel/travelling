import React from 'react';
import { Col } from 'reactstrap';
import { FormInput } from './index';

export const Form = ({ eventHandler, fields, inputs, imageChangeHandler, noLabel, disabled }) => {
    return (
        <Col sm="12" className="form-group-wrapper">
            {inputs.map((input, index) =>
                <FormInput
                    key={index}
                    fields={fields}
                    details={input}
                    eventHandler={eventHandler}
                    imageChangeHandler={imageChangeHandler}
                    disabled={disabled}
                    noLabel={noLabel}/>)}
        </Col>
    );
};

export default Form;
