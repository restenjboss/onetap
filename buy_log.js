var logs = [];
const log = function(text, time){
    this.text = text
    this.time = time
}
const on_item_purchase = function() {
    if (Event.GetInt('team') != Entity.GetProp(Entity.GetLocalPlayer(), "CBaseEntity", "m_iTeamNum")) {
        var item = Event.GetString('weapon')
        item = item.replace("weapon_", "")
        item = item.replace("item_", "")
        item = item.replace("assaultsuit", "kevlar + helmet")
        item = item.replace("incgrenade", "molotov")
        if (item != "unknown"){
            const text = "[onetap] " + Entity.GetName(Entity.GetEntityFromUserID(Event.GetInt('userid'))) + " bought " + item;
            logs.push(new log(text, Globals.Tickcount()));
        }
    }
}

const draw = function(){
    const font = Render.GetFont("Calibri.ttf", 20, true);

    for (var i in logs){
        Render.String(5, 5 - (i * -15), 0, logs[i].text, [255, 255, 255, 255], font);
        if (logs[i].time + 300 < Globals.Tickcount()) logs.shift();
    }
}

Cheat.RegisterCallback("Draw", "draw");
Cheat.RegisterCallback("item_purchase", "on_item_purchase");
