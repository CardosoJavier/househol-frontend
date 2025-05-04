import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDroppable } from "@dnd-kit/core";
import StatusColumn from "./StatusColumn";
import { statusColors } from "../../constants";

jest.mock("@dnd-kit/core", () => ({
  useDroppable: jest.fn(),
}));

jest.mock("./Task", () => jest.fn(() => <div data-testid="task" />));

describe("StatusColumn", () => {
  const mockUseDroppable = useDroppable as jest.Mock;

  beforeEach(() => {
    mockUseDroppable.mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    id: 1,
    title: "To Do",
    task: [
      {
        id: "1",
        description: "Task 1 description",
        priority: "High",
        status: "pending",
        userAccount: {
          id: 1,
          name: "User 1",
          firstName: "User",
          lastName: "One",
          role: "Admin",
          email: "user1@example.com",
          phone: "123-456-7890",
          address: "123 Main St",
          createdAt: new Date("2023-08-01"),
          updatedAt: new Date("2023-08-15"),
          family: {
            id: 1,
            name: "User Family",
            createdAt: new Date("2023-08-01"),
          },
        },
        dueDate: new Date("2023-10-01"),
        dueTime: "10:00 AM",
        createdAt: new Date("2023-09-01"),
        updatedAt: new Date("2023-09-02"),
        columnId: 1,
      },
    ],
    status: "pending",
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-09-02"),
  };

  it("renders the column title", () => {
    render(<StatusColumn {...defaultProps} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("applies the correct outline class when isOver is false", () => {
    render(<StatusColumn {...defaultProps} />);
    const column = screen.getByText("To Do").closest("div");
    expect(column).toHaveClass("outline-secondary");
    expect(column).not.toHaveClass("outline-accent");
  });

  it("applies the correct outline class when isOver is true", () => {
    mockUseDroppable.mockReturnValueOnce({
      setNodeRef: jest.fn(),
      isOver: true,
    });
    render(<StatusColumn {...defaultProps} />);
    const column = screen.getByText("To Do").closest("div");
    expect(column).toHaveClass("outline-accent");
    expect(column).not.toHaveClass("outline-secondary");
  });

  it("renders tasks correctly", () => {
    render(<StatusColumn {...defaultProps} />);
    expect(screen.getAllByTestId("task")).toHaveLength(1);
  });

  it("applies the correct status color", () => {
    render(<StatusColumn {...defaultProps} />);
    const header = screen.getByText("To Do");
    const colorClass: string | undefined = statusColors.get("pending");
    const fullClass = "text-accent w-full text-lg font-bold p-4 " + colorClass;
    expect(header).toHaveClass(fullClass);
  });

  it("renders no tasks when task array is empty", () => {
    render(<StatusColumn {...defaultProps} task={[]} />);
    expect(screen.queryByTestId("task")).not.toBeInTheDocument();
  });

  it("renders the correct structure with no tasks and default props", () => {
    render(<StatusColumn {...defaultProps} task={[]} />);
    const column = screen.getByText("To Do").closest("div");
    expect(column).toBeInTheDocument();
    expect(column).toHaveClass("bg-primary");
  });

  it("calls setNodeRef from useDroppable", () => {
    const setNodeRefMock = jest.fn();
    mockUseDroppable.mockReturnValueOnce({
      setNodeRef: setNodeRefMock,
      isOver: false,
    });
    render(<StatusColumn {...defaultProps} />);
    expect(setNodeRefMock).toHaveBeenCalled();
  });
});
