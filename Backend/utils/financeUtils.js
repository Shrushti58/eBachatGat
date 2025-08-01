const mongoose = require("mongoose");
const Collection = require("../models/Collection");

async function getTotalSavings(memberId) {
    const totalSavings = await Collection.aggregate([
        {
            $match: {
                memberId: new mongoose.Types.ObjectId(memberId),
                status: { $in: ["Paid", "Late"] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);

    return totalSavings.length > 0 ? totalSavings[0].total : 0;
}

module.exports = { getTotalSavings };
