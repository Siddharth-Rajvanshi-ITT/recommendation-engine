import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface MenuItemAttributes {
    item_id: number;
    name: string;
    description: string;
    category: 'breakfast' | 'lunch' | 'dinner';
    price: number;
    availability_status: 'available' | 'unavailable';
}

interface MenuItemCreationAttributes extends Optional<MenuItemAttributes, "item_id"> {}

class MenuItem extends Model<MenuItemAttributes, MenuItemCreationAttributes> implements MenuItemAttributes {
    public availability_status!: 'available' | 'unavailable';
    public category!: 'breakfast' | 'lunch' | 'dinner';
    public description!: string;
    public item_id!: number;
    public name!: string;
    public price!: number;
}

MenuItem.init(
    {
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new DataTypes.STRING(512),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('breakfast', 'lunch', 'dinner'),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        availability_status: {
            type: DataTypes.ENUM('available', 'unavailable'),
            allowNull: false,
        },
    },
    {
        tableName: "menu_items",
        sequelize,
    }
);

export default MenuItem;
