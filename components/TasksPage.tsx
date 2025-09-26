import React, { useState, useMemo } from 'react';
import type { Task, TaskStatus } from '../types';
import { WidgetCard } from './WidgetCard';
import { TasksIcon, PlusCircleIcon } from './Icons';

interface TasksPageProps {
    initialTasks: Task[];
    onTasksUpdate: (newTasks: Task[]) => void;
}

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; }> = ({ task, onToggle }) => {
    const isCompleted = task.status === 'Completed';
    const isOverdue = !isCompleted && new Date(task.dueDate) < new Date();

    return (
        <div className="flex items-start space-x-3 p-3 -m-3 rounded-lg hover:bg-gray-50">
            <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                checked={isCompleted}
                onChange={() => onToggle(task.id)}
                aria-labelledby={`task-title-${task.id}`}
            />
            <div className="flex-1">
                <p id={`task-title-${task.id}`} className={`font-medium text-gray-800 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                </p>
                <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                </p>
                <div className="text-xs mt-1 flex items-center space-x-4">
                    <span className={isOverdue ? 'font-semibold text-red-600' : 'text-gray-500'}>
                        Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {!isCompleted && task.assignedTo && <span className="text-gray-500">To: <span className="font-medium text-gray-700">{task.assignedTo}</span></span>}
                    {!isCompleted && task.createdBy && <span className="text-gray-500">From: <span className="font-medium text-gray-700">{task.createdBy}</span></span>}
                </div>
            </div>
        </div>
    )
}

const NewTaskForm: React.FC<{ onSubmit: (newTask: Omit<Task, 'id' | 'status'>) => void }> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dueDate || !assignedTo) {
            alert('Please fill in Title, Due Date, and Assigned To fields.');
            return;
        }
        onSubmit({
            title,
            description,
            dueDate,
            assignedTo,
            createdBy: 'Alex Chen' // Current user
        });
        setTitle('');
        setDescription('');
        setDueDate('');
        setAssignedTo('');
    }

    return (
        <WidgetCard title="Create New Task" icon={<PlusCircleIcon className="h-6 w-6 text-blue-500" />} showViewAll={false}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    <input type="text" placeholder="Assign To" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Add Task</button>
            </form>
        </WidgetCard>
    )
}

export const TasksPage: React.FC<TasksPageProps> = ({ initialTasks, onTasksUpdate }) => {
    const [tasks, setTasks] = useState(initialTasks);

    const { createdByMe, assignedToMeOpen } = useMemo(() => {
        const createdByMe = tasks.filter(t => t.createdBy === 'Alex Chen').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        const assignedToMeOpen = tasks.filter(t => t.assignedTo === 'Alex Chen' && t.status === 'Pending').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        return { createdByMe, assignedToMeOpen };
    }, [tasks]);

    const handleToggleStatus = (id: string) => {
        const newTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' as TaskStatus };
            }
            return task;
        });
        setTasks(newTasks);
        onTasksUpdate(newTasks);
    };

    const handleAddTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            status: 'Pending',
            ...newTaskData
        };
        const newTasks = [newTask, ...tasks];
        setTasks(newTasks);
        onTasksUpdate(newTasks);
    };

    return (
        <div className="container mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-gray-500 mb-8">Create, manage, and track your work.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <NewTaskForm onSubmit={handleAddTask} />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <WidgetCard title="My Created Tasks" icon={<TasksIcon className="h-6 w-6 text-purple-500" />} showViewAll={false}>
                        {createdByMe.length > 0 ? (
                             <div className="space-y-2">
                                {createdByMe.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleStatus} />)}
                             </div>
                        ) : <p className="text-center text-gray-500 py-4">You haven't created any tasks.</p>}
                    </WidgetCard>
                    <WidgetCard title="Tasks Assigned To Me" icon={<TasksIcon className="h-6 w-6 text-green-500" />} showViewAll={false}>
                         {assignedToMeOpen.length > 0 ? (
                            <div className="space-y-2">
                                {assignedToMeOpen.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleStatus} />)}
                            </div>
                        ) : <p className="text-center text-gray-500 py-4">You have no open tasks assigned to you. Great job!</p>}
                    </WidgetCard>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
