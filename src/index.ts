/* eslint-disable */

import {env} from "../environment";
import {iwa} from "./scraper";

async function fetch() {
    const responseIwa = await iwa({
        headers: {
            cookie: env.IG_COOKIE,
            "user-agent": env.USER_AGENT,
            "x-ig-app-id": env.IG_APP_ID,
        },
        base64images: false,
        maxImages: 1,
        pretty: true,
        time: 3600,
        id: "monkeloidtv",
    });

    console.log({responseIwa});
}

fetch();
