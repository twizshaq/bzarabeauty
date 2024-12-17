import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get("name")?.toString() || "";
        const contactNumber = formData.get("contactNumber")?.toString() || "";
        const location = formData.get("location")?.toString() || "";
        const service = formData.get("service")?.toString() || "";
        const comments = formData.get("comments")?.toString() || "";
        const start = formData.get("start")?.toString() || "";
        const end = formData.get("end")?.toString() || "";

        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');
        const calendarId = process.env.GOOGLE_CALENDAR_ID!;

            const auth = new google.auth.JWT(
            serviceAccountEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/calendar']
        );

        const calendar = google.calendar({ version: 'v3', auth });

        const event = {
            summary: `Appointment: ${service} for ${name}`,
            location: location,
            description: `Name: ${name}\nContact: ${contactNumber}\nService: ${service}\nComments: ${comments}`,
            start: { dateTime: start },
            end: { dateTime: end },
        };
            const response = await calendar.events.insert({
            calendarId,
            requestBody: event
            });

        return NextResponse.json({ message: 'Event created', data: response.data }, { status: 200 });


    } catch (error:any) {
            console.error("Failed to create Google Calendar event:", error);
            return NextResponse.json({ message: "Failed to create event", error: error.message }, {status:500});
    }
}