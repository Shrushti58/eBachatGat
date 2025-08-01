const Member = require('../models/Member');

exports.assignRole = async (req, res) => {
    const { role } = req.body;
    const { id: memberId } = req.params; // Get memberId from URL parameter
    const allowedRoles = ["president", "treasurer", "secretary", "member"];

    if (!allowedRoles.includes(role)) {
        req.flash('error_msg', 'Invalid role selected.');
        return res.redirect('/admin/dashboard');
    }

    try {
        const member = await Member.findById(memberId);
        if (!member) {
            req.flash('error_msg', 'Member not found.');
            return res.redirect('/admin/dashboard');
        }

        // If assigning President, Treasurer, or Secretary, remove the existing role holder
        if (["president", "treasurer", "secretary"].includes(role)) {
            const updateResult = await Member.updateOne({ role }, { $set: { role: "member" } });
        }

        // Assign the new role
        let mem= await Member.findByIdAndUpdate(memberId, { role });

        req.flash('success_msg', `Successfully assigned ${role} role to ${mem.name}.`);
        return res.redirect('/admin/dashboard');

    } catch (err) {
        console.error("Error in assignRole:", err);
        req.flash('error_msg', 'Failed to update role.');
        return res.redirect('/admin/dashboard');
    }
};
