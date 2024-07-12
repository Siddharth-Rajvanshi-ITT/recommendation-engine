import express, { Application } from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import sequelize from "./config/database";
import AuthEventHandler from "./eventHandlers/auth";
import UserEventHandler from "./eventHandlers/user";
import DailyMenuItemEventHandler from "./eventHandlers/dailyMenuItems";
import FeedbackEventHandler from "./eventHandlers/feedback";
import MenuItemEventHandler from "./eventHandlers/menuItem";
import NotificationEventHandler from "./eventHandlers/notification";
import RecommendationEventHandler from "./eventHandlers/recommendation";
import DailyRolloutEventHandler from "./eventHandlers/dailyRollout";
import VoteItemEventHandler from "./eventHandlers/voteItem";
import DailyUserVoteEventHandler from "./eventHandlers/dailyUserVote";
import DailyItemSubmissionEventHandler from "./eventHandlers/dailyItemSubmission";
import DailyUserFeedbackEventHandler from "./eventHandlers/dailyUserFeedback";
import DiscardRollOutEventHandler from "./eventHandlers/discardRollout";
import DiscardFeedbackEventHandler from "./eventHandlers/discardFeedback";
import EmployeePreferencesEventHandler from "./eventHandlers/employeePreferences";
import MenuAttributesEventHandler from "./eventHandlers/menuAttributes";

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket: Socket) => {

    const authEventHandler = new AuthEventHandler(socket)
    const userEventHandler = new UserEventHandler(socket)
    const dailyMenuItemEventHandler = new DailyMenuItemEventHandler(socket)
    const feedbackEventHandler = new FeedbackEventHandler(socket)
    const menuItemEventHandler = new MenuItemEventHandler(socket)
    const notificationEventHandler = new NotificationEventHandler(socket)
    const recommendationEventHandler = new RecommendationEventHandler(socket)
    const dailyRolloutEventHandler = new DailyRolloutEventHandler(socket)
    const voteItemEventHandler = new VoteItemEventHandler(socket);
    const dailyUserVoteEventHandler = new DailyUserVoteEventHandler(socket);
    const dailyItemSubmissionEventHandler = new DailyItemSubmissionEventHandler(socket);
    const dailyUserFeedbackEventHandler = new DailyUserFeedbackEventHandler(socket);
    const discadFeedbackEventHandler = new DiscardFeedbackEventHandler(socket);
    const discardRollOutEventHandler = new DiscardRollOutEventHandler(socket);
    const employeePreferencesEventHandler = new EmployeePreferencesEventHandler(socket);
    const menuAttributesEventHandler = new MenuAttributesEventHandler(socket);

    console.log(`New client connected: ${socket.id}`);

    authEventHandler.listen()
    userEventHandler.listen()
    dailyMenuItemEventHandler.listen()
    feedbackEventHandler.listen()
    menuItemEventHandler.listen()
    notificationEventHandler.listen()
    recommendationEventHandler.listen()
    dailyRolloutEventHandler.listen()
    voteItemEventHandler.listen()
    dailyUserVoteEventHandler.listen()
    dailyItemSubmissionEventHandler.listen()
    dailyUserFeedbackEventHandler.listen()
    discadFeedbackEventHandler.listen()
    discardRollOutEventHandler.listen()
    employeePreferencesEventHandler.listen()
    menuAttributesEventHandler.listen()

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
