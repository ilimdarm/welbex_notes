import Sequelize from "sequelize"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"


const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

const db_users = new Sequelize("users", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "postgres"
})

export const data = db_users.define('data', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    activation_token: {
        type: Sequelize.UUID,
    },
    activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    email: {
        type: Sequelize.STRING,
        validate:{
	        isEmail: true,
        }
    },
    role_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING
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

export const roles = db_users.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    level: {
        type: Sequelize.INTEGER,
        allowNull: false
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

data.sync()
roles.sync()
// data.sync({force: true})
// roles.sync({force: true})