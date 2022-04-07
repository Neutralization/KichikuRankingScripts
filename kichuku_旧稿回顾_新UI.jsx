// @include "json2.js"

app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
app.newProject();
Part1 = app.project.items.addComp('旧稿回顾', 1920, 1080, 1, 25, 60);

VideoSize = [1564, 880];
CompSize = [1920, 1080];
CompFPS = 60;

StaticFolder = app.project.items.addFolder('StaticResource');
StaticResource = {
    mask: './绿幕抠图/!旧稿回顾.mov',
    next: './绿幕抠图/!NEXT.mp4',
    change: './绿幕抠图/!NEXT 旧稿回顾.mp4',
};

// LOAD DATA
jsondata = new File('data_旧稿.json');
jsondata.open('r');
content = jsondata.read();
jsondata.close();
AllData = JSON.parse(content);

OffsetData = {};
for (key = 0; key < AllData.length; key++) {
    rank = AllData[key]['rank'];
    StaticResource[rank + '_V'] = AllData[key]['video'];
    StaticResource[rank + '_T'] = AllData[key]['text'];
    OffsetData[rank] = AllData[key]['offset'];
}

for (key in StaticResource) {
    if (typeof StaticResource[key] != 'undefined') {
        ResourceFile = new ImportOptions(File(StaticResource[key]));
        ResourceFile.ImportAs = ImportAsType.FOOTAGE;
        FileItem = app.project.importFile(ResourceFile);
        FileItem.name = key;
        FileItem.parentFolder = StaticFolder;
    }
}

// ITEM INDEX
ResourceID = {};

function ReCountResource() {
    for (n = 1; n <= app.project.items.length; n++) {
        ResourceID[app.project.items[n].name] = n;
    }
}

// FUNCTION
function AddLayer(Target, Name, Duration, Offset) {
    NewLayer = Target.layers.add(app.project.items[ResourceID[Name]], Duration);
    NewLayer.startTime = Offset;
    return NewLayer;
}

function AddAudioProperty(Target, Ptype, Duration, Offset, Direction) {
    NewProperty = Target.property('Audio Levels');
    if (Ptype == 1) {
        // 1/4 circle
        if (Direction == 1) {
            // fade in
            for (t = Offset; t <= Offset + Duration; t += Duration / CompFPS) {
                NewProperty.setValueAtTime(t, [
                    (Math.sqrt(1 - Math.pow(1 - (t - Offset) / Duration, 2)) - 1) * 50,
                    (Math.sqrt(1 - Math.pow(1 - (t - Offset) / Duration, 2)) - 1) * 50,
                ]);
            }
            NewProperty.setValueAtTime(Offset, [-Infinity, -Infinity]);
        }
        if (Direction == 2) {
            // fade out
            for (t = Offset; t <= Offset + Duration; t += Duration / CompFPS) {
                NewProperty.setValueAtTime(t, [
                    (Math.sqrt(1 - Math.pow((t - Offset) / Duration, 2)) - 1) * 50,
                    (Math.sqrt(1 - Math.pow((t - Offset) / Duration, 2)) - 1) * 50,
                ]);
            }
            NewProperty.setValueAtTime(Offset + Duration, [-Infinity, -Infinity]);
        }
    }
    if (Ptype == 2) {
        // sin
        if (Direction == 1) {
            // fade in
            for (t = Offset; t <= Offset + Duration; t += Duration / CompFPS) {
                NewProperty.setValueAtTime(t, [
                    ((Math.cos((Math.PI * (t - Offset)) / Duration) + 1) / 2) * -50,
                    ((Math.cos((Math.PI * (t - Offset)) / Duration) + 1) / 2) * -50,
                ]);
            }
            NewProperty.setValueAtTime(Offset, [-Infinity, -Infinity]);
        }
        if (Direction == 2) {
            // fade out
            for (t = Offset; t <= Offset + Duration; t += Duration / CompFPS) {
                NewProperty.setValueAtTime(t, [
                    ((Math.cos((Math.PI * (t - Offset)) / Duration + Math.PI) + 1) / 2) * -50,
                    ((Math.cos((Math.PI * (t - Offset)) / Duration + Math.PI) + 1) / 2) * -50,
                ]);
            }
            NewProperty.setValueAtTime(Offset + Duration, [-Infinity, -Infinity]);
        }
    }
    return NewProperty;
}

function AddProgressBar(Target, Length, Position, Duration, Offset, Delay) {
    NewLayer = Target.layers.addShape();
    NewLayer.startTime = Offset;
    NewLayer.outPoint = Duration + Offset;
    NewLayer.name = 'Progress';
    VectorGroup = NewLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group').addProperty('ADBE Vectors Group');
    VectorGroup.addProperty('ADBE Vector Shape - Rect');
    VectorGroup.addProperty('ADBE Vector Graphic - Fill');
    VectorGroup.addProperty('ADBE Vector Graphic - Stroke');
    VectorGroup.property('ADBE Vector Shape - Rect')
        .property('ADBE Vector Rect Size')
        .setValueAtTime(Offset + Delay, [0, 8]);
    VectorGroup.property('ADBE Vector Shape - Rect')
        .property('ADBE Vector Rect Size')
        .setValueAtTime(Offset + 0.5 + Delay, [Length, 8]);
    VectorGroup.property('ADBE Vector Shape - Rect')
        .property('ADBE Vector Rect Size')
        .setValueAtTime(Offset + Duration, [0, 8]);
    VectorGroup.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(3);
    VectorGroup.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue([1, 1, 1, 1]);
    VectorGroup.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    NewLayer.property('Position').setValue(Position);
}

function BezierCurve(point1, point2, point3, point4, input_x) {
    function SolveCubic(func_a, func_b, func_c, func_d) {
        function SolveQuadratic(sfunc_a, sfunc_b, sfunc_c) {
            result = (-sfunc_b + Math.sqrt(Math.pow(sfunc_b, 2) - 4 * sfunc_a * sfunc_c)) / (2 * sfunc_a);
            if (result >= 0 && result <= 1) {
                return result;
            }
            result = (-sfunc_b - Math.sqrt(Math.pow(sfunc_b, 2) - 4 * sfunc_a * sfunc_c)) / (2 * sfunc_a);
            if (result >= 0 && result <= 1) {
                return result;
            }
            return null;
        }

        if (func_a == 0) {
            return SolveQuadratic(func_b, func_c, func_d);
        }
        if (func_d == 0) {
            return 0;
        }
        func_b /= func_a;
        func_c /= func_a;
        func_d /= func_a;
        func_q = (3.0 * func_c - Math.pow(func_b, 2)) / 9.0;
        func_r = (-27.0 * func_d + func_b * (9.0 * func_c - 2.0 * Math.pow(func_b, 2))) / 54.0;
        disc = Math.pow(func_q, 3) + Math.pow(func_r, 2);
        term1 = func_b / 3.0;

        if (disc > 0) {
            func_s = func_r + Math.sqrt(disc);
            func_t = func_r - Math.sqrt(disc);
            func_s = func_s < 0 ? -Math.pow(-func_s, 1 / 3) : Math.pow(func_s, 1 / 3);
            func_t = func_t < 0 ? -Math.pow(-func_t, 1 / 3) : Math.pow(func_t, 1 / 3);
            result = -term1 + func_s + func_t;
            if (result >= 0 && result <= 1) {
                return result;
            }
        } else if (disc == 0) {
            r13 = func_r < 0 ? -Math.pow(-func_r, 1 / 3) : Math.pow(func_r, 1 / 3);
            result = -term1 + 2.0 * r13;
            if (result >= 0 && result <= 1) {
                return result;
            }
            result = -(r13 + term1);
            if (result >= 0 && result <= 1) {
                return result;
            }
        } else {
            func_q = -func_q;
            dum1 = func_q * func_q * func_q;
            dum1 = Math.acos(func_r / Math.sqrt(dum1));
            r13 = 2.0 * Math.sqrt(func_q);
            result = -term1 + r13 * Math.cos(dum1 / 3.0);
            if (result >= 0 && result <= 1) {
                return result;
            }
            result = -term1 + r13 * Math.cos((dum1 + 2.0 * Math.PI) / 3.0);
            if (result >= 0 && result <= 1) {
                return result;
            }
            result = -term1 + r13 * Math.cos((dum1 + 4.0 * Math.PI) / 3.0);
            if (result >= 0 && result <= 1) {
                return result;
            }
        }
        return null;
    }

    func_t = 0;
    if (input_x == point1[0]) {
        func_t = 0;
    } else if (input_x == point4[0]) {
        func_t = 1;
    } else {
        func_a = point1[0] + 3 * point2[0] - 3 * point3[0] + point4[0];
        func_b = 3 * point1[0] - 6 * point2[0] + 3 * point3[0];
        func_c = -3 * point1[0] + 3 * point2[0];
        func_d = point1[0] - input_x;
        func_t = SolveCubic(func_a, func_b, func_c, func_d);
        if (func_t == null) {
            return null;
        }
    }
    return (
        Math.pow(1 - func_t, 3) * point1[1] +
        3 * func_t * Math.pow(1 - func_t, 2) * point2[1] +
        3 * Math.pow(func_t, 2) * (1 - func_t) * point3[1] +
        Math.pow(func_t, 3) * point4[1]
    );
}

ReCountResource();
// Part 1
Globaloffset = 0;
SingleLength = 25;
LastRank = 0;

for (key in AllData) {
    if (AllData[key]['rank'] > LastRank) {
        LastRank = AllData[key]['rank'];
    }
}
Part1.duration = LastRank * SingleLength + LastRank + 4;
// BlackLayer = Part1.layers.addSolid([0, 0, 0], "黑底", CompSize[0], CompSize[1], 1, 1);
// BlackLayer.outPoint = Part1.duration;
ChangeLayer = AddLayer(Part1, 'change', 5, 0);
ChangeLayer.timeRemapEnabled = true;
ChangeLayer.property('ADBE Time Remapping').setValueAtTime(4 + 59 / 60, 4 + 59 / 60);
ChangeLayer.property('ADBE Time Remapping').setValueAtTime(9 + 59 / 60, 4 + 59 / 60);
ChangeLayer.outPoint = Part1.duration;
Globaloffset += 5;

for (rank = 1; rank <= LastRank; rank += 1) {
    PreComp = app.project.items.addComp('Pre' + rank + '_V', 1920, 1080, 1, SingleLength, 60);
    ReCountResource();
    BlackLayer = PreComp.layers.addSolid([0, 0, 0], '黑底', CompSize[0], CompSize[1], 1, 1);
    BlackLayer.outPoint = PreComp.duration;

    RankVideoLayer = AddLayer(PreComp, rank + '_V', SingleLength, 0 - OffsetData[rank]);
    RankVideoLayer.inPoint = 0;
    RankVideoLayer.outPoint = SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= CompSize[0] / CompSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (CompSize[0] / VideoItemSize.width) * 100,
            (CompSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (CompSize[1] / VideoItemSize.height) * 100,
            (CompSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([960, 540]);
    AddProgressBar(PreComp, CompSize[0], [960, 1074], SingleLength - 1, 0, 0);
    t_fps = 2 * CompFPS;
    dest_y1 = -35;
    dest_y2 = 0;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankVideoLayer.property('Audio Levels').setValueAtTime(x / 60, [dest_y1 + y, dest_y1 + y]);
    }
    for (x = t_fps; x >= 0; x -= 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankVideoLayer.property('Audio Levels').setValueAtTime(SingleLength - 2 + (t_fps - x) / 60, [
            dest_y1 + y,
            dest_y1 + y,
        ]);
    }

    RankVideoMask = AddLayer(PreComp, 'mask', SingleLength, 0);
    RankDataLayer = AddLayer(PreComp, rank + '_T', SingleLength, 0);
    RankDataLayer.property('Opacity').setValueAtTime(1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(1.5, 100);
    RankDataLayer.property('Opacity').setValueAtTime(SingleLength - 1.5, 100);
    RankDataLayer.property('Opacity').setValueAtTime(SingleLength - 1, 0);
    PreRankLayer = AddLayer(Part1, 'Pre' + rank + '_V', SingleLength, Globaloffset);
    Shadow = PreRankLayer.property('Effects').addProperty('ADBE Drop Shadow');
    Shadow.property('ADBE Drop Shadow-0002').setValue(100);
    Shadow.property('ADBE Drop Shadow-0004').setValue(0);
    Shadow.property('ADBE Drop Shadow-0005').setValue(50);
    Wipe = PreRankLayer.property('Effects').addProperty('ADBE Linear Wipe');
    Wipe.property('ADBE Linear Wipe-0002').setValue(0);
    Wipe.property('ADBE Linear Wipe-0003').setValue(5);
    t_fps = CompFPS;
    dest_y1 = 0;
    dest_y2 = 100;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        Wipe.property('ADBE Linear Wipe-0001').setValueAtTime(Globaloffset + x / 60, 100 - y);
    }

    t_fps = CompFPS;
    dest_y1 = 80;
    dest_y2 = 100;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        PreRankLayer.property('Scale').setValueAtTime(Globaloffset + 1 + x / 60, [dest_y1 + y, dest_y1 + y]);
    }
    t_fps = CompFPS / 3;
    c1 = 0;
    c2 = 0;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        PreRankLayer.property('Scale').setValueAtTime(Globaloffset + SingleLength - 1 + x / 60, [dest_y1 + y, dest_y1 + y]);
    }
    t_fps = CompFPS / 2;
    dest_y1 = 540;
    dest_y2 = 1520;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        PreRankLayer.property('Position').setValueAtTime(Globaloffset + SingleLength - 0.5 + (x - 1) / 60, [960, dest_y1 + y]);
    }

    if (rank == LastRank) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part1, 'next', 1, Globaloffset + SingleLength);
        // NextLayer.timeRemapEnabled = true
        // NextLayer.property("ADBE Time Remapping").setValueAtTime(59 / 60, 59 / 60)
        // NextLayer.property("ADBE Time Remapping").setValueAtTime(1 + 59 / 60, 59 / 60)
        // NextLayer.outPoint = Globaloffset + SingleLength * 2 + 1
    }
    Globaloffset += SingleLength + addNext;
}
Part1.openInViewer();