# ChatGPT-History
**Note that this won't actually save any chatlogs, just the conversation state so you can resume the conversation.**

Save and Load ChatGPT Conversations. ChatGPT is soon to add their own functionality to save chats, but thought I'd share this in the meantime. Should be able to work in any browser, but I've only tested in on Opera (chromium based).

# Instructions

To install, you will need a userscript loader, such as [tampermonkey](https://www.tampermonkey.net/). Simply create a new script, and paste `main.js`.

To save, first enter the name for the chat in the bottom textbox. An empty textbox will result in chat being named 'Unnamed Chat'. Clicking the save button next to the like/dislike buttons saves the chat. You can't save the most recent message due to limitations with my methodology, just send another message and you should be good.

To load, click the new load button on the lefthand side of the screen. It won't look like it did anything, but your next chat will resume from the save point.

I have the delete button set to double click to prevent accidental deletes.
