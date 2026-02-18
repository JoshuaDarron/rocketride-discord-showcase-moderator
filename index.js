import "dotenv/config";
import pkg from "discord.js";

const { Client, Intents } = pkg;

const client = new Client({
	  intents: [
		      Intents.FLAGS.GUILDS,
		      Intents.FLAGS.GUILD_MESSAGES,
		      Intents.FLAGS.DIRECT_MESSAGES,
		    ],
	  partials: ["CHANNEL"], // required for DMs in v13
});

const SHOWCASE_CHANNEL_ID = process.env.SHOWCASE_CHANNEL_ID;

const REQUIRED_FIELDS = [
	  /project name/i,
	  /track:\s*(startup|internal tool|ai system)/i,
	  /problem:/i,
	  /what i built:/i,
	  /how it uses/i,
	  /(demo|repo):/i,
	  /current status:/i,
	  /feedback wanted:/i,
];

const TEMPLATE = `
Project Name:

Track: Startup | Internal Tool | AI System

Problem:

What I built:

How it uses our platform:

Demo / Repo:

Current status:
(Prototype / MVP / Production)

Feedback wanted:
`;

client.on("messageCreate", async (message) => {
	  if (message.author.bot) return;
	  if (message.channelId !== SHOWCASE_CHANNEL_ID) return;

	  setTimeout(async () => {
		      const refreshed = await message.fetch();

		      const valid = REQUIRED_FIELDS.every((r) =>
			            r.test(refreshed.content)
			          );

		      if (!valid) {
			            await refreshed.delete();

			            try {
					            await refreshed.author.send(
							              `Hey! 👋  

							    Your post was removed because it didn’t follow the Showcase template.

							    Please repost using:

							    ${TEMPLATE}`
							            );
					          } catch {
							          console.log("Could not DM user.");
							        }
			          }
		    }, 30000);
});

client.once("ready", () => {
	  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);

