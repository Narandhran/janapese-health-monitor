/**
 * @author - itsNaren
 * @description - Excel to Json service
 * @date - 2021-06-01 11:32:02
**/
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const path = require('path');
module.exports.convert = async (fileName) => {
    const persisted = await excelToJson({
        source: fs.readFileSync(path.resolve(`public/registration/${fileName}`)),
        // sourceFile: file,
        sheets: [{
            name: 'Sheet1',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'empId',
                B: 'name',
                C: 'email',
                D: 'department',
                E: 'role',
                F: 'access'
            }
        }]
    });
    return persisted;
}
