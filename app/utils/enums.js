

const rights = {
    crud_user_read: 1,
    crud_user_create: 2,
    crud_user_update: 3,
    crud_user_delete: 4,

    crud_role_read: 5,
    crud_role_create: 6,
    crud_role_update: 7,
    crud_role_delete: 8,

    crud_branch_read: 9,
    crud_branch_create: 10,
    crud_branch_update: 11,
    crud_branch_delete: 12,
}


module.exports.enumList = function(enumDatas) {
    var enums = [];
    for (var propertyName in enumDatas) {
        enums.push({ key: propertyName, value: enumDatas[propertyName] });
    }
    return enums;
}

module.exports.enumGroup = function(enumList) {

    var parsedData = [];
    for (var i = 0; i < enumList.length; i++) {
        var enumParts = enumList.key.split("_");

        parsedData.push({ group1: enumParts[0], group2: enumParts[1] || null, group3: enumParts[2] || null, key: enumList.key, value: enumList.value })

        var distinctFirst = distict(parsedData);

        distinctFirst.filter(function(distF) {
           var group= parsedData.filter(function(data) {
                return data.group1 == distF
            });
        });
        parsedData.filter



    }


}

function distict(array) {
    var flags = [], output = [], l = array.length, i;
    for (i = 0; i < l; i++) {
        if (flags[array[i].group1]) continue;
        flags[array[i].group1] = true;
        output.push(array[i].group1);
    }
    return output;
}

module.exports.rights = rights;