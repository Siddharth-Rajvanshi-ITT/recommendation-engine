import express, { Application } from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import sequelize from "./config/database";
import AuthSocketHandler from "./socketHandlers/auth";
import UserSocketHandler from "./socketHandlers/user";
import DailyMenuSocketHandler from "./socketHandlers/dailyMenu";
import DailyMenuItemSocketHandler from "./socketHandlers/dailyMenuItems"
import EmployeeChoicesSocketHandler from "./socketHandlers/employeeChoices"
import FeedbackSocketHandler from "./socketHandlers/feedback"
import MenuItemSocketHandler from "./socketHandlers/menuItem"
import NotificationSocketHandler from "./socketHandlers/notifications"

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const authController = new AuthSocketHandler();
const userController = new UserSocketHandler();
const dailyMenuController = new DailyMenuSocketHandler();
const dailyMenuItemController = new DailyMenuItemSocketHandler();
const employeeChoicesController = new EmployeeChoicesSocketHandler();
const feedbackController = new FeedbackSocketHandler();
const menuItemController = new MenuItemSocketHandler();
const notificationController = new NotificationSocketHandler();

io.on("connection", (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Auth events
    socket.on("login", async (data) => {
        await authController.login(socket, data);
    });

    // User events
    socket.on("createUser", async (data) => {
        await userController.createUser(socket, data);
    });
    socket.on("getUsers", async () => {
        await userController.getUsers(socket);
    });
    socket.on("getUserById", async (data) => {
        await userController.getUserById(socket, data);
    });
    socket.on("updateUser", async (data) => {
        await userController.updateUser(socket, data);
    });
    socket.on("deleteUser", async (data) => {
        await userController.deleteUser(socket, data);
    });

    // Daily Menu events
    socket.on("createDailyMenu", async (data) => {
        await dailyMenuController.createDailyMenu(socket, data);
    });
    socket.on("getDailyMenus", async () => {
        await dailyMenuController.getDailyMenus(socket);
    });
    socket.on("getDailyMenuById", async (data) => {
        await dailyMenuController.getDailyMenuById(socket, data);
    });
    socket.on("updateDailyMenu", async (data) => {
        await dailyMenuController.updateDailyMenu(socket, data);
    });
    socket.on("deleteDailyMenu", async (data) => {
        await dailyMenuController.deleteDailyMenu(socket, data);
    });

    // Daily Menu Item events
    socket.on("createDailyMenuItem", async (data) => {
        await dailyMenuItemController.createDailyMenuItem(socket, data);
    });
    socket.on("getDailyMenuItems", async () => {
        await dailyMenuItemController.getDailyMenuItems(socket);
    });
    socket.on("getDailyMenuItemById", async (data) => {
        await dailyMenuItemController.getDailyMenuItemById(socket, data);
    });
    socket.on("updateDailyMenuItem", async (data) => {
        await dailyMenuItemController.updateDailyMenuItem(socket, data);
    });
    socket.on("deleteDailyMenuItem", async (data) => {
        await dailyMenuItemController.deleteDailyMenuItem(socket, data);
    });

    // Employee Choices events
    socket.on("createEmployeeChoice", async (data) => {
        await employeeChoicesController.createEmployeeChoice(socket, data);
    });
    socket.on("getEmployeeChoices", async () => {
        await employeeChoicesController.getEmployeeChoices(socket);
    });
    socket.on("getEmployeeChoiceById", async (data) => {
        await employeeChoicesController.getEmployeeChoiceById(socket, data);
    });
    socket.on("updateEmployeeChoice", async (data) => {
        await employeeChoicesController.updateEmployeeChoice(socket, data);
    });
    socket.on("deleteEmployeeChoice", async (data) => {
        await employeeChoicesController.deleteEmployeeChoice(socket, data);
    });

    // Feedback events
    socket.on("createFeedback", async (data) => {
        await feedbackController.createFeedback(socket, data);
    });
    socket.on("getFeedbacks", async () => {
        await feedbackController.getFeedbacks(socket);
    });
    socket.on("getFeedbackById", async (data) => {
        await feedbackController.getFeedbackById(socket, data);
    });
    socket.on("updateFeedback", async (data) => {
        await feedbackController.updateFeedback(socket, data);
    });
    socket.on("deleteFeedback", async (data) => {
        await feedbackController.deleteFeedback(socket, data);
    });

    // Menu Item events
    socket.on("createMenuItem", async (data) => {
        await menuItemController.createMenuItem(socket, data);
    });
    socket.on("getMenuItems", async () => {
        await menuItemController.getMenuItems(socket);
    });
    socket.on("getMenuItemById", async (data) => {
        await menuItemController.getMenuItemById(socket, data);
    });
    socket.on("updateMenuItem", async (data) => {
        await menuItemController.updateMenuItem(socket, data);
    });
    socket.on("deleteMenuItem", async (data) => {
        await menuItemController.deleteMenuItem(socket, data);
    });
    socket.on("updateMenuItemAvailability", async (data) => {
        await menuItemController.updateMenuItemAvailability(socket, data);
    });

    // Notification events
    socket.on("createNotification", async (data) => {
        await notificationController.createNotification(socket, data);
    });
    socket.on("getNotifications", async () => {
        await notificationController.getNotifications(socket);
    });
    socket.on("getNotificationById", async (data) => {
        await notificationController.getNotificationById(socket, data);
    });
    socket.on("updateNotification", async (data) => {
        await notificationController.updateNotification(socket, data);
    });
    socket.on("deleteNotification", async (data) => {
        await notificationController.deleteNotification(socket, data);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

sequelize.sync()
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log(error);
    });

server.listen(8080, () => {
    console.log("Server running on port 8080");
});
