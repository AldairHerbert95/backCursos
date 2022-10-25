import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Task } from './Task.js';



export const Project = sequelize.define('projects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT
    },
    priority: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.TEXT
    },
    taskId: {
        
    }
    
}, { timestamps:true, freezeTableName: true});

Project.hasMany(Task, {
    foreignKey: 'projectId',
    sourceKey: 'id'
})

Task.belongsTo(Project, {
    foreignKey: 'projectId',
    targetId: 'id'
})