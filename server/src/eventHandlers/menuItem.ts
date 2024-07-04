import { Socket } from "socket.io";
import MenuItemSocketHandler from "../controllers/menuItem";

const menuItemSocketHandler = new MenuItemSocketHandler();


export default class MenuItemEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createMenuItem", async (data) => {
            await menuItemSocketHandler.createMenuItem(this.socket, data);
        });
        this.socket.on("getMenuItems", async () => {
            await menuItemSocketHandler.getMenuItems(this.socket);
        });
        this.socket.on("getMenuItemById", async (data) => {
            await menuItemSocketHandler.getMenuItemById(this.socket, data);
        });
        this.socket.on("getMenuItemByIds", async (data) => {
            await menuItemSocketHandler.getMenuItemByIds(this.socket, data);
        });
        this.socket.on("updateMenuItem", async (data) => {
            await menuItemSocketHandler.updateMenuItem(this.socket, data);
        });
        this.socket.on("deleteMenuItem", async (data) => {
            await menuItemSocketHandler.deleteMenuItem(this.socket, data);
        });
        this.socket.on("updateMenuItemAvailability", async (data) => {
            await menuItemSocketHandler.updateMenuItemAvailability(this.socket, data);
        });
    }
}

