import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, email, institution, role, phone } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !institution || !phone) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    const notifyEmail = process.env.NOTIFICATION_EMAIL;
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    try {
        // 1. Send notification to you (AcadSuite team)
        await resend.emails.send({
            from: `AcadSuite Demo Bot <${senderEmail}>`,
            to: [notifyEmail],
            subject: `🎓 New Demo Request — ${institution}`,
            html: `
                <div style="font-family: Inter, sans-serif; background:#f8f9fc; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto;">
                    <div style="background:#5B4FE8; padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 22px;">📬 New Demo Booking</h1>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 0; color: #6b7280; font-weight: 600; width: 40%;">Full Name</td>
                                <td style="padding: 12px 0; color: #0d1117;">${firstName} ${lastName}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Email</td>
                                <td style="padding: 12px 0;"><a href="mailto:${email}" style="color:#5B4FE8;">${email}</a></td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Institution</td>
                                <td style="padding: 12px 0; color: #0d1117;">${institution}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Role</td>
                                <td style="padding: 12px 0; color: #0d1117;">${role || 'Not specified'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Phone</td>
                                <td style="padding: 12px 0; color: #0d1117;">${phone}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 24px; padding: 12px 16px; background: #ede9fe; border-radius: 8px; font-size: 13px; color: #5B4FE8;">
                            Submitted at ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} (WAT)
                        </div>
                    </div>
                </div>
            `,
        });

        // 2. Send confirmation to the requester
        await resend.emails.send({
            from: `AcadSuite Team <${senderEmail}>`,
            to: [email],
            subject: `We received your demo request, ${firstName}! 🎓`,
            html: `
                <div style="font-family: Inter, sans-serif; background:#f8f9fc; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto;">
                    <div style="background: linear-gradient(135deg, #5B4FE8, #0ea5e9); padding: 32px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🎓 AcadSuite</h1>
                        <p style="color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 15px;">The New Standard in School Management</p>
                    </div>
                    <div style="background: white; padding: 32px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                        <h2 style="color: #0d1117; margin: 0 0 16px; font-size: 20px;">Hi ${firstName}, you're on the list! ✓</h2>
                        <p style="color: #6b7280; line-height: 1.7; margin: 0 0 20px;">
                            Thank you for requesting a demo of <strong style="color: #0d1117;">AcadSuite</strong>. We've received your details and our team will be in touch within <strong style="color: #5B4FE8;">24 hours</strong> to schedule a personalized walkthrough for <em>${institution}</em>.
                        </p>
                        <p style="color: #6b7280; line-height: 1.7; margin: 0 0 28px;">
                            In the meantime, if you have any urgent questions, feel free to reply to this email.
                        </p>
                        <div style="background: #ede9fe; border-radius: 10px; padding: 20px;">
                            <p style="margin: 0; font-size: 13px; color: #5B4FE8; font-weight: 600;">What to expect in your demo:</p>
                            <ul style="margin: 10px 0 0; padding-left: 18px; font-size: 13px; color: #4840d4; line-height: 2;">
                                <li>Live walkthrough of the full platform</li>
                                <li>Q&A session tailored to your school's needs</li>
                                <li>Exclusive early-access pricing overview</li>
                            </ul>
                        </div>
                    </div>
                    <p style="text-align:center; margin-top: 24px; font-size: 12px; color: #9ca3af;">
                        &copy; 2026 AcadSuite. All Rights Reserved.
                    </p>
                </div>
            `,
        });

        return res.status(200).json({ success: true, message: 'Demo request received!' });

    } catch (err) {
        console.error('Email send error:', err);
        return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }
}
