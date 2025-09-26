import React, { useState, useMemo } from 'react';
import type { HolidayRequest, LeaveType } from '../types';
import { WidgetCard } from './WidgetCard';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

const today = new Date();
today.setHours(0, 0, 0, 0);

const HolidaysCalendar: React.FC<{ requests: HolidayRequest[] }> = ({ requests }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { month, year, daysInMonth, firstDayOfMonth } = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { month, year, daysInMonth, firstDayOfMonth };
    }, [currentDate]);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getLeavesForDay = (day: number) => {
        const date = new Date(year, month, day);
        return requests
            .filter(req => {
                const startDate = new Date(req.startDate);
                startDate.setUTCHours(0,0,0,0);
                const endDate = new Date(req.endDate);
                endDate.setUTCHours(0,0,0,0);
                return date >= startDate && date <= endDate;
            })
            .map(req => req.userName);
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.getTime() === today.getTime();
        const leaves = getLeavesForDay(day);
        const hasLeave = leaves.length > 0;

        calendarDays.push(
            <div 
                key={day}
                title={hasLeave ? `On leave: ${leaves.join(', ')}` : ''}
                className={`p-2 border-r border-b border-gray-200 text-sm relative ${hasLeave ? 'bg-amber-100' : ''}`}
            >
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${isToday ? 'bg-blue-600 text-white' : ''}`}>
                    {day}
                </span>
                {hasLeave && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
                        {leaves.slice(0, 3).map((_, index) => (
                            <div key={index} className="h-1 w-1 bg-red-500 rounded-full"></div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <WidgetCard title="Team Calendar" icon={<CalendarIcon className="h-6 w-6 text-green-500" />}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <div className="flex space-x-2">
                    <button onClick={handlePrevMonth} className="p-1.5 rounded-md hover:bg-gray-100"><ChevronLeftIcon className="h-5 w-5 text-gray-600" /></button>
                    <button onClick={handleNextMonth} className="p-1.5 rounded-md hover:bg-gray-100"><ChevronRightIcon className="h-5 w-5 text-gray-600" /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-center font-medium text-xs text-gray-500 border-t border-l border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2 border-r border-b border-gray-200">{day}</div>)}
                {calendarDays}
            </div>
        </WidgetCard>
    );
};

const RequestForm: React.FC<{ onSubmit: (req: HolidayRequest) => void }> = ({ onSubmit }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [type, setType] = useState<LeaveType>('Holiday');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        onSubmit({
            id: `req-${Date.now()}`,
            userName: 'Alex Chen', // Hardcoded for current user
            startDate,
            endDate,
            type,
            status: 'Approved' // Simulating auto-approval
        });
        setStartDate('');
        setEndDate('');
        setNotes('');
    }

    return (
        <WidgetCard title="Richiesta Ferie/Assenze" icon={<CalendarIcon className="h-6 w-6 text-blue-500" />}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo di richiesta</label>
                    <select value={type} onChange={e => setType(e.target.value as LeaveType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option>Holiday</option>
                        <option>Sick Leave</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Data Inizio</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Data Fine</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Note (opzionale)</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Invia Richiesta</button>
            </form>
        </WidgetCard>
    )
}

export const HolidaysPage: React.FC<{ initialRequests: HolidayRequest[] }> = ({ initialRequests }) => {
    const [requests, setRequests] = useState(initialRequests);
    
    const handleAddRequest = (newRequest: HolidayRequest) => {
        setRequests(prev => [...prev, newRequest]);
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Ferie e Permessi</h1>
            <p className="text-gray-500 mb-8">Invia una nuova richiesta o visualizza il calendario del team.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RequestForm onSubmit={handleAddRequest} />
                </div>
                <div className="lg:col-span-2">
                    <HolidaysCalendar requests={requests} />
                </div>
            </div>
        </div>
    );
};