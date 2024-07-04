import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import MenuItem from "./menuItem";
import User from "./user";

interface ReviewAttributes {
    reviewId: number;
    menuId: number 
    userId: number 
    foodItemId: number;
    rating: number;
    comment: string;
    date: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "reviewId"> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public reviewId!: number;
    public menuId!: number 
    public userId!: number 
    public foodItemId!: number;
    public rating!: number;
    public comment!: string;
    public date!: Date;
}

Review.init(
    {
        reviewId: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        menuId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'DailyMenu', 
                key: 'menuId',
            },
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false, 
            references: {
                model: User,
                key: 'userId',
            },
        },
        foodItemId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: MenuItem,
                key: 'foodItemId',
            },
        },
        rating: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: new DataTypes.STRING(512),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "reviews", 
        sequelize,
    }
);

MenuItem.hasMany(Review, { foreignKey: 'foodItemId' });
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(MenuItem, { foreignKey: 'foodItemId' });
Review.belongsTo(User, { foreignKey: 'userId' });

export default Review;
