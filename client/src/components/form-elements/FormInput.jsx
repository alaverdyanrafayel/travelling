import React from 'react';
import { Label, Button } from 'reactstrap';
import { ErrorMessage, FormGroup, FormIcon, Input } from 'components/form-elements';
import { HelpBlock, HoverTip } from 'components/common';

export const FormInput = ({ eventHandler, fields, details, noLabel }) => {
    const {
        id, name, label, classType, error, type, removeIcon, hint, hoverTip, percent, options, disableDefaultOption, autoFocus,
        linkButton, textAreaMaxLength, textareaRows, disabled, defaultValue, colSize, className, handleBlur, tooltip, groupClass = noLabel ? 'no-label' : ''
    } = details;

    return (
        <FormGroup has={classType} groupClass={groupClass}>
            {noLabel ? '' : <Label for={name}>{label} {hoverTip && <HoverTip>{hoverTip}</HoverTip>}</Label>}
            {linkButton && linkButton.text && linkButton.onClick && <Button onClick={linkButton.onClick} className="btn-link">{linkButton.text}</Button>}
            <Input
                id={id}
                tooltip={tooltip}
                handleBlur={handleBlur}
                colSize={colSize}
                type={type}
                className={className}
                label={label}
                name={name}
                error={error}
                options={options}
                percent={percent}
                value={fields[name]}
                textareaRows={textareaRows}
                disabled={disabled}
                autoFocus={autoFocus}
                defaultValue={defaultValue}
                eventHandler={eventHandler}
                placeholder={noLabel ? label : ''}
                textAreaMaxLength={textAreaMaxLength}
                disableDefaultOption={disableDefaultOption}/>
            {removeIcon ? '' : <FormIcon type={classType}/>}
            {type !== 'email' && type !== 'password' && type !== 'text' && type !== 'number' && type !== 'date' && type !== 'phone'
            && <ErrorMessage>{error}</ErrorMessage>}
            {hint && <HelpBlock>{hint}</HelpBlock>}
        </FormGroup>
    );
};
