import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('App Basic Test', () => {
  it('should run a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render a basic component', () => {
    const TestComponent = () => <div>Test Component</div>;
    const { getByText } = render(<TestComponent />);
    expect(getByText('Test Component')).toBeInTheDocument();
  });
});