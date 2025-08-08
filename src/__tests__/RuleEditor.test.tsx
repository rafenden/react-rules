import { render, screen } from '@testing-library/react';
import RuleEditor from '../components/RuleEditor';

describe('RuleEditor', () => {
  const defaultRule = {
    conditions: {
      all: [
        {
          fact: 'age',
          operator: 'greaterThan',
          value: 18,
        },
      ],
    },
    event: {
      type: 'success',
      params: {
        message: 'User is an adult',
      },
    },
  };

  const mockFacts = [
    { value: 'age', label: 'Age' },
    { value: 'name', label: 'Name' },
  ];

  const mockOperators = [
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
  ];

  const mockEvents = [
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
  ];

  it('renders with initial value', () => {
    render(
      <RuleEditor
        value={JSON.stringify([defaultRule])}
        onChange={() => {}}
        facts={mockFacts}
        operators={mockOperators}
        events={mockEvents}
      />,
    );

    expect(
      screen.getByText(
        (content, element) =>
          content.startsWith('Rule #') &&
          element?.tagName.toLowerCase() === 'header',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Greater than')).toBeInTheDocument();
    expect(screen.getByDisplayValue('18')).toBeInTheDocument();
  });
});
