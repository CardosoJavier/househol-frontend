import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dialog from "./Dialog";

describe("Dialog", () => {
  it("renders children content", () => {
    render(
      <Dialog>
        <div data-testid="dialog-child-content">Test Content</div>
      </Dialog>
    );

    const childContent = screen.getByTestId("dialog-child-content");
    expect(childContent).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders with correct styling classes", () => {
    render(
      <Dialog>
        <div>Test Content</div>
      </Dialog>
    );

    // Check outer container
    const container = screen.getByTestId("dialog-container");
    const containerClasses = [
      "fixed",
      "inset-0",
      "z-50",
      "flex",
      "items-center",
      "justify-center",
    ];
    containerClasses.forEach((className) => {
      expect(container.className).toContain(className);
    });

    // Check overlay
    const overlay = screen.getByTestId("dialog-overlay");
    const overlayClasses = ["fixed", "inset-0", "bg-accent", "opacity-65"];
    overlayClasses.forEach((className) => {
      expect(overlay.className).toContain(className);
    });

    // Check content container
    const content = screen.getByTestId("dialog-content");
    const contentClasses = [
      "relative",
      "bg-primary",
      "rounded-md",
      "p-5",
      "w-5/6",
      "max-w-lg",
      "z-10",
      "max-h-[90vh]",
      "overflow-y-auto",
    ];
    contentClasses.forEach((className) => {
      expect(content.className).toContain(className);
    });
  });

  it("prevents event propagation on overlay click", () => {
    const mockStopPropagation = jest.fn();
    render(
      <Dialog>
        <div>Test Content</div>
      </Dialog>
    );

    const overlay = screen.getByTestId("dialog-overlay");
    const mockEvent = new MouseEvent("click", { bubbles: true });
    mockEvent.stopPropagation = mockStopPropagation;
    fireEvent(overlay, mockEvent);

    expect(mockStopPropagation).toHaveBeenCalled();
  });

  it("handles long content with scroll", () => {
    const longContent = Array(20).fill("Test Content Line").join("\n");
    render(
      <Dialog>
        <div data-testid="dialog-child-content">{longContent}</div>
      </Dialog>
    );

    const dialogContent = screen.getByTestId("dialog-content");
    expect(dialogContent.className).toContain("relative");
    expect(dialogContent.className).toContain("bg-primary");
    expect(dialogContent.className).toContain("rounded-md");
    expect(dialogContent.className).toContain("p-5");
    expect(dialogContent.className).toContain("w-5/6");
    expect(dialogContent.className).toContain("max-w-lg");
    expect(dialogContent.className).toContain("z-10");
    expect(dialogContent.className).toContain("max-h-[90vh]");
    expect(dialogContent.className).toContain("overflow-y-auto");
  });
});
