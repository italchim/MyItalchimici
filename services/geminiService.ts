import { GoogleGenAI, Type } from "@google/genai";
import type { DashboardData, SearchResult, TeamMember } from '../types';
import { DocumentType } from '../types';

// --- Vercel Deployment Note ---
// Vercel's Environment Variables are not directly accessible in the browser for static sites
// without a build step. For this deployment to work, you must paste your API key here.
// For a production app, the recommended secure approach is using a "serverless function"
// to act as a proxy, which we can implement in a future step.
const API_KEY = "AIzaSyD1XhOonX0LFqlMI8-4Yh9C8HTwLA1rsfQ";

let ai: GoogleGenAI | null = null;
const getAiClient = () => {
    if (!ai) {
        if (API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE" || !API_KEY) {
            // Return null if the key is not configured. The calling function will handle this.
            return null;
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        announcements: {
            type: Type.ARRAY,
            description: "A list of 3 recent company announcements.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the announcement" },
                    title: { type: Type.STRING, description: "The title of the announcement." },
                    summary: { type: Type.STRING, description: "A brief summary of the announcement." },
                    date: { type: Type.STRING, description: "The date of the announcement in 'Month Day, YYYY' format." }
                },
                required: ["id", "title", "summary", "date"]
            }
        },
        documents: {
            type: Type.ARRAY,
            description: "A list of 5 recent documents, a mix of Google Docs and Google Sheets, created by or shared with 'Alex Chen'.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the document" },
                    title: { type: Type.STRING, description: "The title of the document." },
                    type: { type: Type.STRING, enum: [DocumentType.DOCS, DocumentType.SHEETS], description: "The type of the document." },
                    lastEdited: { type: Type.STRING, description: "How long ago the document was edited, e.g., '2 hours ago'." },
                    owner: { type: Type.STRING, description: "The name of the document owner. Can be 'Alex Chen' or someone else." }
                },
                required: ["id", "title", "type", "lastEdited", "owner"]
            }
        },
        emails: {
            type: Type.ARRAY,
            description: "A list of 4 recent corporate emails for 'Alex Chen'.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the email" },
                    sender: { type: Type.STRING, description: "The name of the email sender." },
                    subject: { type: Type.STRING, description: "The subject line of the email." },
                    snippet: { type: Type.STRING, description: "A short snippet from the email body." },
                    timestamp: { type: Type.STRING, description: "The time the email was received, e.g., '10:45 AM'." }
                },
                required: ["id", "sender", "subject", "snippet", "timestamp"]
            }
        },
        holidayRequests: {
            type: Type.ARRAY,
            description: "A list of 8 approved holiday or sick leave requests for various employees for the current month.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the request" },
                    userName: { type: Type.STRING, description: "The name of the employee." },
                    startDate: { type: Type.STRING, description: "The start date of the leave in YYYY-MM-DD format." },
                    endDate: { type: Type.STRING, description: "The end date of the leave in YYYY-MM-DD format." },
                    type: { type: Type.STRING, enum: ['Holiday', 'Sick Leave'], description: "The type of leave." },
                    status: { type: Type.STRING, enum: ['Approved'], description: "The status of the request." }
                },
                required: ["id", "userName", "startDate", "endDate", "type", "status"]
            }
        },
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 5 user-submitted suggestions for company improvement.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the suggestion" },
                    area: { type: Type.STRING, enum: ['HR', 'IT', 'Office Management', 'Productivity'], description: "The area of intervention for the suggestion." },
                    suggestion: { type: Type.STRING, description: "The core suggestion text." },
                    motivation: { type: Type.STRING, description: "The motivation behind the suggestion." },
                    submittedBy: { type: Type.STRING, description: "The name of the employee who submitted it." },
                    date: { type: Type.STRING, description: "The submission date in 'Month Day, YYYY' format." }
                },
                required: ["id", "area", "suggestion", "motivation", "submittedBy", "date"]
            }
        },
        forumThreads: {
            type: Type.ARRAY,
            description: "A list of 4 active forum threads on various corporate topics.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique ID for the thread." },
                    title: { type: Type.STRING, description: "The title of the discussion thread." },
                    authorName: { type: Type.STRING, description: "Name of the user who started the thread." },
                    authorAvatarUrl: { type: Type.STRING, description: "A picsum.photos URL for the author's avatar." },
                    createdAt: { type: Type.STRING, description: "Relative time of thread creation, e.g., '2 days ago'." },
                    postCount: { type: Type.INTEGER, description: "Total number of posts in the thread." },
                    lastReply: {
                        type: Type.OBJECT,
                        properties: {
                            authorName: { type: Type.STRING, description: "Name of the last user who replied." },
                            timestamp: { type: Type.STRING, description: "Relative time of the last reply, e.g., '30 minutes ago'." },
                        },
                        required: ["authorName", "timestamp"]
                    },
                    posts: {
                        type: Type.ARRAY,
                        description: "A list of posts within the thread, starting with the original post.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "Unique ID for the post." },
                                authorName: { type: Type.STRING, description: "Name of the post's author." },
                                authorAvatarUrl: { type: Type.STRING, description: "A picsum.photos URL for the post author's avatar." },
                                content: { type: Type.STRING, description: "The text content of the post." },
                                timestamp: { type: Type.STRING, description: "Relative time of the post, e.g., '1 hour ago'." },
                            },
                             required: ["id", "authorName", "authorAvatarUrl", "content", "timestamp"]
                        }
                    }
                },
                required: ["id", "title", "authorName", "authorAvatarUrl", "createdAt", "postCount", "lastReply", "posts"]
            }
        }
    },
    required: ["announcements", "documents", "emails", "holidayRequests", "suggestions", "forumThreads"]
};

export const generateDashboardContent = async (): Promise<DashboardData> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        throw new Error("API key not configured. Please add your key to services/geminiService.ts");
    }

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate realistic mock data for a corporate intranet dashboard for a user named Alex Chen. The company is a mid-sized tech firm. Include company announcements, recent documents (owned by or shared with Alex Chen), corporate emails, approved team holiday/sick leave requests, a few user-submitted suggestions, and some active forum discussion threads.",
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text;
        const parsedData = JSON.parse(jsonText);

        // Basic validation
        if (!parsedData.announcements || !parsedData.documents || !parsedData.emails || !parsedData.holidayRequests || !parsedData.suggestions || !parsedData.forumThreads) {
            throw new Error("Invalid data structure received from API.");
        }
        
        return parsedData as DashboardData;

    } catch (error) {
        console.error("Error generating dashboard content:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};

const searchResponseSchema = {
    type: Type.OBJECT,
    properties: {
        announcements: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        documents: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        emails: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        forumThreads: { type: Type.ARRAY, items: { type: Type.OBJECT } },
    }
};

export const performSearch = async (query: string, data: DashboardData): Promise<SearchResult> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        throw new Error("API key not configured.");
    }

    const context = JSON.stringify(data);
    const prompt = `You are an intelligent search engine for a corporate intranet. Search through the following JSON data for items that are relevant to the user's query.
    
    User Query: "${query}"
    
    Intranet Data (JSON):
    ${context}
    
    Return a JSON object containing arrays of the matching items, structured exactly like the original data. The object should only contain items that are highly relevant to the query. If no relevant items are found for a category, return an empty array for that category.`;

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: searchResponseSchema,
            },
        });

        const jsonText = response.text;
        const parsedData = JSON.parse(jsonText);

        return {
            announcements: parsedData.announcements || [],
            documents: parsedData.documents || [],
            emails: parsedData.emails || [],
            forumThreads: parsedData.forumThreads || [],
        } as SearchResult;
    } catch (error) {
        console.error("Error performing search:", error);
        throw new Error("Failed to communicate with the Gemini API for search.");
    }
};

export const askPolicyQuestion = async (question: string): Promise<string> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        throw new Error("API key not configured.");
    }

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question,
            config: {
                systemInstruction: "You are a helpful and friendly AI assistant for the company Italchimici. Your role is to answer employee questions about company policies and procedures. Provide clear, concise answers based on standard corporate policies. If you don't know the answer, say that you don't have information on that topic and recommend contacting HR. Always start your first response on a new session with a friendly welcome. End your responses by reminding the user to confirm critical information with their manager or the HR department.",
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error asking policy question:", error);
        throw new Error("Failed to get an answer from the AI assistant.");
    }
};

const teamDirectorySchema = {
    type: Type.ARRAY,
    description: "A list of 25-30 employees for a corporate directory.",
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "Unique ID for the employee" },
            name: { type: Type.STRING, description: "Full name of the employee." },
            role: { type: Type.STRING, description: "Job title of the employee." },
            avatarUrl: { type: Type.STRING, description: "A picsum.photos URL for the employee's avatar, using a unique seed for each." },
            department: { type: Type.STRING, enum: ['Engineering', 'Product', 'Design', 'Marketing', 'HR'], description: "The department the employee belongs to." },
            email: { type: Type.STRING, description: "The employee's corporate email address." },
            phone: { type: Type.STRING, description: "The employee's phone number in (XXX) XXX-XXXX format." },
        },
        required: ["id", "name", "role", "avatarUrl", "department", "email", "phone"]
    }
};

export const generateTeamDirectory = async (): Promise<TeamMember[]> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        throw new Error("API key not configured.");
    }

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a list of 28 realistic employees for a mid-sized tech company's team directory. Ensure a good mix of roles and departments.",
            config: {
                responseMimeType: "application/json",
                responseSchema: teamDirectorySchema,
            },
        });

        const jsonText = response.text;
        return JSON.parse(jsonText) as TeamMember[];

    } catch (error) {
        console.error("Error generating team directory:", error);
        throw new Error("Failed to fetch the team directory from the Gemini API.");
    }
};
