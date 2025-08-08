import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RuleSelect from '../components/RulesSelect';

describe('RuleSelect', () => {
  const mockOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  it('renders with placeholder', () => {
    render(
      <RuleSelect
        placeholder="Select an option"
        value=""
        onChange={() => {}}
        options={mockOptions}
        className="test-class"
      />,
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('');
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders with selected value', () => {
    render(
      <RuleSelect
        placeholder="Select an option"
        value="2"
        onChange={() => {}}
        options={mockOptions}
        className="test-class"
      />,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('2');
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('changes value when selecting an option', async () => {
    const onChange = vi.fn();
    render(
      <RuleSelect
        placeholder="Select an option"
        value=""
        onChange={onChange}
        options={mockOptions}
        className="test-class"
      />,
    );
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '2');
    expect(onChange).toHaveBeenCalledWith({ label: 'Option 2', value: '2' });
  });
});
