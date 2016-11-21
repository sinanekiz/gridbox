 
const right = {
    crud: {
        user: {
            read: 1,
            create: 2,
            update: 3,
            delete: 4
        }
        ,
        role: {
            read: 5,
            create: 6,
            update: 7,
            delete: 8,
        },
        branch: {
            read: 9,
            create: 10,
            update: 11,
            delete: 12,
        }
    },
    management: {
        site: 13,
        user: 14
    },
    lockScreen: 15
}
module.exports.right = right;

module.exports.enumList = function (enumDatas) {
    var enums = [];
    for (var propertyName in enumDatas) {
        enums.push({ key: propertyName, value: enumDatas[propertyName] });
    }
    return enums;
}
module.exports.enumGrup=function(enumDatas){
        return enumGrups(enumDatas)
}

function enumGrups(enumDatas) {

    var enums = [];
    for (var propertyName in enumDatas) {
        var obj = {}
        if (typeof (enumDatas[propertyName]) == "object") {
            enums.push({ group: propertyName, subGroups: enumGrups(enumDatas[propertyName]), singleElements: findSingleData(enumDatas[propertyName]) });
        }
    }
    return enums;
}

function findSingleData(enumDatas) {
    var enums = [];
    for (var propertyName in enumDatas) {
        if (typeof (enumDatas[propertyName]) != "object") {
            enums.push({ key: propertyName, value: enumDatas[propertyName] });
        }
    }
    return enums;
}
