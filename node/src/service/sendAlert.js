// const { DateTime } = require('luxon');
// const schedule = require('node-schedule');
// const { sendEmail } = require('../util/email');
// const db = require('../config/db');

// // Run every minute
// schedule.scheduleJob('* * * * *', async () => {
//     try {
//         const result = await db.query(`
//             SELECT t.*, u.timezone 
//             FROM todo_tasks t 
//             JOIN users u ON t.member_id = u.user_id
//         `);

//         const tasks = result.rows;   // pg returns rows here
//         const nowUtc = DateTime.utc();

//         for (const task of tasks) {
//             const taskStart = DateTime.fromJSDate(new Date(task.start_time), { zone: 'utc' });
//             const taskDeadline = DateTime.fromJSDate(new Date(task.deadline_time), { zone: 'utc' });

//             // Convert now into user's local time
//             const userNow = nowUtc.setZone(task.timezone || 'UTC');

//             let recipientEmail;
//             let senderEmail = task.member_email;

//             const isFriend = task.towho === 'Friend';
//             recipientEmail = isFriend ? task.to_email : senderEmail;

//             const formatBody = (type, type1, type2, type3) => {
//                 const baseMessage = `"${task.title}" has ${type}\n\n${type1} "${task.title}" ${type2}.\n\n📌 Description: ${task.description}\n\n🔥 The Priority is ${task.priority}\n\n${type3}\n\n🎯 You’ve got this!\n\nBest regards, Your Task RemindeMe Bot 💌`;
//                 return isFriend
//                     ? `${baseMessage}\n\nThis reminder was sent to you by your friend: ${senderEmail}`
//                     : baseMessage;
//             };

//             // ✅ START TIME ALERT
//             if (
//                 task.start_status === 'active' &&
//                 !task.start_alert_sent &&
//                 userNow >= taskStart.setZone(task.timezone)
//             ) {
//                 await sendEmail(
//                     recipientEmail,
//                     `📌 Task Started - ${task.title}`,
//                     formatBody(
//                         'officially kicked off 🚀',
//                         'Just a friendly heads-up that your task ',
//                         'is Now in Progress ⏰',
//                         "Let’s make the most of your time and tackle this with focus. Now’s a great moment to plan ahead or set a timer for deep work mode"
//                     )
//                 );
//                 await db.query(
//                     "UPDATE todo_tasks SET start_alert_sent = TRUE WHERE task_id = $1",
//                     [task.task_id]
//                 );
//             }

//             // ⏰ DEADLINE TIME ALERT
//             if (
//                 task.deadline_status === 'active' &&
//                 !task.deadline_alert_sent &&
//                 userNow >= taskDeadline.setZone(task.timezone)
//             ) {
//                 await sendEmail(
//                     recipientEmail,
//                     `⏰ Task Ended - ${task.title}`,
//                     formatBody(
//                         'Reached Its Deadline ⏰',
//                         'Just a quick reminder that your task ',
//                         'has now reached its deadline ⏳',
//                         "✅ If you've already completed it—amazing! If not, there’s no better time than now to finish strong"
//                     )
//                 );
//                 await db.query(
//                     "UPDATE todo_tasks SET deadline_alert_sent = TRUE WHERE task_id = $1",
//                     [task.task_id]
//                 );
//             }
//         }
//     } catch (error) {
//         console.error('❌ Error processing task alerts:', error);
//     }
// });
// scheduler.js - Complete working solution in one file

const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generate beautiful HTML email
const generateEmailHTML = (task, isFriend, senderEmail, alertType) => {
    const isStartAlert = alertType === 'start';
    const statusText = isStartAlert ? 'Started' : 'Deadline Reached';
    const statusIcon = isStartAlert ? 'fa-play-circle' : 'fa-hourglass-end';
    const statusColor = isStartAlert ? '#2d7fb9' : '#b35f3a';
    
    const mainMessage = isStartAlert 
        ? `"${task.title}" has officially kicked off`
        : `"${task.title}" has reached its deadline`;
    
    const secondLine = isStartAlert
        ? 'Just a friendly heads-up that your task is Now in Progress'
        : 'Just a quick reminder that your task has now reached its deadline';
    
    const actionMessage = isStartAlert
        ? 'Make the most of your time and tackle this with focus. Plan ahead or set a timer for deep work mode'
        : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
    const priorityIcon = task.priority.toLowerCase() === 'high' ? 'fa-exclamation-triangle' :
                         task.priority.toLowerCase() === 'medium' ? 'fa-equals' : 'fa-arrow-down';
    const priorityColor = task.priority.toLowerCase() === 'high' ? '#d97747' :
                          task.priority.toLowerCase() === 'medium' ? '#f0b34b' : '#4caf50';
    
    const friendNote = isFriend 
        ? `<div style="background:#ecf3fa;border-radius:18px;padding:16px 22px;margin:22px 0 12px 0;display:flex;align-items:center;gap:12px;border-left:4px solid #3b8cbf;">
            <span style="color:#1d3850;font-size:15px;">
                <span style="color:#2d7fb9;font-size:18px;margin-right:8px;">👤</span> 
                This reminder was sent to you by your friend: <strong>${senderEmail}</strong>
            </span>
        </div>`
        : '';

    const startTime = new Date(task.start_time).toLocaleString();
    const deadlineTime = new Date(task.deadline_time).toLocaleString();

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { 
                background:#f4f7fc; 
                font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding:20px;
            }
            .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.08); }
            .header { background:linear-gradient(135deg, #1a2a3a, #0f1a26); padding:32px 30px 24px; color:#fff; border-bottom:4px solid ${statusColor}; }
            .header h1 { font-size:22px; font-weight:600; display:flex; align-items:center; gap:10px; margin-bottom:8px; }
            .header h1 span { background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:20px; font-size:14px; font-weight:400; }
            .task-title { background:rgba(255,255,255,0.08); padding:8px 18px; border-radius:30px; display:inline-block; border-left:3px solid ${statusColor}; margin-top:6px; }
            .task-title i { margin-right:8px; color:#9ac7f0; }
            .body { padding:30px 30px 20px; }
            .badge { display:inline-block; background:#eef4fa; padding:6px 16px; border-radius:30px; font-size:13px; font-weight:600; color:#1a3852; margin-bottom:16px; }
            .badge i { margin-right:8px; color:${statusColor}; }
            .greeting { font-size:16px; font-weight:500; color:#1c2e3f; margin-bottom:12px; }
            .greeting i { color:#3b8cbf; margin-right:6px; }
            .message-box { background:#f8fafd; padding:20px 22px; border-radius:16px; border:1px solid #e9edf2; margin:16px 0 20px; }
            .message-box p { font-size:15px; color:#1d2c3b; margin-bottom:10px; }
            .highlight { background:#e1ebf5; padding:2px 8px; border-radius:6px; font-weight:500; color:#13547a; }
            .action-box { background:#e3edf7; padding:8px 14px; border-radius:30px; display:inline-block; margin-top:10px; font-size:14px; }
            .action-box i { margin-right:8px; color:#1f6390; }
            .meta-grid { display:flex; flex-wrap:wrap; gap:10px; margin:20px 0 16px; padding-top:16px; border-top:1px solid #e6ecf3; }
            .meta-item { display:flex; align-items:center; gap:8px; font-size:13px; color:#1f3a4f; background:#f5f9ff; padding:4px 14px 4px 10px; border-radius:30px; }
            .meta-item i { color:#3b8cbf; width:16px; font-size:13px; }
            .meta-item strong { font-weight:600; color:#0e2638; margin-right:2px; }
            .closing { margin-top:24px; padding-top:20px; border-top:1px dashed #d4dfea; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
            .closing .signature { display:flex; align-items:center; gap:8px; color:#1f3446; font-size:15px; }
            .closing .signature i { color:#3b8cbf; }
            .footer { background:#f4f8fe; padding:14px 30px; font-size:12px; color:#4f657b; border-top:1px solid #dfe8f2; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }
            .footer i { margin-right:4px; color:#6d8aa8; }
            .footer a { color:#1f5277; text-decoration:none; font-weight:500; }
            @media (max-width:480px) {
                .header { padding:24px 18px 18px; }
                .header h1 { font-size:19px; }
                .body { padding:20px 18px 16px; }
                .message-box { padding:16px; }
                .meta-grid { gap:6px; }
                .meta-item { font-size:12px; padding:3px 10px 3px 8px; }
                .closing { flex-direction:column; align-items:flex-start; }
                .footer { flex-direction:column; align-items:flex-start; padding:12px 18px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>
                    <span>📋</span> Task RemindeMe
                    <span style="font-size:12px;background:rgba(255,255,255,0.15);padding:2px 12px;border-radius:20px;font-weight:400;">v2</span>
                </h1>
                <div class="task-title">
                    <i>📝</i> ${task.title}
                </div>
            </div>
            
            <div class="body">
                <div class="badge">
                    <i class="fas ${statusIcon}"></i> ${statusText}
                </div>
                
                <div class="greeting">
                    <i>👋</i> Hello there,
                </div>
                
                <div class="message-box">
                    <p>
                        <span style="margin-right:6px;">⏰</span>
                        <span class="highlight">"${task.title}"</span> has ${isStartAlert ? 'officially kicked off' : 'reached its deadline'}
                    </p>
                    <p>${secondLine}</p>
                    <p style="margin-top:10px;">
                        <span style="margin-right:6px;">📌</span>
                        <strong>Description:</strong> ${task.description}
                    </p>
                    <p style="margin-top:4px;">
                        <span style="margin-right:6px;">🔥</span>
                        <strong>Priority:</strong> ${task.priority}
                    </p>
                    <div class="action-box">
                        <i>⚡</i> ${actionMessage}
                    </div>
                </div>
                
                <div class="meta-grid">
                    <div class="meta-item">
                        <i>📅</i> <strong>Start:</strong> ${startTime}
                    </div>
                    <div class="meta-item">
                        <i>⏳</i> <strong>Deadline:</strong> ${deadlineTime}
                    </div>
                    <div class="meta-item">
                        <i>🌍</i> <strong>Timezone:</strong> ${task.timezone || 'UTC'}
                    </div>
                </div>
                
                ${friendNote}
                
                <div class="closing">
                    <div class="signature">
                        <i>🤖</i> Your Task RemindeMe Bot
                    </div>
                    <div>
                        <span style="color:#b3435a;margin-right:4px;">❤️</span>
                        <span style="color:#2b4b66;">You've got this!</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div>
                    <i>➡️</i> Task reminder · automated
                </div>
                <div>
                    <i>⚙️</i> <a href="#">preferences</a>
                    <i style="margin-left:12px;">❓</i> <a href="#">help</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Plain text fallback
const generatePlainText = (task, isFriend, senderEmail, alertType) => {
    const isStartAlert = alertType === 'start';
    const type = isStartAlert ? 'officially kicked off' : 'reached its deadline';
    const type1 = isStartAlert ? 'Just a friendly heads-up that your task ' : 'Just a quick reminder that your task ';
    const type2 = isStartAlert ? 'is Now in Progress' : 'has now reached its deadline';
    const type3 = isStartAlert 
        ? 'Make the most of your time and tackle this with focus. Plan ahead or set a timer for deep work mode'
        : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
    let message = `"${task.title}" has ${type}\n\n${type1}"${task.title}" ${type2}.\n\nDescription: ${task.description}\n\nPriority: ${task.priority}\n\n${type3}\n\nYou've got this!\n\nBest regards, Your Task RemindeMe Bot`;
    
    if (isFriend) {
        message += `\n\nThis reminder was sent to you by your friend: ${senderEmail}`;
    }
    
    return message;
};

// Send email function with proper headers
const sendEmail = async (to, subject, htmlContent, textContent) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Task RemindeMe" <noreply@taskremindeme.com>',
            to: to,
            subject: subject,
            html: htmlContent,
            text: textContent,
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
                'X-Priority': '3',
                'X-Mailer': 'Task RemindeMe Bot'
            }
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
        throw error;
    }
};

// Main scheduler
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
                
                const htmlContent = generateEmailHTML(task, isFriend, senderEmail, 'start');
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
                
                const htmlContent = generateEmailHTML(task, isFriend, senderEmail, 'deadline');
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

console.log('🚀 Task reminder scheduler started');