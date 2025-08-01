const cron = require("node-cron");
const Member = require("../models/Member");  
const Collection = require("../models/Collection");  
const Setting = require("../models/Settings");  


// Runs daily at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Running daily penalty check...");

    try {
        const setting = await Setting.findOne();
        if (!setting) {
            console.log("⚠️ No settings found! Skipping penalty check.");
            return;
        }

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const dueDate = setting.dueDate;
        const penaltyAmount = setting.penaltyAmount;

        if (today.getDate() <= dueDate) {
            console.log(`✅ Today is before or on the due date (${dueDate}). No penalties applied.`);
            return;
        }

        const members = await Member.find();

        for (let member of members) {
            const paymentExists = await Collection.findOne({
                memberId: member._id,
                month: currentMonth,
                year: currentYear
            });

            if (!paymentExists) { 
                // Member hasn't paid → Apply penalty
                member.balance -= penaltyAmount;
                await member.save();

                // Send notification about the penalty
                sendNotification(member.contactNumber, 
                    `⚠️ Late payment penalty applied! You now owe ${-member.balance} in penalties. Pay soon to avoid more charges.`);
                
                console.log(`🚨 Penalty applied to ${member.name} (${member.contactNumber})`);
            }
        }

        console.log("✅ Daily penalty check completed.");
    } catch (error) {
        console.error("❌ Error in penalty check:", error);
    }
});


