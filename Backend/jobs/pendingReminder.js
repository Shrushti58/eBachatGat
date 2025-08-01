const cron = require("node-cron");
const Member = require("../models/Member");
const Collection = require("../models/Collection");
const Setting = require("../models/Settings");
const sendEmail = require("../utils/sendEmail");

cron.schedule("0 0 * * *", async () => {
    try {
        const setting = await Setting.findOne();
        if (!setting) return;

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const dueDate = setting.dueDate;

        if (today.getDate() <= dueDate) return;

        const members = await Member.find({ status: "Approved" });

        for (const member of members) {
            const paymentExists = await Collection.findOne({
                memberId: member._id,
                month: currentMonth,
                year: currentYear
            });

            if (!paymentExists && member.email) {
                await sendEmail(
                    member.email,
                    "⏰ Don't Miss Out! Your Bachat Gat Payment is Still Pending",
                    `Hello ${member.name},\n\nWe hope this message finds you well!\n\nJust a gentle reminder — it looks like your monthly contribution for ${currentMonth}/${currentYear} hasn't been received yet.\n\nYour participation plays a vital role in keeping our Bachat Gat strong, supportive, and thriving for every member. Timely contributions help us all grow together 💪💰.\n\nTo avoid any late penalties and stay in good standing, please make your payment as soon as possible.\n\nIf you've already made the payment, you can ignore this message — thank you! 🙏\n\nWarm regards,\nThe Bachat Gat Team`
                );

            }
        }
    } catch (err) {
        console.error("❌ Error during email reminder cron:", err);
    }
});
