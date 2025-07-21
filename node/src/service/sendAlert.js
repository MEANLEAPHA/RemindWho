const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const { sendEmail } = require('../util/email');
const db = require('../config/db');

// Run every minute
schedule.scheduleJob('* * * * *', async () => {
    try {
        const [tasks] = await db.query(`
            SELECT t.*, u.timezone 
            FROM todo_tasks t 
            JOIN users u ON t.member_id = u.user_id
        `);

        for (const task of tasks) {
            const userTimezone = task.timezone || 'UTC';
            const userNow = DateTime.now().setZone(userTimezone);

            // Parse DB time as UTC, then convert to user's timezone
            const taskStartUser = DateTime.fromSQL(task.start_time, { zone: 'utc' }).setZone(userTimezone);
            const taskDeadlineUser = DateTime.fromSQL(task.deadline_time, { zone: 'utc' }).setZone(userTimezone);

            const isFriend = task.toWho === 'Friend';
            const senderEmail = task.member_email;
            const recipientEmail = isFriend ? task.toEmail : senderEmail;

            const formatBody = (type, type1, type2, type3) => {
                const baseMessage = `"${task.title}" has ${type}\n\n${type1} "${task.title}" ${type2}.\n\n\ud83d\udccc Description: ${task.description}\n\n\ud83d\udd25 The Priority is ${task.priority}\n\n${type3}\n\n\ud83c\udfaf You’ve got this!\n\nBest regards, Your Task RemindeMe Bot �\udc8c`;
                return isFriend ? `${baseMessage}\n\nThis reminder was sent to you by your friend: ${senderEmail}` : baseMessage;
            };

            // Start Alert
            if (
                task.start_status === 'active' &&
                !task.start_alert_sent &&
                userNow >= taskStartUser
            ) {
                await sendEmail(
                    recipientEmail,
                    `\ud83d\udccc Task Started - ${task.title}`,
                    formatBody(
                        'officially kicked off \ud83d\ude80',
                        'Just a friendly heads-up that your task ',
                        'is Now in Progress \u23f0',
                        'Let’s make the most of your time and tackle this with focus. Now’s a great moment to plan ahead or set a timer for deep work mode'
                    )
                );
                await db.query("UPDATE todo_tasks SET start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }

            // Deadline Alert
            if (
                task.deadline_status === 'active' &&
                !task.deadline_alert_sent &&
                userNow >= taskDeadlineUser
            ) {
                await sendEmail(
                    recipientEmail,
                    `\u23f0 Task Ended - ${task.title}`,
                    formatBody(
                        'Reached Its Deadline \u23f0',
                        'Just a quick reminder that your task ',
                        'has now reached its deadline \u231b',
                        '✅ If you\'ve already completed it—amazing! If not, there’s no better time than now to finish strong'
                    )
                );
                await db.query("UPDATE todo_tasks SET deadline_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }
        }
    } catch (error) {
        console.error('❌ Error processing task alerts:', error);
    }
});
