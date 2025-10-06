import type { User, CalendarEvent, Email, Task, GoogleFile, ProcedureDoc, ForumPost, Page, HolidayRequest, NewsArticle } from './types';

export const MOCK_USER: User = {
  name: 'Mario Rossi',
  email: 'mario.rossi@italchimici.it',
  avatarUrl: 'https://picsum.photos/seed/maro/100/100',
};

export const MOCK_EMPLOYEES: User[] = [
    MOCK_USER,
    { name: 'Laura Bianchi', email: 'laura.bianchi@italchimici.it', avatarUrl: 'https://picsum.photos/seed/labi/100/100' },
    { name: 'Giovanni Verdi', email: 'giovanni.verdi@italchimici.it', avatarUrl: 'https://picsum.photos/seed/give/100/100' },
    { name: 'Giulia Neri', email: 'giulia.neri@italchimici.it', avatarUrl: 'https://picsum.photos/seed/gner/100/100' },
    { name: 'Marco Esposito', email: 'marco.esposito@italchimici.it', avatarUrl: 'https://picsum.photos/seed/maes/100/100' },
    { name: 'Sara Romano', email: 'sara.romano@italchimici.it', avatarUrl: 'https://picsum.photos/seed/saro/100/100' },
    { name: 'Alessandro Russo', email: 'alessandro.russo@italchimici.it', avatarUrl: 'https://picsum.photos/seed/alru/100/100' },
    { name: 'Francesca Costa', email: 'francesca.costa@italchimici.it', avatarUrl: 'https://picsum.photos/seed/frco/100/100' },
];


export const NAV_ITEMS: { id: Page; label: string; }[] = [
  { id: 'home', label: 'Homepage' },
  { id: 'docs', label: 'Documenti' },
  { id: 'sheets', label: 'Fogli' },
  { id: 'procedures', label: 'Procedure e Qualità' },
  { id: 'forum', label: 'Forum' },
  { id: 'holidays', label: 'Richiesta Ferie & Permessi'},
];

export const MOCK_NEWS: NewsArticle[] = [
  { 
    id: '1', 
    title: 'Annuncio Risultati Finanziari Q3', 
    excerpt: 'Siamo lieti di annunciare una forte crescita nel terzo trimestre...', 
    content: 'Siamo lieti di annunciare una forte crescita nel terzo trimestre, con un aumento del 15% del fatturato rispetto allo stesso periodo dell\'anno precedente. Questo successo è il risultato del duro lavoro di tutti i reparti e del successo del lancio del nostro nuovo prodotto, "Solutio Maxima". Un ringraziamento speciale al team di vendita per aver superato gli obiettivi del 25%. I dettagli completi saranno presentati durante la riunione plenaria di venerdì.',
    date: '26 Ottobre 2023',
    readBy: ['giovanni.verdi@italchimici.it', 'laura.bianchi@italchimici.it', 'sara.romano@italchimici.it']
  },
  { 
    id: '2', 
    title: 'Inaugurazione Nuova Sede di Milano', 
    excerpt: 'Unisciti a noi per la grande inaugurazione della nostra nuova e moderna sede a Milano.', 
    content: 'Unisciti a noi per la grande inaugurazione della nostra nuova e moderna sede a Milano il 15 novembre. L\'evento inizierà alle 18:00 con un discorso del nostro CEO, seguito da un rinfresco e un tour dei nuovi uffici. Si prega di confermare la propria presenza entro il 10 novembre per facilitare l\'organizzazione. La nuova sede si trova in Via della Tecnologia, 123.',
    date: '20 Ottobre 2023',
    readBy: ['giovanni.verdi@italchimici.it', 'laura.bianchi@italchimici.it', 'giulia.neri@italchimici.it', 'marco.esposito@italchimici.it', 'sara.romano@italchimici.it', 'alessandro.russo@italchimici.it', 'francesca.costa@italchimici.it']
  },
  { 
    id: '3', 
    title: 'Ritiro Aziendale Annuale a Dicembre', 
    excerpt: 'Preparatevi per un ritiro all\'insegna del divertimento nella splendida regione Toscana.', 
    content: 'Il ritiro aziendale di quest\'anno si terrà dal 5 al 7 dicembre presso l\'Agriturismo "Le Colline Incantate" in Toscana. L\'agenda include workshop di team building, attività all\'aperto e una cena di gala. L\'alloggio e i pasti saranno completamente coperti dall\'azienda. Maggiori dettagli sull\'agenda e le modalità di trasporto seguiranno a breve. Preparatevi per un\'esperienza indimenticabile!',
    date: '15 Ottobre 2023',
    readBy: []
  },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', time: '10:00 - 11:00', title: 'Sincronizzazione Settimanale Team Vendite', description: 'Discussione sulla pipeline e strategia del Q4.' },
  { id: '2', time: '14:00 - 15:30', title: 'Progetto Phoenix - Comitato Direttivo', description: 'Revisione delle tappe e dei rischi del progetto.' },
  { id: '3', time: '16:00 - 16:30', title: '1-on-1 con Laura Bianchi', description: 'Sessione di revisione delle performance e feedback.' },
];

export const MOCK_EMAILS: Email[] = [
  { id: '1', sender: 'Ufficio Risorse Umane', subject: 'Importante: Revisione Annuale delle Performance', snippet: 'Si prega di completare l\'autovalutazione entro la fine della giornata di venerdì...', isRead: false },
  { id: '2', sender: 'Supporto IT', subject: 'Manutenzione Programmata per Sabato', snippet: 'I nostri sistemi non saranno disponibili per manutenzione programmata...', isRead: false },
  { id: '3', sender: 'Giovanni Verdi', subject: 'Re: Budget Marketing Q4', snippet: 'Grazie per averlo inviato, ho alcune domande...', isRead: true },
  { id: '4', sender: 'Comitato Sociale', subject: 'Festa di Halloween!', snippet: 'Non dimenticate di confermare la vostra partecipazione alla nostra festa annuale...', isRead: false },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Finalizzare report vendite Q4', dueDate: 'Domani', isCompleted: false },
  { id: '2', title: 'Preparare presentazione per riunione cliente', dueDate: 'Tra 3 giorni', isCompleted: false },
  { id: '3', title: 'Inviare nota spese', dueDate: 'La prossima settimana', isCompleted: false },
  { id: '4', title: 'Onboarding nuovo assunto', dueDate: 'Ieri', isCompleted: true },
];

export const MOCK_DOCS_OWNED: GoogleFile[] = [
  { id: '1', name: 'Strategia Marketing Q4', owner: 'io', lastModified: '2 ore fa', url: '#' },
  { id: '2', name: 'Progetto Phoenix - Specifiche', owner: 'io', lastModified: 'Ieri', url: '#' },
  { id: '3', name: 'Note Riunione - 2023-10-25', owner: 'io', lastModified: '2 giorni fa', url: '#' },
];

export const MOCK_DOCS_SHARED: GoogleFile[] = [
  { id: '4', name: 'Dashboard Performance Vendite', owner: 'Laura Bianchi', lastModified: '5 minuti fa', url: '#' },
  { id: '5', name: 'Analisi Concorrenza', owner: 'Giovanni Verdi', lastModified: '3 giorni fa', url: '#' },
];

export const MOCK_SHEETS_OWNED: GoogleFile[] = [
  { id: '1', name: 'Tracker Budget 2023', owner: 'io', lastModified: '1 ora fa', url: '#' },
  { id: '2', name: 'Pipeline Vendite Q4', owner: 'io', lastModified: 'Ieri', url: '#' },
];

export const MOCK_SHEETS_SHARED: GoogleFile[] = [
  { id: '3', name: 'OKR Aziendali Q4 2023', owner: 'Direzione', lastModified: '4 ore fa', url: '#' },
  { id: '4', name: 'KPI Campagna Marketing', owner: 'Giovanni Verdi', lastModified: '5 giorni fa', url: '#' },
];

export const MOCK_PROCEDURE_DOCS: ProcedureDoc[] = [
  { id: '1', name: 'Guida Onboarding Dipendenti', category: 'Risorse Umane', content: 'Benvenuto in Italchimici! Questa guida copre la tua prima settimana, i documenti richiesti e un\'introduzione ai nostri strumenti. Il tuo manager programmerà incontri con i membri chiave del team. Si prega di compilare i moduli HR sull\'intranet entro il secondo giorno.' },
  { id: '2', name: 'Policy Nota Spese', category: 'Finanza', content: 'Tutte le spese devono essere inviate tramite il portale finanziario entro 30 giorni. Le ricevute sono richieste per tutte le transazioni superiori a 25 €. Le spese di viaggio richiedono l\'approvazione preventiva del capo dipartimento. I rimborsi vengono elaborati il 15 e il 30 di ogni mese.' },
  { id: '3', name: 'Best Practice Sicurezza IT', category: 'IT', content: 'Utilizzare password complesse e uniche per tutti i sistemi. Abilitare l\'autenticazione a due fattori (2FA) dove disponibile. Non condividere le proprie credenziali. Segnalare immediatamente qualsiasi email sospetta all\'helpdesk IT. Tutti i dispositivi aziendali devono avere installato un software antivirus approvato.' },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Nuova macchina del caffè nell\'area relax!',
    author: { name: 'Giulia Neri', email: 'giulia.neri@italchimici.it', avatarUrl: 'https://picsum.photos/seed/gner/100/100' },
    content: 'Volevo solo far sapere a tutti che l\'IT ha installato una nuova fantastica macchina del caffè al secondo piano. Fa un ottimo espresso!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c1', author: MOCK_USER, content: 'Ottima notizia!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ],
  },
  {
    id: '2',
    title: 'Domanda sul nuovo sistema di nota spese',
    author: MOCK_USER,
    content: 'Sto riscontrando problemi nell\'inviare le mie spese con il nuovo portale. Qualcuno della finanza può aiutarmi? Ricevo un errore "Centro di Costo non valido".',
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    comments: [
       { id: 'c2', author: { name: 'Team Finanza', email: 'finance@italchimici.it', avatarUrl: 'https://picsum.photos/seed/fite/100/100' }, content: 'Ciao Mario, assicurati di utilizzare i nuovi codici dei centri di costo distribuiti la scorsa settimana. Te li invierò direttamente via email.', timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
       { id: 'c3', author: MOCK_USER, content: 'Grazie! Ha funzionato.', timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString() }
    ],
  }
];

export const MOCK_HOLIDAY_REQUESTS: HolidayRequest[] = [
  { id: '4', type: 'ferie', startDate: '2024-08-05T09:00:00Z', endDate: '2024-08-09T18:00:00Z', status: 'In attesa' },
  { id: '3', type: 'permessi', startDate: '2024-07-15T10:00:00Z', endDate: '2024-07-15T12:00:00Z', status: 'Approvata' },
  { id: '2', type: 'ferie', startDate: '2024-06-03T09:00:00Z', endDate: '2024-06-03T18:00:00Z', status: 'Respinta' },
  { id: '1', type: 'ferie', startDate: '2024-04-26T09:00:00Z', endDate: '2024-04-26T18:00:00Z', status: 'Approvata' },
];