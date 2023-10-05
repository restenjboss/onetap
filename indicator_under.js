var info = [
    ["DT", [["Rage", "Exploits", "Keys", "Double tap"]], [0, 255, 0, 255]],
    ["HIDE", [["Rage", "Exploits", "Keys", "Hide shots"]], [255, 255, 255, 255]],
];

function draw(){
    var keybinds = [];
    var screen = Global.GetScreenSize();
    var font = Render.GetFont("Verdana.ttf", 10, true);
    for(var i in info){
        if(UI.GetValue.apply(null, info[i][1])){
            keybinds.push(i);
        }
    }

    for(var j in keybinds){
        Render.String(screen[0] / 2, screen[1] / 2 + 10 - (j * -13), 1, info[keybinds[j]][0], info[keybinds[j]][2], font);
    }
}

Cheat.RegisterCallback("Draw", "draw");
