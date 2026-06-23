import React from 'react';
import { Task } from '../../../types/models';
import { TaskStatus } from '../../../types/enums';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveStatus: (id: string, newStatus: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
}) => {
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  return (
    <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 items-start w-full">
      <KanbanColumn
        title="To Do"
        status="TODO"
        tasks={todoTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onMoveStatus={onMoveStatus}
      />
      <KanbanColumn
        title="In Progress"
        status="IN_PROGRESS"
        tasks={inProgressTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onMoveStatus={onMoveStatus}
      />
      <KanbanColumn
        title="Done"
        status="DONE"
        tasks={doneTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onMoveStatus={onMoveStatus}
      />
    </div>
  );
};

export default KanbanBoard;
