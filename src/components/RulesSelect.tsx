import React from 'react';
import { RulesSelectProps } from './types';

const RulesSelect: React.FC<RulesSelectProps> = ({
  placeholder,
  value,
  onChange,
  options,
  style,
  ...props
}) => (
  <select
    value={value}
    onChange={(e) => {
      const selectedOption = options.find(
        (option) => option.value === e.target.value,
      );
      if (onChange && selectedOption) {
        onChange(selectedOption);
      }
    }}
    style={style}
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option
        key={option.value}
        value={option.value}
        disabled={option.isDisabled}
      >
        {option.label}
      </option>
    ))}
  </select>
);

export default RulesSelect;
