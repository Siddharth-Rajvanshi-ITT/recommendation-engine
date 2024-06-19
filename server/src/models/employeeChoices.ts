import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";
import DailyMenu from "./dailyMenu";
import MenuItem from "./menuItem";

interface EmployeeChoicesAttributes {
    choice_id: number;
    user_id: number;
    menu_id: number;
    item_id: number;
    quantity_chosen: number;
}

interface EmployeeChoicesCreationAttributes extends Optional<EmployeeChoicesAttributes, "choice_id"> {}

class EmployeeChoices extends Model<EmployeeChoicesAttributes, EmployeeChoicesCreationAttributes> implements EmployeeChoicesAttributes {
    public choice_id!: number;
    public user_id!: number;
    public menu_id!: number;
    public item_id!: number;
    public quantity_chosen!: number;
}

EmployeeChoices.init(
    {
        choice_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        menu_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: DailyMenu,
                key: 'menu_id',
            },
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: MenuItem,
                key: 'item_id',
            },
        },
        quantity_chosen: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: "employee_choices",
        sequelize,
    }
);

// Setting up the associations
User.hasMany(EmployeeChoices, { foreignKey: 'user_id' });
DailyMenu.hasMany(EmployeeChoices, { foreignKey: 'menu_id' });
MenuItem.hasMany(EmployeeChoices, { foreignKey: 'item_id' });
EmployeeChoices.belongsTo(User, { foreignKey: 'user_id' });
EmployeeChoices.belongsTo(DailyMenu, { foreignKey: 'menu_id' });
EmployeeChoices.belongsTo(MenuItem, { foreignKey: 'item_id' });

export default EmployeeChoices;
