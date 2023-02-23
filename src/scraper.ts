/* eslint-disable */
const request = require("request");

export function getRecentPosts({ id, maxImages, pretty, headers }: any): any {
    if (!id) id = "therock";
    if (!maxImages || Number.isNaN(maxImages)) maxImages = 12;
    if (!pretty) pretty = false;
    if (!headers) headers = {};

    const options = {
        url: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${id}`,
        headers,
    };

    let result: any = [];
    return new Promise(function (resolve) {
        request(options, async (error: any, res: any, body: any) => {
            if (!error && res.statusCode == 200) {
                let json = null;
                try {
                    json = JSON.parse(body);
                } catch (e) {
                    console.log(e);
                }
                const items = json?.data?.user?.edge_owner_to_timeline_media?.edges || [];
                const filteredItems = items.filter((el: any, index: any) => {
                    return !maxImages ? el : index < maxImages;
                });
                const mappedItems = await Promise.all(
                    filteredItems.map(async (post: any) => {
                        const obj = {
                            id: post.node.id,
                            time: post.node.taken_at_timestamp,
                            imageUrl: post.node.display_url,
                            likes: post.node.edge_media_to_comment.count,
                            comments: post.node.edge_media_to_comment.count,
                            link: "https://www.instagram.com/p/" + post.node.shortcode + "/",
                            text: post?.node.edge_media_to_caption?.edges[0]?.node?.text,
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

// maybe for later
// export function iwaId({
//     id,
//     pretty,
//     headers
// }: any) {

//     if (!id) id = '2890411760684296309';
//     if (!pretty) pretty = false;
//     if (!headers) headers = {};

//     const options = {
//         url: `https://i.instagram.com/api/v1/media/${id}/info/`,
//         headers
//     };

// 	let result: any = []
// 	return new Promise(function (resolve) {
// 		request(options, async (error: any, res: any, body: any) => {
// 			if (!error && res.statusCode == 200) {
// 				let json = null
// 				try { json = JSON.parse(body); } catch (e) { }

// 				const item = json?.items?.[0] || false;
// 				const image =
// 					json?.['items']?.[0]?.['image_versions2']?.['candidates']?.[0]?.['url'] ?
// 						json['items'][0]['image_versions2']['candidates'][0] :
// 						json?.['items']?.[0]?.['carousel_media']?.[0]?.['image_versions2']?.['candidates']?.[0]?.['url'] ?
// 							json['items'][0]['carousel_media'][0]['image_versions2']['candidates'][0] :
// 							false;

// 				let mappedItems: any = [];

// 				if (item && image) {
// 					let comments: any= [];
// 					if (item['comments'] && item['comments'].length) {
// 						for (let i = 0; i < item['comments'].length; i++) {
// 							let value = item['comments']?.i;
// 							if (value) {
// 								comments.push({
// 									time: value['created_at_utc'],
// 									text: value['text'],
// 									user: {
// 										username: value['user']['username'],
// 										fullName: value['user']['full_name'],
// 										imageUrl: value['user']['profile_pic_url']
// 									}
// 								});
// 							}
// 						}
// 					}

// 					mappedItems = await Promise.all([item].map(async (el) => {
// 						let obj = {
// 							id,
// 							width: image['width'],
// 							height: image['height'],
// 							imageUrl: image['url'],
// 							time: el['taken_at'],
// 							topLikers: el['top_likers'],
// 							likes: el['like_count'],
// 							commentCount: el['comment_count'] || 0,
// 							comments,
// 							link: `https://www.instagram.com/p/${el['code']}/`,
// 							text: el?.['caption']?.['text'],
// 							user: {
// 								username: el?.['user']?.['username'],
// 								fullName: el?.['user']?.['full_name'],
// 								imageUrl: el?.['user']?.['profile_pic_url']
// 							}
// 						}
// 						return obj
// 					}));
// 				}
// 				result = mappedItems.length ? mappedItems[0] : {};
// 			}
// 			resolve(result);
// 		});
// 	});
// }
