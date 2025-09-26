import { GoogleGenAI, Type } from "@google/genai";
import type { DashboardData } from '../types';
import { DocumentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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
    try {
        const response = await ai.models.generateContent({
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