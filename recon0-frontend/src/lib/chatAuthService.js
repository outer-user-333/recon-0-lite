import { supabase } from './supabaseChatClient';

const CHAT_USER_EMAIL = 'chat-user@system.com';
const CHAT_USER_PASSWORD = 'password123';

// This function will log into the chat service once per session.
// We use a flag to prevent it from running on every component re-render.
let isChatLoggedIn = false;

export const loginChatUser = async () => {
    if (isChatLoggedIn) {
        return; // Already logged in
    }

    // eslint-disable-next-line no-unused-vars
    const { data, error } = await supabase.auth.signInWithPassword({
        email: CHAT_USER_EMAIL,
        password: CHAT_USER_PASSWORD,
    });

    if (error) {
        console.error('Error logging into chat service:', error.message);
    } else {
        console.log('Successfully logged into chat service!');
        isChatLoggedIn = true;
    }
};