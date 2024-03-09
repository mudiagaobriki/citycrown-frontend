// import redux and persist plugins
import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session';
// import persistStore from 'redux-persist/es/persistStore';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from 'redux-persist';

// import theme reducers
import settingsReducer from 'settings/settingsSlice';
import layoutReducer from 'layout/layoutSlice';
import langReducer from 'lang/langSlice';
import authReducer from 'auth/authSlice';
import menuReducer from 'layout/nav/main-menu/menuSlice';
import notificationReducer from 'layout/nav/notifications/notificationSlice';
import scrollspyReducer from 'components/scrollspy/scrollspySlice';

// import app reducers
import calendarReducer from 'views/apps/calendar/calendarSlice';
import contactsReducer from 'views/apps/contacts/contactsSlice';
import chatReducer from 'views/apps/chat/chatSlice';
import mailboxReducer from 'views/apps/mailbox/mailboxSlice';
import tasksReducer from 'views/apps/tasks/tasksSlice';

// import persist key
import { REDUX_PERSIST_KEY } from 'config.js';
import depositReducer from "./auth/depositSlice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['menu', 'settings', 'lang', 'auth', 'deposit'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    auth: authReducer,
    deposit: depositReducer,
    menu: menuReducer,
    notification: notificationReducer,
    scrollspy: scrollspyReducer,
    calendar: calendarReducer,
    contacts: contactsReducer,
    chat: chatReducer,
    mailbox: mailboxReducer,
    tasks: tasksReducer,
  })
);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistedStore = persistStore(store);
export { store, persistedStore };
