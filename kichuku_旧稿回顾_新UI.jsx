// @include "json2.js"

app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
app.newProject();
Part1 = app.project.items.addComp('旧稿回顾', 1920, 1080, 1, 25, 60);

VideoSize = [1564, 880];
CompSize = [1920, 1080];
CompFPS = 60;

StaticFolder = app.project.items.addFolder('StaticResource');
StaticResource = {
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
    VectorGroup = NewLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group')
        .addProperty('ADBE Vectors Group');
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
    AddProgressBar(PreComp, CompSize[0], [960, 1074], SingleLength - 0.5, 0, 1);
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

    BottomRight = PreComp.layers.addShape();
    BottomRight.name = '右下';
    RightGroup = BottomRight.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    RightShape = RightGroup.addProperty('ADBE Vectors Group');
    RightShape.addProperty('ADBE Vector Shape - Rect');
    RightShape.addProperty('ADBE Vector Graphic - Fill');
    RightShape.addProperty('ADBE Vector Graphic - Stroke');
    RightShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([321.3, 40]);
    RightShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    RightShape.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue([1, 1, 1, 1]);
    RightShape.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    RightShape.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').setValue([0, 0, 0, 1]);
    BottomRight.property('Position').setValue([1306 + 793, 545 + 490]);

    BottomLeft = PreComp.layers.addShape();
    BottomLeft.name = '左下1';
    LeftGroup = BottomLeft.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    LeftShape = LeftGroup.addProperty('ADBE Vectors Group');
    Shape1 = LeftShape.addProperty('ADBE Vector Shape - Rect');
    Shape1.property('ADBE Vector Rect Size').setValue([220, 40]);
    Shape1.property('ADBE Vector Rect Roundness').setValue(80);
    Shape2 = LeftShape.addProperty('ADBE Vector Shape - Rect');
    Shape2.property('ADBE Vector Rect Size').setValue([229, 40]);
    Shape2.property('ADBE Vector Rect Roundness').setValue(80);
    Shape2.property('ADBE Vector Rect Position').setValue([243, 0]);
    LeftShape.addProperty('ADBE Vector Graphic - Fill');
    LeftShape.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue([1, 1, 1, 1]);
    LeftGroup.property('ADBE Vector Transform Group').property('ADBE Vector Anchor').setValue([-110, 0]);
    BottomLeft.property('Position').setValue([107.2, 1036.9]);

    BottomLeft2 = PreComp.layers.addShape();
    BottomLeft2.name = '左下2';
    LeftGroup2 = BottomLeft2.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    LeftShape2 = LeftGroup2.addProperty('ADBE Vectors Group');
    LeftShape2.addProperty('ADBE Vector Shape - Rect');
    LeftShape2.addProperty('ADBE Vector Graphic - Fill');
    LeftShape2.addProperty('ADBE Vector Filter - Repeater');
    LeftShape2.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([285, 40]);
    LeftShape2.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(80);
    LeftShape2.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Position').setValue([517, 0]);
    LeftShape2.property('ADBE Vector Graphic - Fill')
        .property('ADBE Vector Fill Color').setValue([102 / 255, 102 / 255, 102 / 255, 1]);
    LeftShape2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Copies').setValue(2);
    LeftShape2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Transform')
        .property('ADBE Vector Repeater Position').setValue([309, 0]);
    LeftGroup2.property('ADBE Vector Transform Group').property('ADBE Vector Anchor').setValue([-110, 0]);
    BottomLeft2.property('Position').setValue([107.2, 1036.9]);
    BottomRamp = BottomLeft2.property('Effects').addProperty('ADBE Ramp');
    BottomRamp.property('ADBE Ramp-0001').setValue([1000, 916]);
    BottomRamp.property('ADBE Ramp-0002').setValue([36 / 255, 36 / 255, 36 / 255, 1]);
    BottomRamp.property('ADBE Ramp-0003').setValue([1000, 1603]);
    BottomRamp.property('ADBE Ramp-0004').setValue([1, 1, 1, 1]);
    t_fps = 45;
    dest_y1 = 0;
    dest_y2 = 100;
    dest = dest_y2 - dest_y1;
    c1 = 34 / 45;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        BottomLeft.property('Scale').setValueAtTime((x + 38 + 100) / 60, [dest_y1 + y, dest_y1 + y]);
        BottomLeft2.property('Scale').setValueAtTime((x + 38 + 100) / 60, [dest_y1 + y, dest_y1 + y]);
    }
    t_fps = 45;
    dest_y1 = 100;
    dest_y2 = 0;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 11 / 45;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        BottomLeft.property('Scale').setValueAtTime((x + 1430) / 60, [dest_y1 + y, dest_y1 + y]);
        BottomLeft2.property('Scale').setValueAtTime((x + 1430) / 60, [dest_y1 + y, dest_y1 + y]);
    }

    TopLeft = PreComp.layers.addShape();
    TopLeft.name = '左上';
    TopGroup = TopLeft.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    TopShape = TopGroup.addProperty('ADBE Vectors Group');
    TopShape.addProperty('ADBE Vector Shape - Rect');
    TopShape.addProperty('ADBE Vector Graphic - Fill');
    TopShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([279, 70]);
    t_fps = 83;
    dest_x1 = 0;
    dest_x2 = 279;
    dest_x = dest_x2 - dest_x1;
    dest_y1 = 90;
    dest_y2 = 70;
    dest_y = dest_y2 - dest_y1;
    c1 = 66 / 83;
    c2 = 56 / 83;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest_x];
    P4 = [t_fps, dest_x];
    P5 = [c2 * t_fps, dest_y];
    P6 = [t_fps, dest_y];
    for (t = 0; t <= t_fps; t += 1) {
        x = BezierCurve(P1, P2, P3, P4, t);
        y = BezierCurve(P1, P2, P5, P6, t);
        TopShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size')
            .setValueAtTime((t + 27 + 100) / 60, [dest_x1 + x, dest_y1 + y]);
    }
    t_fps = 45;
    dest_x1 = 279;
    dest_x2 = 0;
    dest_x = dest_x2 - dest_x1;
    dest_y1 = 70;
    dest_y2 = 90;
    dest_y = dest_y2 - dest_y1;
    c1 = 35 / 45;
    c2 = 9 / 45;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest_x];
    P4 = [t_fps, dest_x];
    P5 = [c2 * t_fps, dest_y];
    P6 = [t_fps, dest_y];
    for (t = 0; t <= t_fps; t += 1) {
        x = BezierCurve(P1, P2, P3, P4, t);
        y = BezierCurve(P1, P2, P5, P6, t);
        TopShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size')
            .setValueAtTime((t + 1422) / 60, [dest_x1 + x, dest_y1 + y]);
    }
    TopShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    // TopShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Position').setValue([-78, -177]);
    TopShape.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue([1, 1, 1, 1]);
    // TopGroup.property('ADBE Vector Transform Group').property('ADBE Vector Anchor').setValue([-110, 0]);
    TopLeft.property('Position').setValue([246, 95]);
    TopRamp = TopLeft.property('Effects').addProperty('ADBE Ramp');
    TopRamp.property('ADBE Ramp-0001').setValue([960, 0]);
    TopRamp.property('ADBE Ramp-0002').setValue([36 / 255, 36 / 255, 36 / 255, 1]);
    TopRamp.property('ADBE Ramp-0003').setValue([960, 699]);
    TopRamp.property('ADBE Ramp-0004').setValue([1, 1, 1, 1]);

    TopRight = PreComp.layers.addShape();
    TopRight.name = '右上';
    TopRightGroup = TopRight.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    TopRightShape = TopRightGroup.addProperty('ADBE Vectors Group');
    TopRightShape.addProperty('ADBE Vector Shape - Rect');
    TopRightShape.addProperty('ADBE Vector Graphic - Fill');
    TopRightShape.addProperty('ADBE Vector Graphic - Stroke');
    TopRightShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([1436, 70]);
    TopRightShape.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    TopRightShape.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue([1, 1, 1, 1]);
    TopRightShape.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    TopRightShape.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').setValue([0, 0, 0, 1]);
    TopRight.property('Position').setValue([1184, 95]);
    t_fps = 78;
    dest_y1 = 1457;
    dest_y2 = 1184;
    dest = dest_y2 - dest_y1;
    c1 = 70 / 78;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        TopRight.property('Position').setValueAtTime((x + 100) / 60, [dest_y1 + y, 95]);
    }
    t_fps = 66;
    dest_y1 = 1184;
    dest_y2 = 1457;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 7 / 78;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        TopRight.property('Position').setValueAtTime((x + 1400) / 60, [dest_y1 + y, 95]);
    }
    TopRight.property('Opacity').setValueAtTime(0 + 2, 0);
    TopRight.property('Opacity').setValueAtTime(1.5 + 2, 100);
    TopRight.property('Opacity').setValueAtTime(SingleLength - 5 / 3, 100);
    TopRight.property('Opacity').setValueAtTime(SingleLength - 0.5, 0);

    TLayer = PreComp.layers.addText('旧稿回顾');
    TDocument = TLayer.property('Source Text').value;
    TDocument.resetCharStyle();
    TDocument.resetParagraphStyle();
    TDocument.applyFill = false;
    TDocument.applyStroke = true;
    TDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    TLayer.property('Source Text').setValue(TDocument);
    TLayer.property('Source Text').expression =
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC_Bold")' +
        '.setFontSize(76).setLeading(0).setStrokeWidth(1).setStrokeColor(hexToRgb("FFFFFF")).setFauxItalic(true);';
    TLayer.property('Source Text').expression.enabled = true;
    TLayer.property('Position').setValue([2091 - 152, 988]);
    t_fps = 66;
    dest_y1 = 2091 - 152;
    dest_y2 = 1724 - 152;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        TLayer.property('Position').setValueAtTime((x + 11 + 100) / 60, [dest_y1 + y, 988]);
    }
    t_fps = 66;
    dest_y1 = 1724 - 152;
    dest_y2 = 2213 - 152;
    dest = dest_y2 - dest_y1;
    c1 = 1;
    c2 = 30 / 66;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        TLayer.property('Position').setValueAtTime((x + 1400) / 60, [dest_y1 + y, 988]);
    }
    BottomRight.parent = TLayer;
    Shadow = TLayer.property('Effects').addProperty('ADBE Drop Shadow');
    Shadow.property('ADBE Drop Shadow-0001').setValue([0, 0, 0]);
    Shadow.property('ADBE Drop Shadow-0002').setValue(255);
    Shadow.property('ADBE Drop Shadow-0003').setValue(120);
    Shadow.property('ADBE Drop Shadow-0004').setValue(5);
    Shadow.property('ADBE Drop Shadow-0005').setValue(7);

    RankDataLayer = AddLayer(PreComp, rank + '_T', SingleLength, 0);
    RankDataLayer.property('Opacity').setValueAtTime(1 + 2, 0);
    RankDataLayer.property('Opacity').setValueAtTime(1.5 + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(SingleLength - 1.5, 100);
    RankDataLayer.property('Opacity').setValueAtTime(SingleLength - 1, 0);
    PreRankLayer = AddLayer(Part1, 'Pre' + rank + '_V', SingleLength, Globaloffset);
    Shadow = PreRankLayer.property('Effects').addProperty('ADBE Drop Shadow');
    Shadow.property('ADBE Drop Shadow-0001').setValue([0, 0, 0]);
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
        PreRankLayer.property('Scale')
            .setValueAtTime(Globaloffset + SingleLength - 1 + x / 60, [dest_y1 + y, dest_y1 + y]);
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
        PreRankLayer.property('Position')
            .setValueAtTime(Globaloffset + SingleLength - 0.5 + (x - 1) / 60, [960, dest_y1 + y]);
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