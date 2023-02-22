/* eslint-disable */
const request = require("request");
const fs = require("fs");

export function iwa({id, maxImages, file, pretty, time, base64images, headers}: any) {
    if (!id) id = "therock";
    if (!maxImages || Number.isNaN(maxImages)) maxImages = 12;
    if (!pretty) pretty = false;
    if (Number.isNaN(time)) time = 3600;
    if (!base64images) base64images = false;
    if (!headers) headers = {};

    const options = {
        url: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${id}`,
        headers,
    };

    function requestAsync(options: any) {
        let result: any = [];
        return new Promise(function (resolve) {
            request(options, async (error: any, res: any, body: any) => {
                console.log(body);
                if (!error && res.statusCode == 200) {
                    let json = null;
                    try {
                        json = JSON.parse(body);
                    } catch (e) {
                        console.log(e);
                    }
                    console.log(json);
                    if (!json) return;
                    const items = json?.data?.user?.edge_owner_to_timeline_media?.edges || [];
                    const filteredItems = items?.filter((el: any, index: any) => {
                        return !maxImages ? el : index < maxImages;
                    });
                    const mappedItems = await Promise.all(
                        filteredItems.map(async (el: any) => {
                            let obj = {
                                id: el["node"]["id"],
                                time: el["node"]["taken_at_timestamp"],
                                imageUrl: el["node"]["display_url"],
                                likes: el["node"]["edge_liked_by"]["count"],
                                comments: el["node"]["edge_media_to_comment"]["count"],
                                link: "https://www.instagram.com/p/" + el["node"]["shortcode"] + "/",
                                text: el["node"]["edge_media_to_caption"]["edges"][0]["node"]["text"],
                            };

                            return obj;
                        }),
                    );
                    result = mappedItems;
                }

                resolve(result);
            });
        });
    }

    return init({file, time, callback: requestAsync, options});
}

function init({file, time, callback, options}: any) {
    return new Promise(function (resolve) {
        let result: any = [];
        try {
            fs.stat(file, async (err: any, stats: any) => {
                if (err) {
                    result = await callback(options);
                    resolve(result);
                    return;
                }
                const date = new Date();
                const unixTimestampNow = Math.floor(date.getTime() / 1000);
                const unixTimestamp = Math.floor(stats.mtime.getTime() / 1000);
                // console.log(unixTimestampNow - unixTimestamp >= time);
                if (unixTimestampNow - unixTimestamp >= time) result = await callback(options);
                else result = JSON.parse(fs.readFileSync(file, "utf8") || []);
                resolve(result);
            });
        } catch (err) {
            resolve(result);
        }
    });
}
