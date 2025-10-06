import React, { useState, useMemo } from 'react';
import { MOCK_HOLIDAY_REQUESTS } from '../constants';
import type { HolidayRequest } from '../types';

const CalendarPreview: React.FC<{ startDate: string; endDate: string; allRequests: HolidayRequest[] }> = ({ startDate, endDate, allRequests }) => {
    const [displayDate, setDisplayDate] = useState(new Date());

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Normalize dates to ignore time for range checking
    const startDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
    const endDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null;

    const dailyRequestCounts = useMemo(() => {
        const counts = new Map<string, number>();
        const activeRequests = allRequests.filter(req => req.status !== 'Respinta');

        for (const req of activeRequests) {
            let currentDate = new Date(req.startDate);
            const endDate = new Date(req.endDate);

            currentDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            while (currentDate <= endDate) {
                const dateKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
                counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return counts;
    }, [allRequests]);


    const { monthName, year, daysInMonth, firstDayOfMonth } = useMemo(() => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthName = displayDate.toLocaleString('it-IT', { month: 'long' });
        return { monthName, year, daysInMonth, firstDayOfMonth: (firstDayOfMonth === 0 ? 6 : firstDayOfMonth -1) }; // Adjust to Mon=0
    }, [displayDate]);

    const handlePrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-slate-200"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, displayDate.getMonth(), day);
        const today = new Date();
        const isToday = today.getDate() === day && today.getMonth() === displayDate.getMonth() && today.getFullYear() === year;

        const dateKey = currentDate.toISOString().split('T')[0];
        const requestCount = dailyRequestCounts.get(dateKey);

        let dayClass = 'text-center p-2 border-r border-b border-slate-200 text-slate-700 relative';
        if (isToday) {
            dayClass += ' font-bold text-slate-600';
        }
        
        if (startDay && endDay && currentDate >= startDay && currentDate <= endDay) {
            dayClass += ' bg-slate-100 text-slate-800';
            if (currentDate.getTime() === startDay.getTime()) {
                dayClass += ' rounded-l-lg';
            }
            if (currentDate.getTime() === endDay.getTime()) {
                dayClass += ' rounded-r-lg';
            }
        }

        calendarDays.push(
            <div key={day} className={dayClass}>
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-slate-200' : ''}`}>
                {day}
              </span>
              {requestCount && requestCount > 0 && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {requestCount}
                  </div>
              )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Anteprima Calendario</h2>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100">&larr;</button>
                <h3 className="font-semibold text-lg capitalize">{monthName} {year}</h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100">&rarr;</button>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-slate-200">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
                    <div key={day} className="p-2 text-center text-xs font-semibold text-slate-500 border-r border-b border-slate-200 bg-slate-50">{day}</div>
                ))}
                {calendarDays}
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: HolidayRequest['status'] }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        'Approvata': 'bg-green-100 text-green-800',
        'In attesa': 'bg-yellow-100 text-yellow-800',
        'Respinta': 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const PastRequestsTable: React.FC = () => {
    const requests = MOCK_HOLIDAY_REQUESTS;
    const sortedRequests = [...requests].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Storico Richieste</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dal</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Al</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stato</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {sortedRequests.map(req => (
                            <tr key={req.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 capitalize">{req.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(req.startDate).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(req.endDate).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <StatusBadge status={req.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const HolidaysPage: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [requestType, setRequestType] = useState('ferie');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (startDate && endDate) {
            console.log({
                type: requestType,
                from: startDate,
                to: endDate,
            });
            setIsSubmitted(true);
        } else {
            alert("Per favore, compila sia la data di inizio che quella di fine.");
        }
    };
    
    if (isSubmitted) {
        return (
            <div className="p-8 text-center">
                 <h1 className="text-3xl font-bold text-slate-900 mb-4">Richiesta Inviata!</h1>
                 <p className="text-slate-600 mb-8">La tua richiesta di {requestType === 'ferie' ? 'ferie' : 'permesso'} dal {new Date(startDate).toLocaleString('it-IT')} al {new Date(endDate).toLocaleString('it-IT')} è stata inviata per l'approvazione.</p>
                 <button onClick={() => setIsSubmitted(false)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                    Invia un'altra richiesta
                </button>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Richiesta Ferie e Permessi</h1>
            
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-slate-700">Dal giorno/ora</label>
                            <input
                                type="datetime-local"
                                id="start-date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-slate-700">Al giorno/ora</label>
                            <input
                                type="datetime-local"
                                id="end-date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                min={startDate}
                                required
                                className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700">Tipo di richiesta</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-slate-600" name="requestType" value="ferie" checked={requestType === 'ferie'} onChange={() => setRequestType('ferie')} />
                                <span className="ml-2">Ferie</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-slate-600" name="requestType" value="permessi" checked={requestType === 'permessi'} onChange={() => setRequestType('permessi')} />
                                <span className="ml-2">Permessi</span>
                            </label>
                        </div>
                    </div>
                    <div className="mt-8 text-right">
                        <button type="submit" className="bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300" disabled={!startDate || !endDate}>
                            Invia Richiesta
                        </button>
                    </div>
                </form>

                <CalendarPreview startDate={startDate} endDate={endDate} allRequests={MOCK_HOLIDAY_REQUESTS} />
                <PastRequestsTable />
            </div>
        </div>
    );
};