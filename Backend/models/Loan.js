const mongoose = require("mongoose");
const Setting = require("../models/Settings");

const loanSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
    },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenure: { type: Number, required: true },
    reason: { type: String },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Repaid"],
        default: "Pending",
    },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },

    guarantorDocs: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],

    repaymentSchedule: [
        {
            dueDate: { type: Date },
            amountDue: { type: Number },
            amountPaid: { type: Number, default: 0 },
            penalty: { type: Number, default: 0 },
            status: {
                type: String,
                enum: ["Pending", "Paid", "Late"],
                default: "Pending",
            },
            mode: {
                type: String,
                enum: ["Online", "Offline", null],
                default: null,
            },
            orderId: {
                type: String,
                default: null,
            },
            datePaid: {
                type: Date,
                default: null,
            },
        },
    ],

    totalPaid: { type: Number, default: 0 },
    remainingBalance: { type: Number },
    maxLoanAmount: { type: Number },
});



loanSchema.pre("save", async function (next) {
    try {
        const settings = await Setting.findOne();
        const penaltyPerDay = settings?.penaltyAmount || 10;
        const dueDateDay = settings?.dueDate || 10;

        const today = new Date();
        let totalPenalty = 0;
        let isModified = false;

        // ✅ Auto-generate repayment schedule if loan is being approved
        if (
            this.isModified("status") &&
            this.status === "Approved" &&
            (!this.repaymentSchedule || this.repaymentSchedule.length === 0)
        ) {
            const totalRepayment = Math.round(
                this.amount + (this.amount * this.interestRate) / 100
            );
            this.remainingBalance = totalRepayment;

            const roundedInstallment = Math.round(totalRepayment / this.tenure);
            const totalRounded = roundedInstallment * this.tenure;
            const roundingDiff = totalRounded - totalRepayment;

            this.repaymentSchedule = [];

            for (let i = 1; i <= this.tenure; i++) {
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + i);
                dueDate.setDate(dueDateDay);

                let amountDue = roundedInstallment;
                if (i === this.tenure && roundingDiff !== 0) {
                    amountDue -= roundingDiff; // ✅ Adjust last installment
                }

                this.repaymentSchedule.push({
                    dueDate,
                    amountDue,
                    amountPaid: 0,
                    penalty: 0,
                    status: "Pending",
                });
            }

            isModified = true;
        }

        // ✅ Apply penalties if not fully paid
        if (this.repaymentSchedule && this.status !== "Repaid") {
            this.repaymentSchedule.forEach((installment) => {
                if (installment.status !== "Paid") {
                    const dueDate = new Date(installment.dueDate);
                    if (today > dueDate) {
                        const daysLate = Math.floor(
                            (today - dueDate) / (1000 * 60 * 60 * 24)
                        );

                        if (!installment.penaltyApplied) {
                            installment.penalty = daysLate * penaltyPerDay;
                            installment.status = "Late";
                            installment.penaltyApplied = true;
                            isModified = true;
                        }
                    }
                    totalPenalty += installment.penalty;
                }
            });

            if (isModified) {
                this.markModified("repaymentSchedule");
            }
        }

        next();
    } catch (error) {
        console.error("❌ Error in pre-save hook:", error);
        next(error);
    }
});

loanSchema.methods.applyPenalty = async function () {
    try {
        const settings = await Setting.findOne();
        const penaltyPerDay = settings?.penaltyAmount || 10;
        const today = new Date();

        let totalPenalty = 0;
        let isModified = false;

        this.repaymentSchedule.forEach((installment) => {
            if (installment.status !== "Paid") {
                const dueDate = new Date(installment.dueDate);
                if (today > dueDate) {
                    const daysLate = Math.floor(
                        (today - dueDate) / (1000 * 60 * 60 * 24)
                    );

                    installment.penalty = daysLate * penaltyPerDay;
                    installment.status = "Late";
                    totalPenalty += installment.penalty;
                    isModified = true;
                }
            }
        });

        if (isModified) {
            // Recalculate balance with penalties
            const totalDue =
                this.amount + (this.amount * this.interestRate) / 100 + totalPenalty;
            this.remainingBalance = Math.max(0, totalDue - this.totalPaid);

            await this.save();
        }
    } catch (error) {
        console.error("❌ Error applying penalty manually:", error);
    }
};


module.exports = mongoose.model("Loan", loanSchema);

