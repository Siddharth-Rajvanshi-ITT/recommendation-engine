import User from "../models/user";

class UserService {
    async createUser(employeeID: string, name: string, email: string, password: string) {
        try {
            const user = await User.create({ id:+employeeID, name, email, password });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserById(id: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserByEmployeeIdAndName(employeeId: number, name: string) {
        try {
            const user = await User.findOne({ where: { employeeId, name } });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUser(id: string, name: string, email: string, password: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error("User not found");
            }
            user.name = name;
            user.email = email;
            user.password = password;
            await user.save();
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error("User not found");
            }
            await user.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default UserService;
