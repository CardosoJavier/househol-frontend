import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomLabel from './CustomLabel';

describe('CustomLabel', () => {
  const defaultProps = {
    forItem: 'test-input',
    label: 'Test Label',
  };

  it('renders with default props', () => {
    render(<CustomLabel {...defaultProps} />);
    const label = screen.getByTestId('custom-label');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
    const expectedClasses = ['text-accent', 'text-sm', 'font-medium'];
    expectedClasses.forEach(className => {
      expect(label.className).toContain(className);
    });
  });

  it('applies file input styling when inputType is "file"', () => {
    render(<CustomLabel {...defaultProps} inputType="file" />);
    const label = screen.getByTestId('custom-label');
    
    const expectedClasses = [
      'text-accent',
      'text-sm',
      'font-medium',
      'hover:underline',
      'cursor-pointer'
    ];
    expectedClasses.forEach(className => {
      expect(label.className).toContain(className);
    });
  });

  it('does not apply file input styling for other input types', () => {
    const inputTypes = ['text', 'password', 'email', 'number', undefined];
    const { rerender } = render(<CustomLabel {...defaultProps} inputType={inputTypes[0]} />);
    
    inputTypes.forEach(type => {
      rerender(<CustomLabel {...defaultProps} inputType={type} />);
      const label = screen.getByTestId('custom-label');
      
      expect(label.className).not.toContain('hover:underline');
      expect(label.className).not.toContain('cursor-pointer');
    });
  });

  it('handles long label text', () => {
    const longLabel = 'This is a very long label text that might wrap to multiple lines';
    render(<CustomLabel {...defaultProps} label={longLabel} />);
    const label = screen.getByTestId('custom-label');
    
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe(longLabel);
  });

  it('maintains accessibility by linking to input element', () => {
    const inputId = 'specific-input-id';
    render(<CustomLabel forItem={inputId} label="Test Label" />);
    const label = screen.getByTestId('custom-label');
    
    expect(label).toHaveAttribute('for', inputId);
  });

  it('renders with special characters in label', () => {
    const specialLabel = 'Test & Label * (Required)';
    render(<CustomLabel {...defaultProps} label={specialLabel} />);
    const label = screen.getByTestId('custom-label');
    
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe(specialLabel);
  });
});