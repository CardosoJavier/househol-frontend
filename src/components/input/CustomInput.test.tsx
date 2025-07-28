import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CustomInput from "./CustomInput";

describe("CustomInput", () => {
  const defaultProps = {
    id: "test-input",
    name: "test",
    type: "text",
  };

  it("renders with default props", () => {
    render(<CustomInput {...defaultProps} />);
    const input = screen.getByTestId("custom-input");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toHaveAttribute("name", "test");
    expect(input).toHaveAttribute("type", "text");
    expect(input).not.toBeDisabled();
  });

  it("renders with placeholder text", () => {
    render(<CustomInput {...defaultProps} placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");

    expect(input).toBeInTheDocument();
  });

  it("renders with initial value", () => {
    render(<CustomInput {...defaultProps} value="Initial value" />);
    const input = screen.getByTestId("custom-input");

    expect(input).toHaveValue("Initial value");
  });

  it('handles onChange events', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<CustomInput {...defaultProps} onChange={handleChange} />);
    const input = screen.getByTestId('custom-input');
    
    await user.type(input, 'test input');
    expect(handleChange).toHaveBeenCalledTimes(10); // One call per character
  });

  it("can be disabled", () => {
    render(<CustomInput {...defaultProps} isDisabled={true} />);
    const input = screen.getByTestId("custom-input");

    expect(input).toBeDisabled();
    expect(input.className).toContain("bg-gray-100");
  });

  it("hides input when type is file", () => {
    render(<CustomInput {...defaultProps} type="file" />);
    const input = screen.getByTestId("custom-input");

    expect(input).toHaveClass("hidden");
  });

  it("applies correct styling classes", () => {
    render(<CustomInput {...defaultProps} />);
    const input = screen.getByTestId("custom-input");

    const expectedClasses = [
      "h-10",
      "w-full",
      "outline",
      "outline-secondary",
      "rounded-md",
      "px-2",
      "py-3",
      "text-accent",
      "text-sm",
      "focus-visible:outline-none",
      "duration-200",
      "ease-linear",
      "focus-visible:ring-2",
      "focus-within:ring-accent",
      "bg-transparent"
    ];
    expectedClasses.forEach((className) => {
      expect(input.className).toContain(className);
    });
  });

  it("handles different input types", () => {
    const types = ["text", "password", "email", "number"];
    const { rerender } = render(
      <CustomInput {...defaultProps} type={types[0]} />
    );

    types.forEach((type) => {
      rerender(<CustomInput {...defaultProps} type={type} />);
      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("type", type);
    });
  });

  it("handles focus and blur events", async () => {
    render(<CustomInput {...defaultProps} />);
    const input = screen.getByRole("textbox");

    input.focus();
    expect(input).toHaveFocus();

    input.blur();
    expect(input).not.toHaveFocus();
  });
});
