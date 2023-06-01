const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fetch = require("node-fetch");

const postApi = async (body) => {
  const response = await fetch("your api address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hasura-Role": "public",
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return json;
};

const apiId = "YOUR API ID";
const apiHash = "YOUR API HASH";
const stringSession = new StringSession(""); // after first run, paste the string session here

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");

  client.addEventHandler(async (event) => {
    if (event.message) {
      const res = await postApi(event.message);
      console.log(res);
    }
  });
})();
