const Department = require('../models/department');
const departments = require('../utils/departments.json');

module.exports = {
    initDepartments: async (req, res) => {
        let isDepartment = await Department.find({}).lean();
        if (!(isDepartment.length > 0))
            await Department.insertMany(departments, (err, data) => {
                if (err)
                    console.log('error while creating department');
                else
                    console.log('Department master initilized');
            });
        else
            console.log('Departments already exist')
    }
}