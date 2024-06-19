import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
    id: number;
    employeeId: string;
    name: string;
    email: string;
    password: string;
    role: "employee" | "admin" | "chef";
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    employeeId: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: "employee" | "admin" | "chef";
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeId: {
            type: new DataTypes.STRING(128),
            unique: true,
            allowNull: false,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        role: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            defaultValue: "employee",
        },
    },
    {
        tableName: "users",
        sequelize,
    }
);

export default User;