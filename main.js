// ==UserScript==
// @name         ChatGPT History.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save and load ChatGPT Threads.
// @author       Snipes
// @require 	 https://jpillora.com/xhook/dist/xhook.js
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==


// THIS SAVES 1 MESSAGE IN THE PAST.
// If you want to save all of your history, give ChatGPT a trash prompt before saving.


// This script is very bad, but it works. I might try to make it more user friendly in the future.
// Saving and loading is done from developer console.
// To save: Call saveChatGPT(); from console. Copy the information it gives you.
// To load: Call the function given to you by saveChatGPT, i.e. loadChatGPT(conversationID, parentID);

let lastConversationId = undefined;
let lastParentMessageId = undefined;
let loadConversationId = undefined;
let loadParentMessageId = undefined;

let initDBRequest = indexedDB.open("ChatGPTHistory", 1);
initDBRequest.onsuccess = function() {
    let db = initDBRequest.result;
    let transaction = db.transaction(["chats"], "readwrite");
    let store = transaction.objectStore('chats');
    let getAllRequest = store.getAll();
    getAllRequest.onsuccess = function () {
        setTimeout(() => {getAllRequest.result.forEach((chat) => {addLoadButton(chat)})}, 1000);
    }
};
initDBRequest.onupgradeneeded = function() {
    let db = initDBRequest.result;
    db.createObjectStore('chats', {keyPath: 'date'});
};

function createElementFromString(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

let saveButton = createElementFromString('<button class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M7.12,8.46L8.46,9.88L9.88,8.46L8.46,7.12L7.12,8.46M11,15H13V17H11V15M15,11H17V13H15V11M7.46,9.88L9.88,7.46L7.46,5.04L5.04,7.46L7.46,9.88M8.46,15L7.12,16.34L9.88,19L12.62,16.34L11.28,15L9.88,16.34L8.46,15M16.34,11.28L15,9.88L17.66,7.46L19.08,9.88L17.66,11.28L19.08,12.62L17.66,14L15,11.28L16.34,11.28Z" /></svg></button>');

function addLoadButton(chat) {
    let seperator = document.querySelector('#__next > div.overflow-hidden.w-full.h-full.relative > div.hidden.bg-gray-900 > div > div > nav > div');
    let name = chat.name;
    let loadButton = createElementFromString(`<a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path fill="none" d="M0 0h24v24H0z"/></svg>${chat.name}</a>`);
    seperator.prepend(loadButton);
    loadButton.addEventListener("click", () => {
        loadConversationId = chat.conversation_id;
        loadParentMessageId = chat.parent_message_id;
    });
}

function saveChat(name, date, conversation_id, parent_message_id) {
    console.log([name, date, conversation_id, parent_message_id]);
    let openDBRequest = indexedDB.open("ChatGPTHistory", 1);
    openDBRequest.onsuccess = function() {
        let db = openDBRequest.result;
        let transaction = db.transaction(["chats"], "readwrite");
        let store = transaction.objectStore('chats');
        if (name === '') {
            name = 'Unnamed Chat';
        }
        let chat = {
            date: date,
            name: name,
            conversation_id: conversation_id,
            parent_message_id: parent_message_id
        }
        store.add(chat);
        addLoadButton(chat);
    };
}

function addSaveButton() {
    let chat = document.querySelector("body > div > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full.flex-1.flex-col > main > div.flex-1.overflow-hidden > div > div > div > div:nth-last-child(2) > div > div.relative.flex.w-full.flex-col > div.self-end");
    if (chat) {
        chat.appendChild(saveButton);
        let conversation_id = (' ' + lastConversationId).slice(1);
        let parent_message_id = (' ' + lastParentMessageId).slice(1);
        saveButton.addEventListener("click", () => {
            let name = document.querySelector('#__next > div > div.flex.h-full.flex-1 > main > div.absolute.bottom-0.left-0.w-full > form > div > div.flex.flex-col.w-full.py-2.pl-3.relative.border > textarea').innerHTML;
            saveChat(name, Date.now(), conversation_id, parent_message_id);
        });
    }
}

xhook.before(function (request) {
    if (request.url === "https://chat.openai.com/backend-api/conversation") {
        let body = JSON.parse(request.body);
        if (loadParentMessageId) {
            body.parent_message_id = loadParentMessageId;
            body.conversation_id = loadConversationId;
            request.body = JSON.stringify(body);
            loadConversationId = undefined;
            loadParentMessageId = undefined;
        } else {
            lastConversationId = body.conversation_id;
            lastParentMessageId = body.parent_message_id;
            console.log(body);
            addSaveButton();
        }
    }
});
