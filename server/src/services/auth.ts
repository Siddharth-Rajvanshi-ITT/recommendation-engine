import User from "../models/user";

class AuthService {
    async login(id: string, name: string) {
        try {
            const user = await User.findOne({ where: { id, name } });
            if (!user) {
                throw new Error("Invalid employee ID or name");
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default AuthService;
