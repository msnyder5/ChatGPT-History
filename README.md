# ChatGPT-History
Save and Load ChatGPT Conversations.

ChatGPT is soon to add their own functionality to save chats, but thought I'd share this in the meantime.

# Instructions

To install, you will need a userscript loader, such as [tampermonkey](https://www.tampermonkey.net/). Simply create a new script, and paste in `main.js`.

To save, first enter the name for the chat in the bottom textbox. Empty box will result in chat being named 'Unnamed Chat'. Clicking the save button next to the like/dislike buttons saves the chat.

To load, click the new load button on the lefthand side of the screen. It won't look like it did anything, but your next chat will resume from the save point.

I haven't yet added functionality to delete saves, but you can do it yourself from `Inspect Element > Application > Storage > IndexedDB > ChatGPTHistory > chats`.
