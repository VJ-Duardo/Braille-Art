var channel_id = 0;


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
                if (search_result === -1){
                    console.log("notfound");
                } else {
                    return search_result;
                }
            }
            return get_json_prom(ffz_channel)
                .then((json_obj) => {
                    channel_id = json_obj['room']['twitch_id']
                    let search_result = iterate_ffz(json_obj, json_obj['room']['set']);
                    if (search_result === -1){
                        console.log("notfound");
                    } else {
                        return search_result;
                    }
                });
        });
}