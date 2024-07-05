import express, { Application } from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import sequelize from "./config/database";
import AuthEventHandler from "./eventHandlers/auth";
import UserEventHandler from "./eventHandlers/user";
import DailyMenuEventHandler from "./eventHandlers/dailyMenu";
import DailyMenuItemEventHandler from "./eventHandlers/dailyMenuItems";
import EmployeeChoiceEventHandler from "./eventHandlers/employeeChoice";
import FeedbackEventHandler from "./eventHandlers/feedback";
import MenuItemEventHandler from "./eventHandlers/menuItem";
import NotificationEventHandler from "./eventHandlers/notification";
import RecommendationEventHandler from "./eventHandlers/recommendation";
import DailyRolloutEventHandler from "./eventHandlers/dailyRollout";
import VoteItemEventHandler from "./eventHandlers/voteItem";
import DailyUserVoteEventHandler from "./eventHandlers/dailyUserVote";

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket: Socket) => {

    const authEventHandler = new AuthEventHandler(socket)
    const userEventHandler = new UserEventHandler(socket)
    const dailyMenuEventHandler = new DailyMenuEventHandler(socket)
    const dailyMenuItemEventHandler = new DailyMenuItemEventHandler(socket)
    const employeeChoicesEventHandler = new EmployeeChoiceEventHandler(socket)
    const feedbackEventHandler = new FeedbackEventHandler(socket)
    const menuItemEventHandler = new MenuItemEventHandler(socket)
    const notificationEventHandler = new NotificationEventHandler(socket)
    const recommendationEventHandler = new RecommendationEventHandler(socket)
    const dailyRolloutEventHandler = new DailyRolloutEventHandler(socket)
    const voteItemEventHandler = new VoteItemEventHandler(socket);
    const dailyUserVoteEventHandler = new DailyUserVoteEventHandler(socket);

    console.log(`New client connected: ${socket.id}`);

    authEventHandler.listen()
    userEventHandler.listen()
    dailyMenuEventHandler.listen()
    dailyMenuItemEventHandler.listen()
    employeeChoicesEventHandler.listen()
    feedbackEventHandler.listen()
    menuItemEventHandler.listen()
    notificationEventHandler.listen()
    recommendationEventHandler.listen()
    dailyRolloutEventHandler.listen()
    voteItemEventHandler.listen()
    dailyUserVoteEventHandler.listen()

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
