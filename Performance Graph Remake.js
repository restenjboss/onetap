UI.AddSubTab(["Rage", "SUBTAB_MGR"], "Yumeno")
UI.AddColorPicker(["Rage", "Yumeno", "Yumeno"], "Graph color")

Drag = function(x, y, width, height, Xmenu, Ymenu, item){
    var cursor = Global.GetCursorPosition();
    if ((cursor[0] >= x) && (cursor[0] <= x + width) && (cursor[1] >= y) && (cursor[1] <= y + height)) {
        if ((Global.IsKeyPressed(0x01)) && (item[0] == 0)) {
            item[0] = 1;
            item[1] = x - cursor[0];
            item[2] = y - cursor[1];
        }
}
if (!Global.IsKeyPressed(0x01)) item[0] = 0;
if (item[0] == 1 && UI.IsMenuOpen()) {
    UI.SetValue(["Rage", "Yumeno", "Yumeno",Xmenu], cursor[0] + item[1]);
    UI.SetValue(["Rage", "Yumeno", "Yumeno", Ymenu], cursor[1] + item[2]);
}
};
var drag = [0, 0, 0]
var flFramerate = 0;
var fps_info = [];
var ping_info = [];
var last_time = Global.Curtime();

const window_x = UI.AddSliderInt(["Rage", "Yumeno", "Yumeno"], "performance_window_x", 0, Render.GetScreenSize()[0])
const window_y = UI.AddSliderInt(["Rage", "Yumeno", "Yumeno"], "performance_window_y", 0, Render.GetScreenSize()[0])

function draw_container() {
    const x = UI.GetValue(["Rage", "Yumeno", "Yumeno","performance_window_x"]), y = UI.GetValue(["Rage", "Yumeno", "Yumeno","performance_window_y"]);
    var avg = {'fps': 0, 'ping': 0};
    var fpsrate = flFramerate = 0.7 * flFramerate + 0.2 * Globals.Frametime();
    var fps = Math.round(1/fpsrate)
    var font = Render.GetFont('Verdana.ttf', 9, true)
    var font1 = Render.GetFont('Verdana.ttf', 8, true)
    var color = UI.GetColor(["Rage", "Yumeno", "Yumeno", "Graph color"]);
    Performanceicon = Render.AddTexture("ot/scripts/task.png");
    Render.FilledRect(x, y, 300*0.8, 20, [10, 10, 10, 255]);
    Render.FilledRect(x, y + 20, 300*0.8, 115, [15, 15, 15, 255]);
    Render.FilledRect(x, y + 130, 300*0.8, 15, [8, 8, 8, 255]);
    Render.FilledRect(x, y + 20, 50, 20, [35, 35, 35, 255]);
    Render.FilledRect(x, y + 40, 300*0.8, 2, [color[0], color[1], color[2], 255]); // полоска
    Render.FilledRect(x + 50, y + 40, 190, 2, [5, 5, 5, 180]);
    Render.FilledRect(x, y + 41, 300*0.8, 2, [10, 10, 10, 255]);
    Render.Text(x + 25, y + 25, 1, "FPS " + fps, [255, 255, 255, 255], font);
    Render.Text(x + 80, y + 25, 1, "CHK 0%", [255, 255, 255, 255], font);
    Render.Text(x + 130, y + 25, 1, "PING " + Math.floor(Global.Latency() + 0.5).toString(), [255, 255, 255, 255], font);
    Render.Text(x + 190, y + 25, 1, "LOSS 0.00lc", [255, 255, 255, 255], font);
    Render.TexturedRect( x + 2, y + 2, 15, 15, Performanceicon);
    Render.Text(x + 20, y + 3, 0, "Performance", [255, 255, 255, 200], font);
    Render.Text(x + 230, y + 5, 0, "x", [255, 255, 255, 200], font1);
    Render.Text(x + 200, y + 5, 0, "-", [255, 255, 255, 200], font1);
    Render.Rect(x + 215, y + 8, 5, 5, [150, 150, 150, 200]);
    Render.FilledRect(x + 226, y+4, 13, 13, [200, 35, 35, 100]);
    if (Global.Curtime() - last_time > 0.5) {
        last_time = Global.Curtime();
        fps_info.unshift(1 / Global.Frametime());
        ping_info.unshift(Global.Latency() + 5);
    }
    if (fps_info.length > 47) fps_info.pop();
    for (i = 0; i < fps_info.length; i++) {
        avg.fps += fps_info[i]
        Render.GradientRect( x + 235 - i * 5 - 5, y + 131 - fps_info[i] / Convar.GetInt("fps_max") * 70, 10, fps_info[i] / Convar.GetInt("fps_max") * 70, 0, [color[0], color[1], color[2], 0],[color[0], color[1], color[2], 255]
        );
    }
    avg.fps /= (fps_info.length === 0) ? 1 : fps_info.length;
    Render.Text(x + 217, y + 45, 0, "0.00", [255, 255, 255, 200], font1);
    Render.Text(x + 230, y + 132, 0, "0", [255, 255, 255, 200], font1);
    Render.Text(x + 5, y + 132, 0, "csgo.exe (64 bit)", [255, 255, 255, 200], font1);
    Render.Text(x + 5, y + 60, 0, "AVG: " + Math.floor(avg.fps + 0.5).toString(), [125, 100, 100, 135], font1);
    Render.Text(x + 5, y + 45, 0, fps.toString(), [200, 200, 200, 135], font1);
    Drag(x, y, 240, 140, "performance_window_x", "performance_window_y", drag);
}

function reset() {
    last_time = Global.Curtime();
    fps_info = [];
    ping_info = [];
}

Cheat.RegisterCallback("Draw", "draw_container");
Cheat.RegisterCallback("player_connect_full", "reset");

Render.Text = function(x, y, centered, text, color, font) {
    Render.String(x + 1, y + 1, centered, text, [0, 0, 0, color[3]], font);
    Render.String(x + 1, y + 1, centered, text, [0, 0, 0, color[3]], font);
    Render.String(x, y, centered, text, color, font);
}
