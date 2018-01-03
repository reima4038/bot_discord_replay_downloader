const config = require('config');
const Eris = require('eris');
const Client = require('node-rest-client').Client;
const Buffer = require("buffer").Buffer;

const bot = new Eris(config.token);

bot.on("ready", () => {
    console.log("Ready!");
});

bot.on("messageCreate", (msg) => {
    let message = msg.content.trim();
    console.log("input:" + message);
    switch (true){
        case /^!replay[ ]{1}[0-9]+$/.test(message):
            let matchId = message.split(" ")[1];
            execute(getReplayUrlCommand, msg, matchId);
            break;
        default:
    }
});

bot.connect();

/**
 * コマンドを実行する。
 * @param {実行コマンドのコールバック関数} cmd 
 */
function execute(cmd, msg, matchId){
    cmd(msg, matchId);
}

const client = new Client();
const baseUrl = config.baseUrl;

function getReplayUrlCommand(msg, matchId){
    client.get(encodeURI(baseUrl + "/api/dota/replays/{matchId}/url?matchId=" + matchId), function (data, response) {
        let url = new Buffer(data).toString();
        if(url.trim() == ""){
            bot.createMessage(msg.channel.id, "そのマッチIDのリプレイな、残念じゃがもう見られん。");
        } else {
            bot.createMessage(msg.channel.id, "できたけぇ、もっていきんさい。\n" + url);
        }

    }).on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手ういかんかった");
    }); 
}
