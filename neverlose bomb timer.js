UI.AddSubTab(["Rage", "SUBTAB_MGR"], "Yumeno")
UI.AddSliderInt(["Rage", "Yumeno", "Yumeno"], "Bomb timer x", 0, Render.GetScreenSize()[0])
UI.AddSliderInt(["Rage", "Yumeno", "Yumeno"], "Bomb timer y", 0, Render.GetScreenSize()[1])
UI.AddDropdown(["Rage", "Yumeno", "Yumeno"], "Theme", ["Black", "White"], 0)
var bomb_site,kb,xo,yo;
function render_main() {
    x = UI.GetValue(["Rage", "Yumeno", "Yumeno", 'Bomb timer x'])
    y = UI.GetValue(["Rage", "Yumeno", "Yumeno", 'Bomb timer y'])
    bomb_timer_background = UI.GetValue(["Rage", "Yumeno", "Yumeno", 'Theme']) == 0 ? [13, 13, 13, 210] : [245, 245, 245, 210];
    bomb_timer_text = UI.GetValue(["Rage", "Yumeno", "Yumeno", 'Theme']) == 1 ? [0, 0, 0, 255] : [240, 240, 240, 255];
    bomb_timer_text_2 = UI.GetValue(["Rage", "Yumeno", "Yumeno", 'Theme']) == 1 ? [48, 223, 255, 255] : [109, 232, 255, 255];

    var font_icon = Render.GetFont("bomb.ttf", 18, true);
    //Vars
    var c4 = Entity.GetEntitiesByClassID(129)[0];
    if(c4 != undefined) {
        //Default C4
        var eLoc = Entity.GetRenderOrigin(c4);
        var lLoc = Entity.GetRenderOrigin(Entity.GetLocalPlayer())
        var distance = calcDist(eLoc, lLoc);

        var timer = (Entity.GetProp(c4, "CPlantedC4", "m_flC4Blow") - Globals.Curtime()); // c4 left time
        var isbombticking = Entity.GetProp(c4, "CPlantedC4", "m_bBombTicking");

        //Damage math C4
        var armor = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayerResource", "m_iArmor"); // player armor
        var health = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_iHealth"); // player health

        const a = 450.7;
        const b = 75.68;
        const c = 789.2;
        const d = (distance - b) / c;
        var damage = a * Math.exp(-d * d);
        if(armor > 0) {
            var newDmg = damage * 0.5;
            var armorDmg = (damage - newDmg) * 0.5;
            if(armorDmg > armor) {
                armor = armor * (1 / .5);
                newDmg = damage - armorDmg;
            }
            damage = newDmg;
        }
        dmg = parseInt(damage);
        dmg_color = dmg >= health ? [255,74,74,255] : bomb_timer_text_2;

        //Get site C4
        var bombsite = Entity.GetProp(c4, "CPlantedC4", "m_nBombSite");
        if(bombsite == 0) bomb_site = "A"
        else bomb_site = "B";

        //Defuse C4
        var gotdefused = Entity.GetProp(c4, "CPlantedC4", "m_bBombDefused"); // check if bomb has or hasnt defused
        var isbeingdefused = Entity.GetProp(c4, "CPlantedC4", "m_hBombDefuser"); // check if bomb is being defused
        var deftimer = (Entity.GetProp(c4, "CPlantedC4", "m_flDefuseCountDown") - Globals.Curtime()); // timer when defusing

        timer_1 = isbeingdefused > 0 ? deftimer : timer;
        circle_value = isbeingdefused > 0 ? 70 : 8.75;

        if(!isbombticking) return;
        if(gotdefused) return;
        timer = parseFloat(timer.toPrecision(3));
       
        if(timer >= 0.1) {
            add_value = timer_1 < 10 ? 144 : 141

            Render.FilledRoundRect(x, y, 175, 40, bomb_timer_background) //Background
            Render.String(x + 2, y + 7, 0, "W", bomb_timer_text, font_icon); //Bomb icon
            Render.String(x + add_value, y + 15, 0, timer_1.toFixed(1), bomb_timer_text, Render.GetFont("MuseoSansCyrl-700.ttf", 11, false)); //Bomb time
            Render.String(x + 30, y + 4, 0, "Site: ", bomb_timer_text, Render.GetFont("MuseoSansCyrl-700.ttf", 13, false)); //Site
            Render.String(x + 62, y + 5, 1, bomb_site, bomb_timer_text_2, Render.GetFont("MuseoSansCyrl-700.ttf", 13, false)); //Site place
            Render.String(x + 30, y + 20, 0, "Damage: ", bomb_timer_text, Render.GetFont("MuseoSansCyrl-700.ttf", 13, false)); //Damage
            Render.String(x + 100, y + 21, 1, "" + dmg, bomb_timer_text_2, Render.GetFont("MuseoSansCyrl-700.ttf", 12, false)); //Damage value
            Render.Arc(x + 151, y + 20, 16, -90, 350, 2, [10,10,10,255])
            Render.Arc(x + 151, y + 20, 16, -90, 350, 1, [10,10,10,255])
            Render.Arc(x + 151, y + 20, 16, -90, circle_value*timer_1.toFixed(1), 2, bomb_timer_text_2)
            Render.Arc(x + 151, y + 20, 16, -90, circle_value*timer_1.toFixed(1), 1, bomb_timer_text_2)

        }
       

    }

    if(UI.IsMenuOpen() && Input.IsKeyPressed(0x1)) {
        const mousep = Global.GetCursorPosition()
        if (in_bounds(mousep, x, y, x + 200, y + 50)) {
            if(!kb){ // backup condition
                xo = mousep[0] - x
                yo = mousep[1] - y
                kb = true
            }
            UI.SetValue(["Rage", "Yumeno", "Yumeno", "Bomb timer x"], mousep[0] - xo)
            UI.SetValue(["Rage", "Yumeno", "Yumeno", "Bomb timer y"], mousep[1] - yo)
        }
    } else if(kb) kb = false //Backup condition #2

}

Cheat.RegisterCallback("Draw", "render_main")

function calcDist(local, target) {
    var lx = local[0];
    var ly = local[1];
    var lz = local[2];
    var tx = target[0];
    var ty = target[1];
    var tz = target[2];
    var dx = lx - tx;
    var dy = ly - ty;
    var dz = lz - tz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function in_bounds(vec, x, y, x2, y2) { //in bounds function
    return (vec[0] > x) && (vec[1] > y) && (vec[0] < x2) && (vec[1] < y2)
}

Render.Arc = function(x, y, radius, start_angle, percent, thickness, color) {
    var precision = (2 * Math.PI) / 30;
    var step = Math.PI / 180;
    var inner = radius - thickness;
    var end_angle = (start_angle + percent) * step;
    var start_angle = (start_angle * Math.PI) / 180;

    for (; radius > inner; --radius) {
        for (var angle = start_angle; angle < end_angle; angle += precision) {
            var cx = Math.round(x + radius * Math.cos(angle));
            var cy = Math.round(y + radius * Math.sin(angle));

            var cx2 = Math.round(x + radius * Math.cos(angle + precision));
            var cy2 = Math.round(y + radius * Math.sin(angle + precision));

            Render.Line(cx, cy, cx2, cy2, color);
        }
    }
};

Render.FilledRoundRect = function(x, y, w, h, color) {
    Render.Line(x + 3, y + h, x + w - 2, y + h, color);//bottom
    Render.Line(x, y + 3, x, y + h - 2, color);//left
    Render.Line(x + w, y + 3, x + w, y + h - 2, color);//right
    Render.Line(x + 3, y, x + w - 2, y, color);//top
    Render.FilledRect(x + 1, y + 1, w - 1, h - 1, color);
    Render.Arc(x + 3, y + 3, 3, 2, 180, 90, 12, color);//TL
    Render.Arc(x + w - 3, y + 3, 3, 2, 270, 90, 12, color);//TR
    Render.Arc(x + 3, y + h - 3, 3, 2, 90, 90, 12, color);//BL
    Render.Arc(x + w - 3, y + h - 3, 3, 2, 0, 90, 12, color);//BR
}
