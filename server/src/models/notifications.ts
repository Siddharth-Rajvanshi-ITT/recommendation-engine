import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

interface NotificationAttributes {
    notification_id: number;
    user_id: number;
    notification_type: 'new_menu' | 'item_added' | 'item_status_change';
    notification_data: object;
    notification_timestamp: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, "notification_id"> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    public notification_id!: number;
    public user_id!: number;
    public notification_type!: 'new_menu' | 'item_added' | 'item_status_change';
    public notification_data!: object;
    public notification_timestamp!: Date;
}

Notification.init(
    {
        notification_id: {
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
        notification_type: {
            type: DataTypes.ENUM('new_menu', 'item_added', 'item_status_change'),
            allowNull: false,
        },
        notification_data: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        notification_timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "notifications",
        sequelize,
    }
);

// Setting up the associations
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

export default Notification;
