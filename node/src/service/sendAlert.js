

const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "meanleapha@gmail.com",
        pass: "wdzdwgybtompthov"
    }
});

// Generate beautiful HTML email template
const generateHTMLEmail = (task, isFriend, senderEmail, alertType) => {
    const isStartAlert = alertType === 'start';
    const statusText = isStartAlert ? 'Started' : 'Deadline Reached';
    const statusColor = isStartAlert ? '#2d7fb9' : '#b35f3a';
    const statusIcon = isStartAlert ? '🚀' : '⏰';
    
    const mainMessage = isStartAlert 
        ? `"${task.title}" has officially kicked off`
        : `"${task.title}" has reached its deadline`;
    
    const secondLine = isStartAlert
        ? 'Just a friendly heads-up that your task is Now in Progress'
        : 'Just a quick reminder that your task has now reached its deadline';
    
    const actionMessage = isStartAlert
        ? 'Let\'s make the most of your time and tackle this with focus. Now\'s a great moment to plan ahead or set a timer for deep work mode'
        : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
    const priorityColor = task.priority.toLowerCase() === 'high' ? '#d97747' :
                          task.priority.toLowerCase() === 'medium' ? '#f0b34b' : '#4caf50';
    
    const priorityEmoji = task.priority.toLowerCase() === 'high' ? '🔴' :
                          task.priority.toLowerCase() === 'medium' ? '🟡' : '🟢';
    
    const friendNote = isFriend 
        ? `<div style="background:#ecf3fa;border-radius:12px;padding:14px 20px;margin:20px 0 12px 0;border-left:4px solid #3b8cbf;">
            <span style="color:#1d3850;font-size:15px;">
                👤 This reminder was sent to you by your friend: <strong>${senderEmail}</strong>
            </span>
        </div>`
        : '';

    const startTime = new Date(task.start_time).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const deadlineTime = new Date(task.deadline_time).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f7fc;padding:20px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg, #1a2a3a, #0f1a26);padding:32px 30px 24px;border-bottom:4px solid ${statusColor};">
                            <h1 style="color:#ffffff;font-size:24px;font-weight:600;margin:0 0 8px 0;">
                                📋 Task RemindeMe
                            </h1>
                            <div style="background:rgba(255,255,255,0.08);padding:8px 18px;border-radius:30px;display:inline-block;border-left:3px solid ${statusColor};margin-top:6px;">
                                <span style="color:#ffffff;font-size:16px;">📝 ${task.title}</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding:30px 30px 20px;">
                            <!-- Status Badge -->
                            <div style="display:inline-block;background:#eef4fa;padding:6px 16px;border-radius:30px;font-size:13px;font-weight:600;color:#1a3852;margin-bottom:16px;">
                                ${statusIcon} ${statusText}
                            </div>
                            
                            <!-- Greeting -->
                            <div style="font-size:16px;font-weight:500;color:#1c2e3f;margin-bottom:12px;">
                                👋 Hello there,
                            </div>
                            
                            <!-- Message Box -->
                            <div style="background:#f8fafd;padding:20px 22px;border-radius:16px;border:1px solid #e9edf2;margin:16px 0 20px;">
                                <p style="font-size:15px;color:#1d2c3b;margin-bottom:10px;">
                                    ⏰ <span style="background:#e1ebf5;padding:2px 8px;border-radius:6px;font-weight:500;color:#13547a;">"${task.title}"</span> has ${isStartAlert ? 'officially kicked off' : 'reached its deadline'}
                                </p>
                                <p style="font-size:15px;color:#1d2c3b;margin-bottom:10px;">${secondLine}</p>
                                <p style="font-size:15px;color:#1d2c3b;margin-top:10px;">
                                    📌 <strong>Description:</strong> ${task.description}
                                </p>
                                <p style="font-size:15px;color:#1d2c3b;margin-top:4px;">
                                    ${priorityEmoji} <strong>Priority:</strong> ${task.priority}
                                </p>
                                <div style="background:#e3edf7;padding:8px 14px;border-radius:30px;display:inline-block;margin-top:10px;font-size:14px;">
                                    ⚡ ${actionMessage}
                                </div>
                            </div>
                            
                            <!-- Meta Grid -->
                            <div style="display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 16px;padding-top:16px;border-top:1px solid #e6ecf3;">
                                <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1f3a4f;background:#f5f9ff;padding:4px 14px 4px 10px;border-radius:30px;">
                                    📅 <strong>Start:</strong> ${startTime}
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1f3a4f;background:#f5f9ff;padding:4px 14px 4px 10px;border-radius:30px;">
                                    ⏳ <strong>Deadline:</strong> ${deadlineTime}
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1f3a4f;background:#f5f9ff;padding:4px 14px 4px 10px;border-radius:30px;">
                                    🌍 <strong>Timezone:</strong> ${task.timezone || 'UTC'}
                                </div>
                            </div>
                            
                            <!-- Friend Note -->
                            ${friendNote}
                            
                            <!-- Closing -->
                            <div style="margin-top:24px;padding-top:20px;border-top:1px dashed #d4dfea;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                                <div style="display:flex;align-items:center;gap:8px;color:#1f3446;font-size:15px;">
                                    🤖 Your Task RemindeMe Bot
                                </div>
                                <div>
                                    ❤️ <span style="color:#2b4b66;">You've got this!</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background:#f4f8fe;padding:14px 30px;font-size:12px;color:#4f657b;border-top:1px solid #dfe8f2;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>➡️ Task reminder · automated</td>
                                    <td align="right">
                                        ⚙️ <a href="#" style="color:#1f5277;text-decoration:none;font-weight:500;">preferences</a>
                                        &nbsp;&nbsp;❓ <a href="#" style="color:#1f5277;text-decoration:none;font-weight:500;">help</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

// Generate plain text fallback
const generatePlainText = (task, isFriend, senderEmail, alertType) => {
    const isStartAlert = alertType === 'start';
    const type = isStartAlert ? 'officially kicked off' : 'reached its deadline';
    const type1 = isStartAlert ? 'Just a friendly heads-up that your task ' : 'Just a quick reminder that your task ';
    const type2 = isStartAlert ? 'is Now in Progress' : 'has now reached its deadline';
    const type3 = isStartAlert 
        ? 'Let\'s make the most of your time and tackle this with focus. Now\'s a great moment to plan ahead or set a timer for deep work mode'
        : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
    let message = `"${task.title}" has ${type}\n\n${type1}"${task.title}" ${type2}.\n\nDescription: ${task.description}\n\nPriority: ${task.priority}\n\n${type3}\n\nYou've got this!\n\nBest regards, Your Task RemindeMe Bot`;
    
    if (isFriend) {
        message += `\n\nThis reminder was sent to you by your friend: ${senderEmail}`;
    }
    
    return message;
};

// Send email with HTML and plain text
const sendEmail = async (to, subject, htmlContent, textContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"RemindWho Bot" <meanleapha@gmail.com>`,
            to,
            subject,
            html: htmlContent,
            text: textContent
        });
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

// Run every minute
schedule.scheduleJob('* * * * *', async () => {
    try {
        console.log('🔄 Checking for task alerts...');
        
        const result = await db.query(`
            SELECT t.*, u.timezone 
            FROM todo_tasks t 
            JOIN users u ON t.member_id = u.user_id
        `);

        const tasks = result.rows;
        const nowUtc = DateTime.utc();

        for (const task of tasks) {
            const taskStart = DateTime.fromJSDate(new Date(task.start_time), { zone: 'utc' });
            const taskDeadline = DateTime.fromJSDate(new Date(task.deadline_time), { zone: 'utc' });
            const userNow = nowUtc.setZone(task.timezone || 'UTC');

            let recipientEmail;
            let senderEmail = task.member_email;
            const isFriend = task.towho === 'Friend';
            recipientEmail = isFriend ? task.to_email : senderEmail;

            // START TIME ALERT
            if (
                task.start_status === 'active' &&
                !task.start_alert_sent &&
                userNow >= taskStart.setZone(task.timezone)
            ) {
                console.log(`📤 Sending start alert for: ${task.title}`);
                
                const htmlContent = generateHTMLEmail(task, isFriend, senderEmail, 'start');
                const textContent = generatePlainText(task, isFriend, senderEmail, 'start');
                
                await sendEmail(
                    recipientEmail,
                    `Task Started - ${task.title}`,
                    htmlContent,
                    textContent
                );
                
                await db.query(
                    "UPDATE todo_tasks SET start_alert_sent = TRUE WHERE task_id = $1",
                    [task.task_id]
                );
                
                console.log(`✅ Start alert sent for: ${task.title}`);
            }

            // DEADLINE TIME ALERT
            if (
                task.deadline_status === 'active' &&
                !task.deadline_alert_sent &&
                userNow >= taskDeadline.setZone(task.timezone)
            ) {
                console.log(`📤 Sending deadline alert for: ${task.title}`);
                
                const htmlContent = generateHTMLEmail(task, isFriend, senderEmail, 'deadline');
                const textContent = generatePlainText(task, isFriend, senderEmail, 'deadline');
                
                await sendEmail(
                    recipientEmail,
                    `Task Deadline Reached - ${task.title}`,
                    htmlContent,
                    textContent
                );
                
                await db.query(
                    "UPDATE todo_tasks SET deadline_alert_sent = TRUE WHERE task_id = $1",
                    [task.task_id]
                );
                
                console.log(`✅ Deadline alert sent for: ${task.title}`);
            }
        }
        
        console.log('✅ Alert check completed');
    } catch (error) {
        console.error('❌ Error processing task alerts:', error);
    }
});

console.log('🚀 Task reminder scheduler started successfully!');