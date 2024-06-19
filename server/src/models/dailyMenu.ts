import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

interface DailyMenuAttributes {
    menu_id: number;
    menu_date: Date;
    menu_type: 'breakfast' | 'lunch' | 'dinner';
    chef_id: number;
}

interface DailyMenuCreationAttributes extends Optional<DailyMenuAttributes, "menu_id"> {}

class DailyMenu extends Model<DailyMenuAttributes, DailyMenuCreationAttributes> implements DailyMenuAttributes {
    public menu_id!: number;
    public menu_date!: Date;
    public menu_type!: 'breakfast' | 'lunch' | 'dinner';
    public chef_id!: number;
}

DailyMenu.init(
    {
        menu_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        menu_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        menu_type: {
            type: DataTypes.ENUM('breakfast', 'lunch', 'dinner'),
            allowNull: false,
        },
        chef_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        tableName: "daily_menu",
        sequelize,
    }
);

// Setting up the associations
User.hasMany(DailyMenu, { foreignKey: 'chef_id' });
DailyMenu.belongsTo(User, { foreignKey: 'chef_id' });

export default DailyMenu;
