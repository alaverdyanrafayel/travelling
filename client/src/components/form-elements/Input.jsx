import React from 'react';
import { Col, Row } from 'reactstrap';
import { Checkbox, TextField } from 'material-ui';
import InputMask from 'react-input-mask';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { ComboDatePicker } from 'components/form-elements';

Moment.locale('en-au');
momentLocalizer();

export const Input = (props) => {
    const {
        id, type, name, value, options, disableDefaultOption, eventHandler, label, autoFocus,
        placeholder, textareaRows, textAreaMaxLength, error, disabled, defaultValue, hidden,
        colSize = 12, handleBlur, tooltip
    } = props,
        inputOptions = options && options.size > 0 && options.toJS() || {};
    let inputElement;

    switch (type) {
            case 'text':
            case 'password':
            case 'email':
            case 'number':
                inputElement = <Col sm={colSize}>
                    <TextField
                        style={error === '' ? { margin: '14px 0px', fontWeight: 400, fontSize: 15 } : {
                            fontWeight: 400,
                            fontSize: 15
                        }}
                        underlineFocusStyle={{ borderColor: 'black', borderWidth: 1 }}
                        floatingLabelFocusStyle={{ color: '#635f5f' }}
                        floatingLabelStyle={{ fontWeight: 400, color: '#635f5f' }}
                        data-tip={tooltip}
                        onBlur={handleBlur}
                        floatingLabelText={placeholder}
                        onChange={eventHandler}
                        errorText={(
                          error.length > 0 ? <label dangerouslySetInnerHTML={{__html: error || ''}} style={{fontWeight: 'normal'}}></label> : ''
                        )}
                        value={value || defaultValue || ''}
                        type={type}
                        name={name}
                        disabled={!!disabled}
                        fullWidth={true}
                        id={id}
                        autoFocus={autoFocus}
                        autoComplete="off"
                        min="0"
                    />
                </Col>;
                break;
            case 'percent':
                inputElement = <Col sm={colSize}>
                <TextField
                    style={error === '' ? { margin: '14px 0px', fontWeight: 400, fontSize: 15, width: '80%' } : {
                        fontWeight: 400,
                        fontSize: 15,
                        width: '80%'
                    }}
                    underlineFocusStyle={{ borderColor: 'black', borderWidth: 1 }}
                    floatingLabelFocusStyle={{ color: '#635f5f' }}
                    floatingLabelStyle={{ fontWeight: 400, color: '#635f5f' }}
                    data-tip={tooltip}
                    onBlur={handleBlur}
                    floatingLabelText={placeholder}
                    onChange={eventHandler}
                    value={value || defaultValue || ''}
                    type="number"
                    name={name}
                    disabled={!!disabled}
                    fullWidth={true}
                    id={id}
                    min="0"
                /><span>%</span>
            </Col>;
                break;
            case 'date':
                inputElement = (
                    <Col sm={colSize}>
                      <p className="pull-left">{placeholder}</p>
                      <span className="pull-left">
                        <ComboDatePicker
                          name='dob'
                            date={defaultValue}
                            onChange={(picker, date) => {

                                return eventHandler({ target: { value: date, name: 'dob' } });
                            }}
                          />
                        </span>
                    </Col>
                );
                break;
            case 'textarea':
                inputElement = <textarea
                    placeholder={placeholder}
                    className="form-control"
                    onChange={eventHandler}
                    onBlur={eventHandler}
                    value={value || ''}
                    maxLength={textAreaMaxLength}
                    name={name}
                    id={name}
                    rows={textareaRows || 3}/>;
                break;
            case 'select':
                inputElement = <select
                    placeholder={placeholder}
                    className="form-control"
                    onChange={eventHandler}
                    onBlur={eventHandler}
                    value={value || ''}
                    name={name}
                    id={name}>
                    <option value={''} disabled={disableDefaultOption}>Select an option</option>
                    {inputOptions && Array.isArray(inputOptions) ? inputOptions.map((option, index) => {
                        <option key={index} value={option.value}>
                            {option.text}
                        </option>;
                    }) : ''}
                </select>;
                break;
            case 'radio':
                inputElement = <Row>
                    <Col xs="12" className="member-position">
                        <span className="displayB">{placeholder}</span>
                        {inputOptions.map((inputOption, index) =>
                            <div key={index} className="form-item form-radio radio-style pull-left pr15">
                                <input type="radio"
                                       id={inputOption.id}
                                       name={inputOption.name}
                                       value={inputOption.value}
                                       checked={inputOption.value === value}
                                       onChange={eventHandler}/>
                                <label htmlFor={inputOption.id}>
                                    <i className="icon-radio" />
                                    {inputOption.label}
                                </label>
                            </div>)}
                    </Col>
                </Row>;
                break;
            case 'checkbox':
                inputElement =
                    <Col sm="12" className="member-position">
                        <Checkbox
                            name={name}
                            label={(
                             <label dangerouslySetInnerHTML={{__html: placeholder}} style={{fontWeight: 'normal'}}></label>
                            )}
                            style={{ marginBottom: 20, marginTop: 20, textAlign: 'left' }}
                            iconStyle={{ fill: '#642c91' }}
                            labelStyle={{ fontWeight: 400, zIndex: 1000 }}
                            className="checkboxWrapper"
                            onCheck={eventHandler}/>
                    </Col>;
                break;
            case 'phone':
                inputElement = <Col sm={colSize}>
                    <TextField name={name} errorText={error || ''}
                               style={error === '' ? { margin: '14px 0px', fontWeight: 400, fontSize: 15 } : {
                                   fontWeight: 400,
                                   fontSize: 15
                               }}
                               underlineFocusStyle={{ borderColor: 'black', borderWidth: 1 }}
                               fullWidth={true}
                               disabled={!!disabled}
                               floatingLabelFocusStyle={{ color: '#635f5f' }}
                               floatingLabelStyle={{ fontWeight: 400, color: '#635f5f' }}>
                        <InputMask placeholder={placeholder}
                                   name={name} value={value} id={id} onChange={eventHandler}
                                   mask="+6\1 999 999 999" maskChar=" "/>
                    </TextField>
                </Col>;
                break;
            case 'hidden':
                inputElement = <Col sm={colSize}>
                    <TextField
                        style={{ fontWeight: 400, fontSize: 15 }}
                        underlineFocusStyle={{ borderColor: 'black', borderWidth: 1 }}
                        floatingLabelFocusStyle={{ color: '#635f5f' }}
                        floatingLabelStyle={{ fontWeight: 400, color: '#635f5f' }}
                        data-tip={tooltip}
                        onBlur={handleBlur}
                        floatingLabelText={placeholder}
                        onChange={eventHandler}
                        errorText={error || ''}
                        value={value || defaultValue || ''}
                        type={type}
                        name={name}
                        disabled={!!disabled}
                        fullWidth={true}
                        id={id}
                    />
                </Col>;
                break;
    }

    return <span>
        {inputElement}
    </span>;
};
