import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DailyRolloutAttributes {
    id: number;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    date: string;
}

interface DailyRolloutCreationAttributes extends Optional<DailyRolloutAttributes, "id"> {}

class DailyRollout extends Model<DailyRolloutAttributes, DailyRolloutCreationAttributes> implements DailyRolloutAttributes {
    public id!: number;
    public breakfast!: boolean;
    public lunch!: boolean;
    public dinner!: boolean;
    public date!: string;
}

DailyRollout.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        breakfast: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lunch: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,

        },
        dinner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "daily_rollouts",
        sequelize,
    }
);

export default DailyRollout;
