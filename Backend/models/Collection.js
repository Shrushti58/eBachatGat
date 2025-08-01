const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    penalty: {
        type: Number,
        default: 0
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Late"],
        default: "Pending"
    },

    mode: {
        type: String,
        enum: ["Online", "Offline"],
        default: "Offline"
    },
    orderId: {
        type: String
    },
    datePaid: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


async function updateGroupSavings() {
    const collectionSavingsResult = await mongoose.model("Collection").aggregate([
        { $match: { status: { $in: ["Paid", "Late"] } } }, // ✅ Match both "Paid" and "Late"
        {
            $group: {
                _id: null,
                total: { $sum: { $add: ["$amount", "$penalty"] } }
            }
        }
    ]);

    const loanRepaymentsResult = await mongoose.model("Loan").aggregate([
        { $match: { status: "Repaid" } }, // ✅ Consider only fully repaid loans
        {
            $group: {
                _id: null,
                total: { $sum: { $add: ["$totalPaid", "$totalPenalty"] } } // ✅ Include penalties too
            }
        }
    ]);

    const collectionTotal = collectionSavingsResult.length > 0 ? collectionSavingsResult[0].total : 0;
    const loanTotal = loanRepaymentsResult.length > 0 ? loanRepaymentsResult[0].total : 0;

    const totalSavings = collectionTotal + loanTotal;

    await mongoose.model("Setting").updateOne({}, { $set: { groupSavings: totalSavings } });
    console.log("✅ groupSavings updated:", totalSavings);
}



collectionSchema.pre("save", async function (next) {
    if (this.isModified("penalty")) return next(); // ✅ Skip if penalty is already set

    const today = new Date();
    const setting = await mongoose.model("Setting").findOne();

    if (!setting) {
        console.error("⚠️ No setting found! Using default values.");
        return next();
    }

    const dueDate = new Date(this.year, this.month - 1, setting.dueDate);

    if (this.datePaid) {
        if (this.datePaid > dueDate) {
            this.status = "Late";
            this.penalty = (this.datePaid.getDate() - setting.dueDate) * setting.penaltyAmount; // ✅ Correct penalty calculation
        } else {
            this.status = "Paid";
            this.penalty = 0;
        }
    } else {
        if (today > dueDate) {
            this.status = "Late";
            this.penalty = (today.getDate() - setting.dueDate) * setting.penaltyAmount; // ✅ Correct penalty calculation
        } else {
            this.status = "Pending";
        }
    }

    next();
});

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;
module.exports.updateGroupSavings = updateGroupSavings;
