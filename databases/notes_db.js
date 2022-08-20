import Sequelize from "sequelize"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"


const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

const db = new Sequelize("notes", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "postgres"
})

export const notes = db.define('notes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    archived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    author_id: {
        type: Sequelize.INTEGER,
    },
    create_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes:[
        {
            unique: true,
            fields: ['id']
        },
    ]
})

notes.sync()