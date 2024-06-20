import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface RoleAttributes {
    roleId: number;
    roleName: 'Admin' | 'Employee' | 'Chef';
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "roleId"> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public roleId!: number;
    public roleName!: 'Admin' | 'Employee' | 'Chef';
}

Role.init(
    {
        roleId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        roleName: {
            type: DataTypes.ENUM('Admin', 'Employee', 'Chef'),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "roles",
        sequelize,
    }
);

export default Role;
