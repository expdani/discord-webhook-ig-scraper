import { env } from "../environment";
import { getRecentPosts } from "./scraper";
import fetch from "node-fetch";
import fetchList from "../fetchList.json";

const headers = {
    cookie: env.IG_COOKIE,
    "user-agent": env.USER_AGENT,
    "x-ig-app-id": env.IG_APP_ID,
};

const cachedIds: string[] = [];
let initial = true;

async function main() {
    for await (const item of fetchList.fetchList) {
        await fetchInstagram(item);
    }
}

async function fetchInstagram(item: any) {
    const response = await getRecentPosts({
        headers,
        maxImages: 1,
        pretty: true,
        id: item.id,
    });

    console.log(response[0]?.text || "");

    if (response.length < 1) return;
    if (cachedIds.includes(response[0].id)) return;

    cachedIds.push(response[0].id);

    if (!initial) await sendToDiscord(item.name, item.avatar, response[0]);
    if (cachedIds.length >= fetchList.fetchList.length) initial = false;
}

async function sendToDiscord(name: string, avatar: string, post: any) {
    const msg: any = {
        avatar_url: avatar,
        username: name,
        embeds: [
            {
                description: replaceStrings(post.text),
                image: { url: post.imageUrl },
            },
        ],
    };

    await fetch(env.WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(msg),
        headers: {
            "Content-Type": "application/json",
        },
    }).catch((e) => console.log(e));
}

function replaceStrings(text: string): string {
    const newText = text
        .replace("@kristelverbeke", "<@320273356501024769>")
        .replace("@genethomasmusic", "<@224444822109290496>")
        .replace("@lilythomas09", "<@55035219484344320>")
        .replace("@nanouthomas01", "<@656861522718621717>");

    return newText;
}

main();
setInterval(main, 300000);
