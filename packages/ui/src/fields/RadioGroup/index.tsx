/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import type { Option } from 'payload/types'

import { optionIsObject } from 'payload/types'
import React, { useCallback } from 'react'

import { FieldLabel } from '../../forms/FieldLabel/index.js'
import { useForm } from '../../forms/Form/context.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { fieldBaseClass } from '../shared/index.js'
import { Radio } from './Radio/index.js'
import './index.scss'

const baseClass = 'radio-group'

import type { FormFieldBase } from '../shared/index.js'

import { FieldDescription } from '../../forms/FieldDescription/index.js'
import { FieldError } from '../../forms/FieldError/index.js'
import { useFieldProps } from '../../forms/FieldPropsProvider/index.js'

export type RadioFieldProps = FormFieldBase & {
  layout?: 'horizontal' | 'vertical'
  name?: string
  onChange?: OnChange
  options?: Option[]
  path?: string
  value?: string
  width?: string
}

export type OnChange<T = string> = (value: T) => void

const RadioGroupField: React.FC<RadioFieldProps> = (props) => {
  const {
    name,
    CustomDescription,
    CustomError,
    CustomLabel,
    className,
    descriptionProps,
    errorProps,
    label,
    labelProps,
    layout = 'horizontal',
    onChange: onChangeFromProps,
    options = [],
    path: pathFromProps,
    readOnly: readOnlyFromProps,
    required,
    style,
    validate,
    value: valueFromProps,
    width,
  } = props

  const { uuid } = useForm()

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function')
        return validate(value, { ...validationOptions, options, required })
    },
    [validate, options, required],
  )

  const { path: pathFromContext, readOnly: readOnlyFromContext } = useFieldProps()
  const readOnly = readOnlyFromProps || readOnlyFromContext

  const {
    path,
    setValue,
    showError,
    value: valueFromContext,
  } = useField<string>({
    path: pathFromContext || pathFromProps || name,
    validate: memoizedValidate,
  })

  const value = valueFromContext || valueFromProps

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        `${baseClass}--layout-${layout}`,
        showError && 'error',
        readOnly && `${baseClass}--read-only`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...style,
        width,
      }}
    >
      <FieldLabel
        CustomLabel={CustomLabel}
        label={label}
        required={required}
        {...(labelProps || {})}
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError CustomError={CustomError} path={path} {...(errorProps || {})} />

        <ul className={`${baseClass}--group`} id={`field-${path.replace(/\./g, '__')}`}>
          {options.map((option) => {
            let optionValue = ''

            if (optionIsObject(option)) {
              optionValue = option.value
            } else {
              optionValue = option
            }

            const isSelected = String(optionValue) === String(value)

            const id = `field-${path}-${optionValue}${uuid ? `-${uuid}` : ''}`

            return (
              <li key={`${path} - ${optionValue}`}>
                <Radio
                  id={id}
                  isSelected={isSelected}
                  onChange={() => {
                    if (typeof onChangeFromProps === 'function') {
                      onChangeFromProps(optionValue)
                    }

                    if (!readOnly) {
                      setValue(optionValue)
                    }
                  }}
                  option={optionIsObject(option) ? option : { label: option, value: option }}
                  path={path}
                  readOnly={readOnly}
                  uuid={uuid}
                />
              </li>
            )
          })}
        </ul>
        {CustomDescription !== undefined ? (
          CustomDescription
        ) : (
          <FieldDescription {...(descriptionProps || {})} />
        )}
      </div>
    </div>
  )
}

export const RadioGroup = withCondition(RadioGroupField)