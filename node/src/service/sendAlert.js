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
const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const { sendEmail } = require('../util/email');

const db = require('../config/db');

// Run every minute
schedule.scheduleJob('* * * * *', async () => {
    try {
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
                const htmlContent = generateTaskEmailHTML(task, isFriend, senderEmail, 'start');
                const textContent = generatePlainTextFallback(task, isFriend, senderEmail, 'start');
                
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
            }

            // DEADLINE TIME ALERT
            if (
                task.deadline_status === 'active' &&
                !task.deadline_alert_sent &&
                userNow >= taskDeadline.setZone(task.timezone)
            ) {
                const htmlContent = generateTaskEmailHTML(task, isFriend, senderEmail, 'deadline');
                const textContent = generatePlainTextFallback(task, isFriend, senderEmail, 'deadline');
                
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
            }
        }
    } catch (error) {
        console.error('❌ Error processing task alerts:', error);
    }
});


const generateTaskEmailHTML = (task, isFriend, senderEmail, alertType) => {
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
        ? 'Let\'s make the most of your time and tackle this with focus. Now\'s a great moment to plan ahead or set a timer for deep work mode'
        : 'If you\'ve already completed it—amazing! If not, there\'s no better time than now to finish strong';
    
    const priorityIcon = task.priority.toLowerCase() === 'high' ? 'fa-exclamation-triangle' :
                         task.priority.toLowerCase() === 'medium' ? 'fa-equals' : 'fa-arrow-down';
    const priorityColor = task.priority.toLowerCase() === 'high' ? '#d97747' :
                          task.priority.toLowerCase() === 'medium' ? '#f0b34b' : '#4caf50';
    
    const friendNote = isFriend 
        ? `<div style="background: #ecf3fa; border-radius: 18px; padding: 16px 22px; margin: 22px 0 12px 0; display: flex; align-items: center; gap: 12px; border-left: 4px solid #3b8cbf;">
            <i class="fas fa-user-friends" style="color: #2d7fb9; font-size: 18px; width: 28px; text-align: center;"></i>
            <span style="color: #1d3850; font-size: 15px;">
                <i class="fas fa-envelope" style="margin-right: 6px; color: #2d7fb9;"></i> 
                This reminder was sent to you by your friend: <strong>${senderEmail}</strong>
            </span>
        </div>`
        : '';

    const startTime = DateTime.fromJSDate(new Date(task.start_time)).toFormat('yyyy-MM-dd HH:mm');
    const deadlineTime = DateTime.fromJSDate(new Date(task.deadline_time)).toFormat('yyyy-MM-dd HH:mm');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: #f4f7fc;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                padding: 30px 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            }
            .email-wrapper {
                max-width: 600px;
                width: 100%;
                background-color: #ffffff;
                border-radius: 28px;
                box-shadow: 0 20px 50px rgba(0, 20, 40, 0.08), 0 8px 20px rgba(0, 0, 0, 0.02);
                overflow: hidden;
            }
            .email-header {
                background: linear-gradient(145deg, #1a2a3a, #0f1a26);
                padding: 36px 32px 28px 32px;
                color: #fff;
                border-bottom: 4px solid ${statusColor};
            }
            .email-header h1 {
                font-weight: 600;
                font-size: 24px;
                letter-spacing: -0.3px;
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 6px;
            }
            .email-header h1 i { color: #6ab0e6; font-size: 28px; }
            .email-header .task-title {
                background: rgba(255, 255, 255, 0.07);
                padding: 8px 20px 8px 18px;
                border-radius: 50px;
                display: inline-block;
                font-size: 18px;
                font-weight: 500;
                margin-top: 8px;
                border-left: 3px solid ${statusColor};
                word-break: break-word;
            }
            .email-header .task-title i { margin-right: 10px; color: #9ac7f0; font-size: 16px; }
            .email-body { padding: 32px 32px 24px 32px; background: #ffffff; }
            .status-badge {
                display: inline-block;
                background: #eef4fa;
                padding: 8px 18px 8px 16px;
                border-radius: 40px;
                font-size: 14px;
                font-weight: 600;
                color: #1a3852;
                margin-bottom: 20px;
            }
            .status-badge i { margin-right: 10px; color: ${statusColor}; }
            .greeting {
                font-size: 17px;
                font-weight: 500;
                color: #1c2e3f;
                margin-bottom: 12px;
            }
            .greeting i { color: #3b8cbf; margin-right: 8px; }
            .message-block {
                background: #f8fafd;
                padding: 22px 24px;
                border-radius: 20px;
                margin: 18px 0 24px 0;
                border: 1px solid #e9edf2;
            }
            .message-block p {
                font-size: 16px;
                color: #1d2c3b;
                margin-bottom: 12px;
            }
            .message-block .highlight {
                background: #e1ebf5;
                padding: 2px 8px;
                border-radius: 8px;
                font-weight: 500;
                color: #13547a;
            }
            .message-block .action-box {
                background: #e3edf7;
                padding: 8px 14px;
                border-radius: 40px;
                display: inline-block;
                margin-top: 12px;
            }
            .message-block .action-box i { margin-right: 8px; color: #1f6390; }
            .meta-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin: 20px 0 18px 0;
                padding: 16px 0 8px 0;
                border-top: 1px solid #e6ecf3;
            }
            .meta-item {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: #1f3a4f;
                background: #f5f9ff;
                padding: 6px 16px 6px 12px;
                border-radius: 40px;
            }
            .meta-item i { color: #3b8cbf; width: 18px; font-size: 14px; text-align: center; }
            .meta-item strong { font-weight: 600; color: #0e2638; margin-right: 4px; }
            .closing {
                margin-top: 28px;
                font-size: 16px;
                color: #1f3446;
                border-top: 1px dashed #d4dfea;
                padding-top: 24px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
            }
            .closing .signature { display: flex; align-items: center; gap: 8px; }
            .closing .signature i { color: #3b8cbf; font-size: 18px; }
            .closing .heart { color: #b3435a; margin-right: 6px; }
            .email-footer {
                background: #f4f8fe;
                padding: 18px 32px;
                font-size: 13px;
                color: #4f657b;
                border-top: 1px solid #dfe8f2;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
            }
            .email-footer i { margin-right: 6px; color: #6d8aa8; }
            .email-footer a {
                color: #1f5277;
                text-decoration: none;
                font-weight: 500;
                border-bottom: 1px dotted #b6cee5;
            }
            @media (max-width: 480px) {
                .email-header { padding: 28px 20px 22px 20px; }
                .email-header h1 { font-size: 20px; flex-wrap: wrap; }
                .email-body { padding: 24px 20px 20px 20px; }
                .message-block { padding: 18px 16px; }
                .meta-grid { gap: 8px; }
                .meta-item { font-size: 13px; padding: 4px 12px 4px 8px; }
                .closing { flex-direction: column; align-items: flex-start; gap: 8px; }
                .email-footer { flex-direction: column; align-items: flex-start; gap: 6px; padding: 16px 20px; }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-header">
                <h1>
                    <i class="fas fa-tasks"></i> Task RemindeMe
                </h1>
                <div class="task-title">
                    <i class="fas fa-pen"></i> ${task.title}
                </div>
            </div>

            <div class="email-body">
                <div class="status-badge">
                    <i class="fas ${statusIcon}"></i> ${statusText}
                </div>

                <div class="greeting">
                    <i class="fas fa-user-astronaut"></i> Hello there,
                </div>

                <div class="message-block">
                    <p>
                        <i class="fas fa-clock" style="margin-right: 8px; color: #2d7fb9;"></i>
                        <span class="highlight">"${task.title}"</span> has ${isStartAlert ? 'officially kicked off' : 'reached its deadline'}
                    </p>
                    <p>${secondLine}</p>
                    <p style="margin-top: 12px;">
                        <i class="fas fa-list-ul" style="margin-right: 8px; color: #2d7fb9;"></i>
                        <strong>Description:</strong> ${task.description}
                    </p>
                    <p style="margin-top: 6px;">
                        <i class="fas ${priorityIcon}" style="margin-right: 8px; color: ${priorityColor};"></i>
                        <strong>Priority:</strong> ${task.priority}
                    </p>
                    <div class="action-box">
                        <i class="fas fa-bolt"></i> ${actionMessage}
                    </div>
                </div>

                <div class="meta-grid">
                    <div class="meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <strong>Start:</strong> ${startTime}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-hourglass-end"></i>
                        <strong>Deadline:</strong> ${deadlineTime}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-globe-americas"></i>
                        <strong>Timezone:</strong> ${task.timezone || 'UTC'}
                    </div>
                </div>

                ${friendNote}

                <div class="closing">
                    <div class="signature">
                        <i class="fas fa-robot"></i>
                        <span>Your Task RemindeMe Bot</span>
                    </div>
                    <div>
                        <span class="heart">❤️</span>
                        <span style="font-weight: 400; color: #2b4b66;">You've got this!</span>
                    </div>
                </div>
            </div>

            <div class="email-footer">
                <div>
                    <i class="fas fa-chevron-circle-right"></i>
                    Task reminder · automated
                </div>
                <div>
                    <i class="fas fa-cog"></i>
                    <a href="#">preferences</a>
                    <i class="fas fa-question-circle" style="margin-left: 14px;"></i>
                    <a href="#">help</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generatePlainTextFallback = (task, isFriend, senderEmail, alertType) => {
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

