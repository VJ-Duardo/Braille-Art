var channel_id = 0;
const corsproxy = "https://cors-anywhere.herokuapp.com/";


function get_json_prom(url){
    return fetch(url)
            .then(response => response.json())
            .then(json => (json));
}


function search_ffz(channel, emote){
    let ffz_global = 'https://api.frankerfacez.com/v1/set/global';
    let ffz_channel = 'https://api.frankerfacez.com/v1/room/' + channel;
    
    function iterate_ffz(obj, attribute){
        for (const item of obj['sets'][attribute]['emoticons']){
            if (item['name'] === emote){
                let sizes = ['4', '2', '1'];
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
        .then((json_obj) => {
            let attributes = ['3', '4330'];
            for (const attr of attributes){
                let search_result = iterate_ffz(json_obj, attr);
                if (search_result !== -1){
                    return search_result;
                }
            }
            return get_json_prom(ffz_channel)
                .then((json_obj) => {
                    if (json_obj.hasOwnProperty("error")){
                        return;
                    }
                    channel_id = json_obj['room']['twitch_id'];
                    let search_result = iterate_ffz(json_obj, json_obj['room']['set']);
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
                return twitch_metrics + item['id'] + '/4.0';
            }
        }
        return -1;
    }
    
    return get_json_prom(corsproxy + twitch_global)
        .then((global_obj) => {
            let search_result = iterate_twitch(global_obj);
            if (search_result === -1){
                console.log("notfound");
            } else {
                return search_result;
            }
            return get_json_prom(corsproxy + (twitch_channel + channel_id))
                .then((json_obj) => {
                    console.log(channel_id);
                    let search_result = iterate_twitch(json_obj);
                    if (search_result === -1){
                        console.log("notfound");
                    } else {
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
                });
    });
}