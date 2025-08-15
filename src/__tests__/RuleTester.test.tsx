import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Engine, Operator } from 'json-rules-engine';
import RuleTester from '../components/RuleTester';
import { Fact } from '../types';

const mockFacts: Fact[] = [
  { value: 'age', label: 'Age' },
  { value: 'score', label: 'Score' },
];

const mockRules = [
  {
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
      type: 'adult',
      params: {
        value: 'User is an adult',
      },
    },
  },
];

const mockRulesWithCustomOperator = [
  {
    conditions: {
      all: [
        {
          fact: 'score',
          operator: 'minusIsZero',
          value: 100,
        },
      ],
    },
    event: {
      type: 'perfect',
      params: {
        value: 'Perfect score achieved',
      },
    },
  },
];

describe('RuleTester', () => {
  it('renders without crashing', () => {
    render(<RuleTester rules={mockRules} facts={mockFacts} />);
    expect(screen.getByText('Test the rules')).toBeInTheDocument();
  });

  it('executes rules with default engine', async () => {
    render(<RuleTester rules={mockRules} facts={mockFacts} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: JSON.stringify({ age: 25 }) },
    });

    const executeButton = screen.getByText('▶️ Execute');
    fireEvent.click(executeButton);

    await waitFor(() => {
      const result = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && content.includes('adult');
      });
      expect(result).toBeInTheDocument();
    });
  });

  it('executes rules with custom engine and custom operator', async () => {
    const customEngine = new Engine();
    const minusIsZeroOperator = new Operator('minusIsZero', (factValue: number, value: number) => {
      return factValue - value === 0;
    });
    customEngine.addOperator(minusIsZeroOperator);

    render(
      <RuleTester 
        rules={mockRulesWithCustomOperator} 
        facts={mockFacts} 
        engine={customEngine}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: JSON.stringify({ score: 100 }) },
    });

    const executeButton = screen.getByText('▶️ Execute');
    fireEvent.click(executeButton);

    await waitFor(() => {
      const result = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && content.includes('perfect');
      });
      expect(result).toBeInTheDocument();
    });
  });

  it('shows error when using unknown operator without custom engine', async () => {
    render(<RuleTester rules={mockRulesWithCustomOperator} facts={mockFacts} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: JSON.stringify({ score: 100 }) },
    });

    const executeButton = screen.getByText('▶️ Execute');
    fireEvent.click(executeButton);

    await waitFor(() => {
      const result = screen.getByText((content) => {
        return content.includes('Unknown operator');
      });
      expect(result).toBeInTheDocument();
    });
  });

  it('handles JSON parsing errors', async () => {
    render(<RuleTester rules={mockRules} facts={mockFacts} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: 'invalid json' },
    });

    await waitFor(() => {
      const result = screen.getByText((content) => {
        return content.includes('Unexpected token');
      });
      expect(result).toBeInTheDocument();
    });
  });
});