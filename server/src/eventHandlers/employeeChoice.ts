import { Socket } from "socket.io";

import EmployeeChoiceSocketHandler from "../socketHandlers/employeeChoices";

const employeeChoiceSocketHandler = new EmployeeChoiceSocketHandler();


export default class EmployeeChoiceEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createEmployeeChoice", async (data) => {
            await employeeChoiceSocketHandler.createEmployeeChoice(this.socket, data);
        });
        this.socket.on("getEmployeeChoices", async () => {
            await employeeChoiceSocketHandler.getEmployeeChoices(this.socket);
        });
        this.socket.on("getEmployeeChoiceById", async (data) => {
            await employeeChoiceSocketHandler.getEmployeeChoiceById(this.socket, data);
        });
        this.socket.on("updateEmployeeChoice", async (data) => {
            await employeeChoiceSocketHandler.updateEmployeeChoice(this.socket, data);
        });
        this.socket.on("deleteEmployeeChoice", async (data) => {
            await employeeChoiceSocketHandler.deleteEmployeeChoice(this.socket, data);
        });
    }
}

