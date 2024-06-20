import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CategoryAttributes {
    categoryId: number;
    categoryName: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "categoryId"> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public categoryId!: number;
    public categoryName!: string;
}

Category.init(
    {
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryName: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "categories", 
        sequelize,
    }
);

export default Category;
