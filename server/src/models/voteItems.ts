import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface VoteItemAttributes {
    id: number;
    menu_id: number;
    category: string;
    date: string;
    votes: number;
}

interface VoteItemCreationAttributes extends Optional<VoteItemAttributes, "id" | "votes"> {}

class VoteItem extends Model<VoteItemAttributes, VoteItemCreationAttributes> implements VoteItemAttributes {
    public category!: string;
    public date!: string;
    public id!: number;
    public incrementVote!: () => Promise<void>;
    public menu_id!: number;
    public votes!: number;
}

VoteItem.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        menu_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        date: {
            type: new DataTypes.STRING(10),
            allowNull: false,
        },
        category: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        votes: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        tableName: "vote_items",
        sequelize,
    }
);

VoteItem.prototype.incrementVote = async function () {
    this.votes += 1;
    await this.save();
};

export default VoteItem;
