// const schedule = require('node-schedule');
// const { sendEmail } = require('../../email');
// const db = require('../config/db');

// // ✅ Safe date/time calculation
// const calculateAlertTimes = (startTime, endTime, beforeStart, beforeEnd) => {
//     const start = new Date(startTime).getTime();
//     const end = new Date(endTime).getTime();

//     return {
//         alertStart: new Date(start),
//         alertBeforeStart: new Date(start - beforeStart * 60000),
//         alertDeadline: new Date(end),
//         alertBeforeEnd: new Date(end - beforeEnd * 60000)
//     };
// };

// // ✅ Scheduled job to run every minute
// schedule.scheduleJob('* * * * *', async () => {
//     try {
//         const [tasks] = await db.query("SELECT * FROM todo_tasks");

//         const now = new Date();

//         for (const task of tasks) {
//             // ✅ Skip if task's deadline has already passed
//             if (new Date(task.deadline_time) < now) continue;

//             const times = calculateAlertTimes(task.start_time, task.deadline_time, task.alert_before_start, task.alert_before_end);

//             // ✅ Start alert
//             if (
//                 task.start_status === 'active' &&
//                 !task.start_alert_sent &&
//                 now >= times.alertStart
//             ) {
//                 await sendEmail(task.member_email, `Task Started - ${task.title}`, `Your task "${task.title}" has started.`);
//                 await db.query("UPDATE todo_tasks SET start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
//             }

//             // ✅ Before start alert
//             if (
//                 task.beforeStart_status === 'active' &&
//                 !task.before_start_alert_sent &&
//                 now >= times.alertBeforeStart
//             ) {
//                 await sendEmail(task.member_email, `Reminder Before Start - ${task.title}`, `Your task "${task.title}" starts soon.`);
//                 await db.query("UPDATE todo_tasks SET before_start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
//             }

//             // ✅ Before end alert
//             if (
//                 task.beforeEnd_status === 'active' &&
//                 !task.before_end_alert_sent &&
//                 now >= times.alertBeforeEnd
//             ) {
//                 await sendEmail(task.member_email, `Reminder Before Deadline - ${task.title}`, `Your task "${task.title}" is nearing its deadline.`);
//                 await db.query("UPDATE todo_tasks SET before_end_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
//             }

//             // ✅ Deadline alert
//             if (
//                 task.deadline_status === 'active' &&
//                 !task.deadline_alert_sent &&
//                 now >= times.alertDeadline
//             ) {
//                 await sendEmail(task.member_email, `Task Deadline - ${task.title}`, `Your task "${task.title}" has reached its deadline.`);
//                 await db.query("UPDATE todo_tasks SET deadline_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
//             }
//         }
//     } catch (error) {
//         console.error('❌ Error processing task alerts:', error);
//     }
// });

// console.log('⏳ Task scheduler running... checking every minute.');

// module.exports = { calculateAlertTimes };


// const { DateTime } = require('luxon');
// const schedule = require('node-schedule');
// const { sendEmail } = require('../util/email');
// const db = require('../config/db');

// // Run every minute
// schedule.scheduleJob('* * * * *', async () => {
//     try {
//         const [tasks] = await db.query(`
//             SELECT t.*, u.timezone 
//             FROM todo_tasks t 
//             JOIN users u ON t.member_id = u.user_id
//         `);

//         const nowUtc = DateTime.utc();

//         for (const task of tasks) {
//             const taskStart = DateTime.fromJSDate(new Date(task.start_time), { zone: 'utc' });
//             const taskDeadline = DateTime.fromJSDate(new Date(task.deadline_time), { zone: 'utc' });

//             // Convert now into user's local time
//             const userNow = nowUtc.setZone(task.timezone || 'UTC');

//             if (
//                 task.start_status === 'active' &&
//                 !task.start_alert_sent &&
//                 userNow >= taskStart.setZone(task.timezone)
//             ) {
//                 await sendEmail(task.member_email, `Task Started - ${task.title}`, `Your task "${task.title}" has started.`);
//                 await db.query("UPDATE todo_tasks SET start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
//             }

//             if (
//                 task.deadline_status === 'active' &&
//                 !task.deadline_alert_sent &&
//                 userNow >= taskDeadline.setZone(task.timezone)
//             ) {
//                 await sendEmail(task.member_email, `Task Deadline - ${task.title}`, `Your task "${task.title}" has reached its deadline.`);
//                 await db.query("UPDATE todo_tasks SET deadline_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
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
        const [tasks] = await db.query(`
            SELECT t.*, u.timezone 
            FROM todo_tasks t 
            JOIN users u ON t.member_id = u.user_id
        `);

        const nowUtc = DateTime.utc();

        for (const task of tasks) {
            const taskStart = DateTime.fromJSDate(new Date(task.start_time), { zone: 'utc' });
            const taskDeadline = DateTime.fromJSDate(new Date(task.deadline_time), { zone: 'utc' });

            // Convert now into user's local time
            const userNow = nowUtc.setZone(task.timezone || 'UTC');

            let recipientEmail;
            let senderEmail = task.member_email;

            // 🧠 Decide who gets the email
            const isFriend = task.toWho === 'Friend';
            if (isFriend) {
                recipientEmail = task.toEmail;
            } else {
                recipientEmail = senderEmail;
            }

            // Format email body
            const formatBody = (type, type1, type2, type3) => {
                // const baseMessage = `The task "${task.title}" has ${type}.`;
                const baseMessage = `"${task.title}" has ${type}\n\n${type1} "${task.title}" ${type2}.\n\n📌 Description: ${task.description}\n\n🔥 The Priority is ${task.priority}\n\n${type3}\n\n🎯 You’ve got this!\n\nBest regards, Your Task RemindeMe Bot 💌`;
                if (isFriend) {
                    return `${baseMessage}\n\nThis reminder was sent to you by your friend: ${senderEmail}`;
                }
                return baseMessage;
            };

            // ✅ START TIME ALERT
            if (
                task.start_status === 'active' &&
                !task.start_alert_sent &&
                userNow >= taskStart.setZone(task.timezone)
            ) {
                await sendEmail(
                    recipientEmail,
                    `📌 Task Started - ${task.title}`,
                    formatBody('officially kicked off 🚀', 'Just a friendly heads-up that your task ', 'is Now in Progress ⏰', "Let’s make the most of your time and tackle this with focus. Now’s a great moment to plan ahead or set a timer for deep work mode")
                );
                await db.query("UPDATE todo_tasks SET start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }

            // ⏰ DEADLINE TIME ALERT
            if (
                task.deadline_status === 'active' &&
                !task.deadline_alert_sent &&
                userNow >= taskDeadline.setZone(task.timezone)
            ) {
                await sendEmail(
                    recipientEmail,
                    `⏰ Task Ended - ${task.title}`,
                    formatBody('Reached Its Deadline ⏰', 'Just a quick reminder that your task ', 'has now reached its deadline ⏳', "✅ If you've already completed it—amazing! If not, there’s no better time than now to finish strong")
                );
                await db.query("UPDATE todo_tasks SET deadline_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }
        }
    } catch (error) {
        console.error('❌ Error processing task alerts:', error);
    }
});
