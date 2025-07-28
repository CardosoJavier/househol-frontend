import isTaskPresent from './isTaskPresent';
import { TaskProps } from '../../models';

describe('isTaskPresent', () => {
  const mockDate = new Date('2024-01-01');
  
  const mockTask: TaskProps = {
    id: '123',
    description: 'Test task',
    dueDate: mockDate,
    priority: 'high',
    status: 'pending',
    createdAt: mockDate,
    updatedAt: mockDate,
    userAccount: {
      id: 123,
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      email: 'test@example.com',
      createdAt: mockDate,
      updatedAt: mockDate,
      family: {
        id: 456,
        name: 'Test Family',
        createdAt: mockDate
      }
    },
    columnId: 1,
    projectId: 'project123'
  };

  const mockTaskList: TaskProps[] = [
    mockTask,
    {
      ...mockTask,
      id: '456',
      description: 'Another task'
    },
    {
      ...mockTask,
      id: '789',
      description: 'Third task'
    }
  ];

  it('should return true when task is present in the list', () => {
    expect(isTaskPresent(mockTask, mockTaskList)).toBe(true);
  });

  it('should return false when task is not present in the list', () => {
    const nonExistentTask = {
      ...mockTask,
      id: 'nonexistent'
    };
    expect(isTaskPresent(nonExistentTask, mockTaskList)).toBe(false);
  });

  it('should handle empty task list', () => {
    expect(isTaskPresent(mockTask, [])).toBe(false);
  });

  it('should match task by id only', () => {
    const modifiedTask = {
      ...mockTask,
      description: 'Modified description',
      priority: 'low',
      status: 'completed'
    };
    expect(isTaskPresent(modifiedTask, mockTaskList)).toBe(true);
  });

  it('should handle multiple tasks with different properties', () => {
    const taskWithDifferentProps = {
      ...mockTask,
      id: '456',
      description: 'Different description',
      priority: 'low',
      status: 'completed'
    };
    expect(isTaskPresent(taskWithDifferentProps, mockTaskList)).toBe(true);
  });
});