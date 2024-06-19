import EmployeeChoices from "../models/employeeChoices";

class EmployeeChoicesService {
    async createEmployeeChoice(user_id: number, menu_id: number, item_id: number, quantity_chosen: number) {
        try {
            const employeeChoice = await EmployeeChoices.create({ user_id, menu_id, item_id, quantity_chosen });
            return employeeChoice;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getEmployeeChoices() {
        try {
            const employeeChoices = await EmployeeChoices.findAll();
            return employeeChoices;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getEmployeeChoiceById(choice_id: number) {
        try {
            const employeeChoice = await EmployeeChoices.findByPk(choice_id);
            if (!employeeChoice) {
                throw new Error("Employee choice not found");
            }
            return employeeChoice;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateEmployeeChoice(choice_id: number, user_id: number, menu_id: number, item_id: number, quantity_chosen: number) {
        try {
            const employeeChoice = await EmployeeChoices.findByPk(choice_id);
            if (!employeeChoice) {
                throw new Error("Employee choice not found");
            }
            employeeChoice.user_id = user_id;
            employeeChoice.menu_id = menu_id;
            employeeChoice.item_id = item_id;
            employeeChoice.quantity_chosen = quantity_chosen;
            await employeeChoice.save();
            return employeeChoice;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteEmployeeChoice(choice_id: number) {
        try {
            const employeeChoice = await EmployeeChoices.findByPk(choice_id);
            if (!employeeChoice) {
                throw new Error("Employee choice not found");
            }
            await employeeChoice.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default EmployeeChoicesService;
