

// const { DateTime } = require('luxon');
// const schedule = require('node-schedule');
// const nodemailer = require('nodemailer');
// const db = require('../config/db');

// // Email transporter configuration
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: "meanleapha@gmail.com",
//         pass: "wdzdwgybtompthov"
//     }
// });

// // Generate beautiful HTML email template
// const generateHTMLEmail = (task, isFriend, senderEmail, alertType) => {
//     const isStartAlert = alertType === 'start';
//     const statusText = isStartAlert ? 'Started' : 'Deadline Reached';
//     const statusColor = isStartAlert ? '#2d7fb9' : '#b35f3a';
//     const statusIcon = isStartAlert ? '🚀' : '⏰';
    
//     const mainMessage = isStartAlert 
//         ? `"${task.title}" has officially kicked off`
//         : `"${task.title}" has reached its deadline`;
    
//     const secondLine = isStartAlert
//         ? 'Just a friendly heads-up that your task is Now in Progress'
//         : 'Just a quick reminder that your task has now reached its deadline';
    
//     const actionMessage = isStartAlert
//         ? 'Let\'s make the most of your time and tackle this with focus. Now\'s a great moment to plan ahead or set a timer for deep work mode'
//         : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
//     const priorityColor = task.priority.toLowerCase() === 'high' ? '#d97747' :
//                           task.priority.toLowerCase() === 'medium' ? '#f0b34b' : '#4caf50';
    
//     const priorityEmoji = task.priority.toLowerCase() === 'high' ? '🔴' :
//                           task.priority.toLowerCase() === 'medium' ? '🟡' : '🟢';
    
//     const friendNote = isFriend 
//         ? `<div style="background:#ecf3fa;border-radius:12px;padding:14px 20px;margin:20px 0 12px 0;border-left:4px solid #3b8cbf;">
//             <span style="color:#1d3850;font-size:15px;">
//                 👤 This reminder was sent to you by your friend: <strong>${senderEmail}</strong>
//             </span>
//         </div>`
//         : '';

//     const startTime = new Date(task.start_time).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });
    
//     const deadlineTime = new Date(task.deadline_time).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     return `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Task Reminder</title>
// </head>
// <body style="margin:0;padding:0;background:#f4f7fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
//     <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f7fc;padding:20px;">
//         <tr>
//             <td align="center">
//                 <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
//                     <!-- Header -->
//                     <tr>
//                         <td style="background:linear-gradient(135deg, #1a2a3a, #0f1a26);padding:32px 30px 24px;border-bottom:4px solid ${statusColor};">
//                             <h1 style="color:#ffffff;font-size:24px;font-weight:600;margin:0 0 8px 0;">
//                                 📋 Task RemindeMe
//                             </h1>
//                             <div style="background:rgba(255,255,255,0.08);padding:8px 18px;border-radius:30px;display:inline-block;border-left:3px solid ${statusColor};margin-top:6px;">
//                                 <span style="color:#ffffff;font-size:16px;">📝 ${task.title}</span>
//                             </div>
//                         </td>
//                     </tr>
                    
//                     <!-- Body -->
//                     <tr>
//                         <td style="padding:30px 30px 20px;">
//                             <!-- Status Badge -->
//                             <div style="display:inline-block;background:#eef4fa;padding:6px 16px;border-radius:30px;font-size:13px;font-weight:600;color:#1a3852;margin-bottom:16px;">
//                                 ${statusIcon} ${statusText}
//                             </div>
                            
//                             <!-- Greeting -->
//                             <div style="font-size:16px;font-weight:500;color:#1c2e3f;margin-bottom:12px;">
//                                 👋 Hello there,
//                             </div>
                            
//                             <!-- Message Box -->
//                             <div style="background:#f8fafd;padding:20px 22px;border-radius:16px;border:1px solid #e9edf2;margin:16px 0 20px;">
//                                 <p style="font-size:15px;color:#1d2c3b;margin-bottom:10px;">
//                                     ⏰ <span style="background:#e1ebf5;padding:2px 8px;border-radius:6px;font-weight:500;color:#13547a;">"${task.title}"</span> has ${isStartAlert ? 'officially kicked off' : 'reached its deadline'}
//                                 </p>
//                                 <p style="font-size:15px;color:#1d2c3b;margin-bottom:10px;">${secondLine}</p>
//                                 <p style="font-size:15px;color:#1d2c3b;margin-top:10px;">
//                                     📌 <strong>Description:</strong> ${task.description}
//                                 </p>
//                                 <p style="font-size:15px;color:#1d2c3b;margin-top:4px;">
//                                     ${priorityEmoji} <strong>Priority:</strong> ${task.priority}
//                                 </p>
//                                 <div style="background:#e3edf7;padding:8px 14px;border-radius:30px;display:inline-block;margin-top:10px;font-size:14px;">
//                                     ⚡ ${actionMessage}
//                                 </div>
//                             </div>
                            
//                             <!-- Meta Grid -->
//                             <div style="display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 16px;padding-top:16px;border-top:1px solid #e6ecf3;">
//                                 <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1f3a4f;background:#f5f9ff;padding:4px 14px 4px 10px;border-radius:30px;">
//                                     📅 <strong>Start:</strong> ${startTime}
//                                 </div>
//                                 <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1f3a4f;background:#f5f9ff;padding:4px 14px 4px 10px;border-radius:30px;">
//                                     ⏳ <strong>Deadline:</strong> ${deadlineTime}
//                                 </div>
//                                 <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1f3a4f;background:#f5f9ff;padding:4px 14px 4px 10px;border-radius:30px;">
//                                     🌍 <strong>Timezone:</strong> ${task.timezone || 'UTC'}
//                                 </div>
//                             </div>
                            
//                             <!-- Friend Note -->
//                             ${friendNote}
                            
//                             <!-- Closing -->
//                             <div style="margin-top:24px;padding-top:20px;border-top:1px dashed #d4dfea;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
//                                 <div style="display:flex;align-items:center;gap:8px;color:#1f3446;font-size:15px;">
//                                     🤖 Your Task RemindeMe Bot
//                                 </div>
//                                 <div>
//                                     ❤️ <span style="color:#2b4b66;">You've got this!</span>
//                                 </div>
//                             </div>
//                         </td>
//                     </tr>
                    
//                     <!-- Footer -->
//                     <tr>
//                         <td style="background:#f4f8fe;padding:14px 30px;font-size:12px;color:#4f657b;border-top:1px solid #dfe8f2;">
//                             <table cellpadding="0" cellspacing="0" border="0" width="100%">
//                                 <tr>
//                                     <td>➡️ Task reminder · automated</td>
//                                     <td align="right">
//                                         ⚙️ <a href="#" style="color:#1f5277;text-decoration:none;font-weight:500;">preferences</a>
//                                         &nbsp;&nbsp;❓ <a href="#" style="color:#1f5277;text-decoration:none;font-weight:500;">help</a>
//                                     </td>
//                                 </tr>
//                             </table>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//     </table>
// </body>
// </html>
//     `;
// };

// // Generate plain text fallback
// const generatePlainText = (task, isFriend, senderEmail, alertType) => {
//     const isStartAlert = alertType === 'start';
//     const type = isStartAlert ? 'officially kicked off' : 'reached its deadline';
//     const type1 = isStartAlert ? 'Just a friendly heads-up that your task ' : 'Just a quick reminder that your task ';
//     const type2 = isStartAlert ? 'is Now in Progress' : 'has now reached its deadline';
//     const type3 = isStartAlert 
//         ? 'Let\'s make the most of your time and tackle this with focus. Now\'s a great moment to plan ahead or set a timer for deep work mode'
//         : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
//     let message = `"${task.title}" has ${type}\n\n${type1}"${task.title}" ${type2}.\n\nDescription: ${task.description}\n\nPriority: ${task.priority}\n\n${type3}\n\nYou've got this!\n\nBest regards, Your Task RemindeMe Bot`;
    
//     if (isFriend) {
//         message += `\n\nThis reminder was sent to you by your friend: ${senderEmail}`;
//     }
    
//     return message;
// };

// // Send email with HTML and plain text
// const sendEmail = async (to, subject, htmlContent, textContent) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `"RemindWho Bot" <meanleapha@gmail.com>`,
//             to,
//             subject,
//             html: htmlContent,
//             text: textContent
//         });
//         console.log('✅ Email sent:', info.messageId);
//         return info;
//     } catch (error) {
//         console.error('❌ Error sending email:', error.message);
//         throw error;
//     }
// };

// // Run every minute
// schedule.scheduleJob('* * * * *', async () => {
//     try {
//         console.log('🔄 Checking for task alerts...');
        
//         const result = await db.query(`
//             SELECT t.*, u.timezone 
//             FROM todo_tasks t 
//             JOIN users u ON t.member_id = u.user_id
//         `);

//         const tasks = result.rows;
//         const nowUtc = DateTime.utc();

//         for (const task of tasks) {
//             const taskStart = DateTime.fromJSDate(new Date(task.start_time), { zone: 'utc' });
//             const taskDeadline = DateTime.fromJSDate(new Date(task.deadline_time), { zone: 'utc' });
//             const userNow = nowUtc.setZone(task.timezone || 'UTC');

//             let recipientEmail;
//             let senderEmail = task.member_email;
//             const isFriend = task.towho === 'Friend';
//             recipientEmail = isFriend ? task.to_email : senderEmail;

//             // START TIME ALERT
//             if (
//                 task.start_status === 'active' &&
//                 !task.start_alert_sent &&
//                 userNow >= taskStart.setZone(task.timezone)
//             ) {
//                 console.log(`📤 Sending start alert for: ${task.title}`);
                
//                 const htmlContent = generateHTMLEmail(task, isFriend, senderEmail, 'start');
//                 const textContent = generatePlainText(task, isFriend, senderEmail, 'start');
                
//                 await sendEmail(
//                     recipientEmail,
//                     `Task Started - ${task.title}`,
//                     htmlContent,
//                     textContent
//                 );
                
//                 await db.query(
//                     "UPDATE todo_tasks SET start_alert_sent = TRUE WHERE task_id = $1",
//                     [task.task_id]
//                 );
                
//                 console.log(`✅ Start alert sent for: ${task.title}`);
//             }

//             // DEADLINE TIME ALERT
//             if (
//                 task.deadline_status === 'active' &&
//                 !task.deadline_alert_sent &&
//                 userNow >= taskDeadline.setZone(task.timezone)
//             ) {
//                 console.log(`📤 Sending deadline alert for: ${task.title}`);
                
//                 const htmlContent = generateHTMLEmail(task, isFriend, senderEmail, 'deadline');
//                 const textContent = generatePlainText(task, isFriend, senderEmail, 'deadline');
                
//                 await sendEmail(
//                     recipientEmail,
//                     `Task Deadline Reached - ${task.title}`,
//                     htmlContent,
//                     textContent
//                 );
                
//                 await db.query(
//                     "UPDATE todo_tasks SET deadline_alert_sent = TRUE WHERE task_id = $1",
//                     [task.task_id]
//                 );
                
//                 console.log(`✅ Deadline alert sent for: ${task.title}`);
//             }
//         }
        
//         console.log('✅ Alert check completed');
//     } catch (error) {
//         console.error('❌ Error processing task alerts:', error);
//     }
// });

// console.log('🚀 Task reminder scheduler started successfully!');
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

// --- MODERN HTML TEMPLATE (no emoji, no timezone, minimal, Font Awesome) ---
const generateHTMLEmail = (task, isFriend, senderEmail, alertType) => {
    const isStartAlert = alertType === 'start';
    const statusText = isStartAlert ? 'Started' : 'Deadline Reached';
    const statusColor = isStartAlert ? '#2d7fb9' : '#b35f3a';
    
    // priority color (for flag icon)
    const priorityColor = task.priority.toLowerCase() === 'high' ? '#d97747' :
                          task.priority.toLowerCase() === 'medium' ? '#f0b34b' : '#4caf50';
    
    // format times (no timezone)
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

    // friend note
    const friendHtml = isFriend ? `
        <div class="friend-note">
            <i class="fas fa-user-friends"></i>
            <span>Sent by your friend: <strong>${senderEmail}</strong></span>
        </div>
    ` : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Reminder</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background: #f2f5f9;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 30px 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .card {
            max-width: 540px;
            width: 100%;
            background: #ffffff;
            border-radius: 28px;
            box-shadow: 0 20px 40px -12px rgba(0,20,40,0.15);
            padding: 28px 30px 24px;
            border: 1px solid rgba(200, 212, 230, 0.2);
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            border-bottom: 1px solid #eef2f7;
            padding-bottom: 14px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            font-size: 18px;
            color: #1b2a3f;
            letter-spacing: -0.3px;
        }
        .brand i { color: #2f6b9c; font-size: 22px; width: 28px; text-align: center; }
        .badge {
            background: #eaf1fa;
            color: #1e4a73;
            font-size: 13px;
            font-weight: 500;
            padding: 4px 14px;
            border-radius: 40px;
            border: 1px solid #d6e2f0;
        }
        .task-title {
            font-size: 24px;
            font-weight: 600;
            color: #0a1a2b;
            margin-bottom: 8px;
            letter-spacing: -0.4px;
            word-break: break-word;
        }
        .task-title i { color: #2f6b9c; font-size: 14px; margin-right: 8px; }
        .task-description {
            font-size: 15px;
            color: #2b4057;
            line-height: 1.5;
            margin: 6px 0 14px 0;
            background: #f8faff;
            padding: 12px 16px;
            border-radius: 16px;
            border-left: 4px solid #3d7eb3;
        }
        .task-description i { margin-right: 10px; color: #3d7eb3; width: 18px; }
        .priority-row {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 4px;
            margin-bottom: 18px;
        }
        .priority-tag {
            font-size: 14px;
            font-weight: 500;
            background: #f0f4fc;
            padding: 5px 16px 5px 12px;
            border-radius: 40px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #1d3b58;
        }
        .priority-tag i { font-size: 14px; width: 18px; }
        .meta-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 18px;
            background: #f6faff;
            padding: 12px 16px;
            border-radius: 20px;
            margin: 14px 0 18px 0;
            border: 1px solid #e6edf6;
        }
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #1d3349;
        }
        .meta-item i { color: #3b6f9b; width: 18px; font-size: 15px; text-align: center; }
        .friend-note {
            background: #f1f7fe;
            border-radius: 20px;
            padding: 12px 18px;
            margin: 14px 0 18px 0;
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid #dae6f5;
            color: #123753;
            font-size: 14px;
        }
        .friend-note i { color: #2a6b9e; font-size: 18px; width: 24px; text-align: center; }
        .friend-note strong { font-weight: 600; color: #0e2c48; }
        .action-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
            padding-top: 18px;
            border-top: 1px solid #e3ebf5;
        }
        .bot-signature {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 450;
            color: #1b3855;
        }
        .bot-signature i { color: #3d7eb3; font-size: 18px; }
        .status-badge {
            font-size: 14px;
            color: #1f4970;
            background: #e5eff9;
            padding: 2px 14px;
            border-radius: 40px;
        }
        .status-badge i { margin-right: 5px; }
        .micro-footer {
            margin-top: 22px;
            font-size: 12px;
            color: #58738f;
            text-align: center;
            border-top: 1px solid #eef2f8;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 4px;
        }
        .micro-footer a { color: #25638c; text-decoration: none; }
        .micro-footer a:hover { text-decoration: underline; color: #0d3e61; }
        .micro-footer i { margin-right: 4px; color: #3f7199; }
        @media (max-width: 460px) {
            .card { padding: 20px 16px; }
            .task-title { font-size: 21px; }
        }
    </style>
</head>
<body>
    <div class="card">
        <!-- header -->
        <div class="header">
            <div class="brand">
                <i class="fas fa-list-check"></i>
                <span>RemindMe</span>
            </div>
            <div class="badge">
                <i class="far fa-clock" style="margin-right: 6px;"></i> reminder
            </div>
        </div>

        <!-- title -->
        <div class="task-title">
            <i class="fas fa-circle"></i>
            ${task.title}
        </div>

        <!-- description -->
        <div class="task-description">
            <i class="fas fa-align-left"></i>
            ${task.description}
        </div>

        <!-- priority -->
        <div class="priority-row">
            <span class="priority-tag">
                <i class="fas fa-flag" style="color: ${priorityColor};"></i>
                Priority · ${task.priority}
            </span>
        </div>

        <!-- meta: start + deadline (no timezone) -->
        <div class="meta-grid">
            <span class="meta-item">
                <i class="fas fa-play"></i> Start: ${startTime}
            </span>
            <span class="meta-item">
                <i class="fas fa-stopwatch"></i> Deadline: ${deadlineTime}
            </span>
        </div>

        <!-- friend note (if any) -->
        ${friendHtml}

        <!-- action / status -->
        <div class="action-line">
            <span class="bot-signature">
                <i class="fas fa-robot"></i> Task RemindMe
            </span>
            <span class="status-badge">
                <i class="far fa-bell"></i> ${statusText}
            </span>
        </div>

        <!-- footer -->
        <div class="micro-footer">
            <span><i class="fas fa-rotate-right"></i> automated · reminder</span>
            <span style="display: flex; gap: 14px;">
                <a href="#"><i class="fas fa-sliders-h"></i> preferences</a>
                <a href="#"><i class="fas fa-circle-question"></i> help</a>
            </span>
        </div>
    </div>
</body>
</html>
    `;
};

// --- PLAIN TEXT (minimal, no fluff) ---
const generatePlainText = (task, isFriend, senderEmail, alertType) => {
    const isStartAlert = alertType === 'start';
    const status = isStartAlert ? 'Started' : 'Deadline Reached';
    
    let msg = `Task: ${task.title}\n`;
    msg += `Status: ${status}\n`;
    msg += `Description: ${task.description}\n`;
    msg += `Priority: ${task.priority}\n`;
    msg += `Start: ${new Date(task.start_time).toLocaleString()}\n`;
    msg += `Deadline: ${new Date(task.deadline_time).toLocaleString()}\n`;
    if (isFriend) {
        msg += `\nThis reminder was sent by your friend: ${senderEmail}`;
    }
    msg += `\n\n— Task RemindMe`;
    return msg;
};

// --- SEND EMAIL ---
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

// --- SCHEDULER (runs every minute) ---
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