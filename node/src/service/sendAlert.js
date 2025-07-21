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

        const nowUtc = DateTime.utc(); // Current moment in UTC

        for (const task of tasks) {
            // Parse start_time and deadline_time as UTC DateTimes from the string in DB
            // DB times are treated as UTC
            const taskStartUtc = DateTime.fromSQL(task.start_time, { zone: 'utc' });
            const taskDeadlineUtc = DateTime.fromSQL(task.deadline_time, { zone: 'utc' });

            // Convert current time to user's timezone
            const userTimezone = task.timezone || 'UTC';
            const userNow = nowUtc.setZone(userTimezone);

            // Convert task times to user's timezone for accurate comparison
            const taskStartUser = taskStartUtc.setZone(userTimezone);
            const taskDeadlineUser = taskDeadlineUtc.setZone(userTimezone);

            let recipientEmail;
            let senderEmail = task.member_email;

            // Decide who gets the email
            const isFriend = task.toWho === 'Friend';
            recipientEmail = isFriend ? task.toEmail : senderEmail;

            // Format email body
            const formatBody = (type, type1, type2, type3) => {
                const baseMessage = `"${task.title}" has ${type}\n\n${type1} "${task.title}" ${type2}.\n\n📌 Description: ${task.description}\n\n🔥 The Priority is ${task.priority}\n\n${type3}\n\n🎯 You’ve got this!\n\nBest regards, Your Task RemindeMe Bot 💌`;
                return isFriend ? `${baseMessage}\n\nThis reminder was sent to you by your friend: ${senderEmail}` : baseMessage;
            };

            // Send start time alert if conditions met
            if (
                task.start_status === 'active' &&
                !task.start_alert_sent &&
                userNow >= taskStartUser
            ) {
                await sendEmail(
                    recipientEmail,
                    `📌 Task Started - ${task.title}`,
                    formatBody(
                        'officially kicked off 🚀',
                        'Just a friendly heads-up that your task ',
                        'is Now in Progress ⏰',
                        "Let’s make the most of your time and tackle this with focus. Now’s a great moment to plan ahead or set a timer for deep work mode"
                    )
                );
                await db.query("UPDATE todo_tasks SET start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }

            // Send deadline alert if conditions met
            if (
                task.deadline_status === 'active' &&
                !task.deadline_alert_sent &&
                userNow >= taskDeadlineUser
            ) {
                await sendEmail(
                    recipientEmail,
                    `⏰ Task Ended - ${task.title}`,
                    formatBody(
                        'Reached Its Deadline ⏰',
                        'Just a quick reminder that your task ',
                        'has now reached its deadline ⏳',
                        "✅ If you've already completed it—amazing! If not, there’s no better time than now to finish strong"
                    )
                );
                await db.query("UPDATE todo_tasks SET deadline_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }
        }
    } catch (error) {
        console.error('❌ Error processing task alerts:', error);
    }
});
