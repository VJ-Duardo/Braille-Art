var channel_id = 0;
var sizes = ['4', '2', '1'];
const corsproxy = "https://cors-anywhere.herokuapp.com/";


function get_json_prom(url){
    return fetch(url)
            .then(response => response.json())
            .then(json => (json));
}

function check_image_url(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status !== 404){
        return true;
    } else {
        return false;
    }
}

function is_url(str){
    let regex = /(ftp|http|https):\/\/.+/;
    return regex.test(str);
}


function search_ffz(channel, emote){
    let ffz_global = 'https://api.frankerfacez.com/v1/set/global';
    let ffz_channel = 'https://api.frankerfacez.com/v1/room/' + channel;
    
    function iterate_ffz(obj, attribute){
        for (const item of obj['sets'][attribute]['emoticons']){
            if (item['name'] === emote){
                for (const size of sizes){
                    if (item['urls'].hasOwnProperty(size)){
                        return 'https:'+item['urls'][size];
                    }
                }
            }
        }
        return -1;
    }
    
    return get_json_prom(ffz_global)
        .then((global_obj) => {
            let attributes = ['3', '4330'];
            for (const attr of attributes){
                let search_result = iterate_ffz(global_obj, attr);
                if (search_result !== -1){
                    return search_result;
                }
            }
            return get_json_prom(ffz_channel)
                .then((channel_obj) => {
                    if (channel_obj.hasOwnProperty("error")){
                        return;
                    }
                    channel_id = channel_obj['room']['twitch_id'];
                    let search_result = iterate_ffz(channel_obj, channel_obj['room']['set']);
                    if (search_result !== -1){
                        return search_result;
                    }
                });
        });
}


function search_twitch(emote){
    let twitch_global = 'https://api.twitchemotes.com/api/v4/channels/0';
    let twitch_channel = 'https://api.twitchemotes.com/api/v4/channels/';
    let twitch_metrics = 'https://static-cdn.jtvnw.net/emoticons/v1/';
    
    function iterate_twitch(obj){
        if(obj.hasOwnProperty("error")){
            return -1;
        }
        for (const item of obj['emotes']){
            if (item['code'] === emote){
                for (const size of sizes){
                    let url = twitch_metrics + item['id'] + '/'+size+'.0';
                    if (check_image_url(corsproxy+url)){
                        return url;
                    }
                }
            }
        }
        return -1;
    }
    
    return get_json_prom(corsproxy + twitch_global)
        .then((global_obj) => {
            let search_result = iterate_twitch(global_obj);
            if (search_result !== -1){
                return search_result;
            }
            return get_json_prom(corsproxy + (twitch_channel + channel_id))
                .then((channel_obj) => {
                    let search_result = iterate_twitch(channel_obj);
                    if (search_result !== -1){
                        return search_result;
                    }
                });
        });
}


function search_bttv(channel, emote){
    let bttv_global = 'https://api.betterttv.net/2/emotes';
    let bttv_channel = 'https://api.betterttv.net/2/channels/' + channel;
    let bttv_pic_link = 'https://cdn.betterttv.net/emote/';
    
    function iterate_bttv(obj){
        if (obj.hasOwnProperty("message") && obj['message'] === "channel not found"){
            return -1;
        }
        for (const item of obj['emotes']){
            if (item['code'] === emote){
                for (const size of sizes){
                    let url = corsproxy + bttv_pic_link + item['id']+'/'+size+'x';
                    if (check_image_url(url)){
                        return url;
                    }
                }
                return corsproxy + bttv_pic_link + item['id']+'/2x';
            }
        }
        return -1;
    }
    
    return get_json_prom(bttv_global)
        .then((global_obj) => {
            let search_result = iterate_bttv(global_obj);
            if (search_result !== -1){
                return search_result;
            }
            return get_json_prom(bttv_channel)
                .then((channel_obj) => {
                    let search_result = iterate_bttv(channel_obj);
                    if (search_result !== -1){
                        return search_result;
                    }
                });
        });
    
}


function search_all(channel, emote){
    return search_ffz(channel, emote)
        .then ((result_ffz) => {
            if (typeof result_ffz !== 'undefined') {
                return result_ffz;
            }
            return search_twitch(emote)
                .then((result_twitch) => {
                    if (typeof result_twitch !== 'undefined') {
                        return result_twitch;
                    }
                    return search_bttv(channel, emote)
                        .then((result_bttv) => {
                            if (typeof result_bttv !== 'undefined') {
                                return result_bttv;
                            }
                        });
                });
        });
}