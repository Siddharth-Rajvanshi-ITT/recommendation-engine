import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import DailyMenu from "./dailyMenu";
import MenuItem from "./menuItem";

interface DailyMenuItemsAttributes {
    id: number;
    menu_id: number;
    item_id: number;
    quantity_prepared: number;
}

interface DailyMenuItemsCreationAttributes extends Optional<DailyMenuItemsAttributes, "id"> {}

class DailyMenuItems extends Model<DailyMenuItemsAttributes, DailyMenuItemsCreationAttributes> implements DailyMenuItemsAttributes {
    public id!: number;
    public menu_id!: number;
    public item_id!: number;
    public quantity_prepared!: number;
}

DailyMenuItems.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
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
        quantity_prepared: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: "daily_menu_items",
        sequelize,
    }
);

DailyMenu.hasMany(DailyMenuItems, { foreignKey: 'menu_id' });
MenuItem.hasMany(DailyMenuItems, { foreignKey: 'item_id' });
DailyMenuItems.belongsTo(DailyMenu, { foreignKey: 'menu_id' });
DailyMenuItems.belongsTo(MenuItem, { foreignKey: 'item_id' });

export default DailyMenuItems;
