import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Engine, Operator } from 'json-rules-engine';
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
          content.startsWith('Rule 1') &&
          element?.tagName.toLowerCase() === 'header',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Greater than')).toBeInTheDocument();
    expect(screen.getByDisplayValue('18')).toBeInTheDocument();
  });

  it('passes custom engine to RuleTester component', async () => {
    const customEngine = new Engine();
    const customOperator = new Operator('customOp', () => true);
    customEngine.addOperator(customOperator);

    const ruleWithCustomOperator = {
      conditions: {
        all: [
          {
            fact: 'age',
            operator: 'customOp',
            value: 25,
          },
        ],
      },
      event: {
        type: 'success',
        params: {
          message: 'Custom operator works',
        },
      },
    };

    render(
      <RuleEditor
        value={JSON.stringify([ruleWithCustomOperator])}
        onChange={() => {}}
        facts={mockFacts}
        operators={[...mockOperators, { value: 'customOp', label: 'Custom Op' }]}
        events={mockEvents}
        engine={customEngine}
      />,
    );

    const testRulesSection = screen.getByText('Test the rules');
    expect(testRulesSection).toBeInTheDocument();
    
    fireEvent.click(testRulesSection);

    const textarea = screen.getByRole('textbox', { name: /facts/i });
    fireEvent.change(textarea, {
      target: { value: JSON.stringify({ age: 25 }) },
    });

    const executeButton = screen.getByText('▶️ Execute');
    fireEvent.click(executeButton);

    await waitFor(() => {
      const result = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && content.includes('success');
      });
      expect(result).toBeInTheDocument();
    });
  });

  it('hides RuleTester when showRuleTester is false', () => {
    render(
      <RuleEditor
        value={JSON.stringify([defaultRule])}
        onChange={() => {}}
        facts={mockFacts}
        operators={mockOperators}
        events={mockEvents}
        showRuleTester={false}
      />,
    );

    expect(screen.queryByText('Test the rules')).not.toBeInTheDocument();
  });

  it('shows RuleTester by default when showRuleTester is not specified', () => {
    render(
      <RuleEditor
        value={JSON.stringify([defaultRule])}
        onChange={() => {}}
        facts={mockFacts}
        operators={mockOperators}
        events={mockEvents}
      />,
    );

    expect(screen.getByText('Test the rules')).toBeInTheDocument();
  });
});
