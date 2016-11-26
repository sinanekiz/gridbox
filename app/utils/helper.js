
const mongoose = require('mongoose');
const Branch = mongoose.model('Branch');
const { wrap: async } = require('co');



var findUserParentBranches = async(function* (user, right) {
    parentBranches = [];
    user.branchRoles.forEach(branchRole => {
        branchRole.roles.forEach(role => {
            if (role.rights.indexOf(right) > -1) {
                parentBranches.push(branchRole.branch);
            }
        });
    });
    return parentBranches;

});

var findAllChildBranches = async(function* (parents) {

    var childs = [];
    var childBranches = yield Branch.find({ parent: { $in: parents } }).exec();

    if (!childBranches.length) { return childs; }

    childBranches.forEach(child => childs.push(child._id.toString()));

    var innerChilds = yield findAllChildBranches(childs);

    innerChilds.forEach(child => childs.push(child));

    return childs;

});


var allBranches = async(function* (user, right) {

    var parents = yield findUserParentBranches(user, right);
    var childs = yield findAllChildBranches(parents);
    childs.forEach(c => parents.push(c));
    console.log(parents)
    return parents;
})


module.exports.allBranches = allBranches;