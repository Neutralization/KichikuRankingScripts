// @include "json2.js"

app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
app.newProject();
Part1 = app.project.items.addComp("主榜20-11", 1920, 1080, 1, 259, 60);
Part2 = app.project.items.addComp("主榜10-4", 1920, 1080, 1, 181, 60);
Part3 = app.project.items.addComp("主榜3-1", 1920, 1080, 1, 150, 60);

VideoSize = [1352, 760];
CompSize = [1920, 1080];
CompFPS = 60;

StaticFolder = app.project.items.addFolder("StaticResource");
StaticResource = {
    mask_20: "./绿幕抠图/20-11.mp4",
    mask_10: "./绿幕抠图/!主榜 10-4-2.mp4",
    mask_3: "./绿幕抠图/!主榜 3-1.mov",
    next_3: "./绿幕抠图/!NEXT 主榜.mp4",
    next: "./绿幕抠图/!NEXT.mp4",
};

// LOAD DATA
jsondata = new File("data.json");
jsondata.open("r");
content = jsondata.read();
jsondata.close();
AllData = JSON.parse(content);

OffsetData = {};
PointData = {};
for (key in AllData) {
    rank = AllData[key]["rank"];
    StaticResource[rank + "_V"] = AllData[key]["video"];
    StaticResource[rank + "_T"] = AllData[key]["text"];
    OffsetData[rank] = AllData[key]["offset"];
    PointData[rank] = AllData[key]["delta"];
}

for (key in StaticResource) {
    if (typeof StaticResource[key] != "undefined") {
        ResourceFile = new ImportOptions(File(StaticResource[key]));
        ResourceFile.ImportAs = ImportAsType.FOOTAGE;
        FileItem = app.project.importFile(ResourceFile);
        FileItem.name = key;
        FileItem.parentFolder = StaticFolder;
    }
}

// ITEM INDEX
ResourceID = {};
for (n = 1; n <= app.project.items.length; n++) {
    ResourceID[app.project.items[n].name] = n;
}

// FUNCTION
function AddLayer(Target, Name, Duration, Offset) {
    NewLayer = Target.layers.add(app.project.items[ResourceID[Name]], Duration);
    NewLayer.startTime = Offset;
    return NewLayer;
}

function AddAudioProperty(Target, Ptype, Duration, Offset, Direction) {
    NewProperty = Target.property("Audio Levels");
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
    NewLayer = Target.layers.addShape()
    NewLayer.startTime = Offset;
    NewLayer.outPoint = Duration + Offset;
    NewLayer.name = "Progress"
    VectorGroup = NewLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").addProperty("ADBE Vectors Group")
    VectorGroup.addProperty("ADBE Vector Shape - Rect")
    VectorGroup.addProperty("ADBE Vector Graphic - Fill")
    VectorGroup.addProperty("ADBE Vector Graphic - Stroke")
    VectorGroup.property("ADBE Vector Shape - Rect")
        .property("ADBE Vector Rect Size")
        .setValueAtTime(Offset + Delay, [0, 8])
    VectorGroup.property("ADBE Vector Shape - Rect")
        .property("ADBE Vector Rect Size")
        .setValueAtTime(Offset + 0.5 + Delay, [Length, 8])
    VectorGroup.property("ADBE Vector Shape - Rect")
        .property("ADBE Vector Rect Size")
        .setValueAtTime(Offset + Duration, [0, 8])
    VectorGroup.property("ADBE Vector Shape - Rect").property("ADBE Vector Rect Roundness").setValue(3)
    VectorGroup.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1, 1, 1, 1])
    VectorGroup.property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width").setValue(0)
    NewLayer.property("Position").setValue(Position)
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

// Part 1
Globaloffset = 0;
SingleLength = 25;
BlackLayer = Part1.layers.addSolid([0, 0, 0], "黑底", CompSize[0], CompSize[1], 1, 1);
for (rank = 20; rank > 10; rank -= 1) {
    RankVideoLayer = AddLayer(Part1, rank + "_V", SingleLength, Globaloffset - OffsetData[rank]);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= VideoSize[0] / VideoSize[1]) {
        RankVideoLayer.property("Scale").setValue([
            (VideoSize[0] / VideoItemSize.width) * 100,
            (VideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property("Scale").setValue([
            (VideoSize[1] / VideoItemSize.height) * 100,
            (VideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property("Position").setValue([1200, 421]);
    AddAudioProperty(RankVideoLayer, 2, 2, Globaloffset, 1, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset, [-Infinity, -Infinity]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + 1, [0, 0]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + SingleLength - 1, [0, 0]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + SingleLength, [-Infinity, -Infinity]);
    AddProgressBar(Part1, VideoSize[0], [1200, 796], SingleLength, Globaloffset, 0.7)

    RankVideoMask = AddLayer(Part1, "mask_20", SingleLength, Globaloffset);
    GreenMask = RankVideoMask.property("Effects").addProperty("Keylight 906");
    GreenMask.property("Screen Colour").setValue([0.2, 1, 0]);
    GreenMask.property("Alpha Bias").setValue([0.5, 0.5, 0.5]);
    GreenMask.property("Despill Bias").setValue([0.5, 0.5, 0.5]);
    GreenMask.property("Unpremultiply Result").setValue(null);
    RankVideoMask2 = AddLayer(Part1, "mask_20", SingleLength, Globaloffset);
    RankVideoMask2.mask.addProperty("Mask");
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        "mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], inTangents=[], outTangents=[], is_closed=true)";

    RankDataLayer = AddLayer(Part1, rank + "_T", SingleLength, Globaloffset);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + SingleLength - 2, 100);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + SingleLength - 1, 0);

    if (rank == 11) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part1, "next", 1, Globaloffset + SingleLength);
    }
    Globaloffset += SingleLength + addNext;
}
BlackLayer.outPoint = Part1.duration;
Part1.openInViewer();

// Part 2
Globaloffset = 0;
SingleLength = 25;
BlackLayer = Part2.layers.addSolid([0, 0, 0], "黑底", CompSize[0], CompSize[1], 1, 1);
for (rank = 10; rank > 3; rank -= 1) {
    RankVideoLayer = AddLayer(Part2, rank + "_V", SingleLength, Globaloffset - OffsetData[rank]);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= VideoSize[0] / VideoSize[1]) {
        RankVideoLayer.property("Scale").setValue([
            (VideoSize[0] / VideoItemSize.width) * 100,
            (VideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property("Scale").setValue([
            (VideoSize[1] / VideoItemSize.height) * 100,
            (VideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property("Position").setValue([1200, 421]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset, [-Infinity, -Infinity]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + 1, [0, 0]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + SingleLength - 1, [0, 0]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + SingleLength, [-Infinity, -Infinity]);
    AddProgressBar(Part2, VideoSize[0], [1200, 796], SingleLength, Globaloffset, 0.7)

    RankVideoMask = AddLayer(Part2, "mask_10", SingleLength, Globaloffset);
    GreenMask = RankVideoMask.property("Effects").addProperty("Keylight 906");
    GreenMask.property("Screen Colour").setValue([0.2, 1, 0]);
    GreenMask.property("Alpha Bias").setValue([0.5, 0.5, 0.5]);
    GreenMask.property("Despill Bias").setValue([0.5, 0.5, 0.5]);
    GreenMask.property("Unpremultiply Result").setValue(null);
    RankVideoMask2 = AddLayer(Part2, "mask_10", SingleLength, Globaloffset);
    RankVideoMask2.mask.addProperty("Mask");
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        "mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], inTangents=[], outTangents=[], is_closed=true)";
    RankDataLayer = AddLayer(Part2, rank + "_T", SingleLength, Globaloffset);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + SingleLength - 2, 100);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + SingleLength - 1, 0);

    if (rank == 4) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part2, "next", 1, Globaloffset + SingleLength);
    }
    Globaloffset += SingleLength + addNext;
}
BlackLayer.outPoint = Part2.duration;
Part2.openInViewer();

// Part 3

RankCN = ["主榜 第一名", "主榜 第二名", "主榜 第三名"];
Globaloffset = 0;
SingleLength = 45;
BlackLayer = Part3.layers.addSolid([0, 0, 0], "黑底", CompSize[0], CompSize[1], 1, 1);
for (rank = 3; rank > 0; rank -= 1) {
    NextLayer = AddLayer(Part3, "next_3", 5, Globaloffset);
    PointTextLayer = Part3.layers.addText(PointData[rank] + " POINTS");
    PointTextLayer.startTime = Globaloffset;
    PointTextLayer.outPoint = Globaloffset + 5;
    PointTextLayer.trackMatteType = TrackMatteType.ALPHA;
    PointTextDocument = PointTextLayer.property("Source Text").value;
    PointTextDocument.resetCharStyle();
    PointTextDocument.resetParagraphStyle();
    PointTextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    PointTextDocument.applyFill = true;
    PointTextDocument.applyStroke = false;
    PointTextLayer.property("Source Text").setValue(PointTextDocument);
    PointTextLayer.property("Source Text").expression =
        'text.sourceText.createStyle().setFont("Montserrat-SemiBold").setFillColor(hexToRgb("9049C6")).setFontSize(44).setLeading(260);';
    PointTextLayer.property("Source Text").expression.enabled = false;
    PointTextLayer.property("Position").setValue([-105, 749]);

    t_fps = 68;
    dest_y1 = -105;
    dest_y2 = 370;
    dest = dest_y2 - dest_y1;
    c1 = 44 / 68;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        PointTextLayer.property("Position").setValueAtTime(Globaloffset + (x + 44) / 60, [dest_y1 + y, 749]);
    }

    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        PointTextLayer.property("Position").setValueAtTime(Globaloffset + (x + 199) / 60, [dest_y1 + y, 749]);
    }

    PointMaskLayer = Part3.layers.addSolid([0, 0, 0], "Points", 556, 49, 1, 5);
    PointMaskLayer.startTime = Globaloffset;
    PointMaskLayer.property("Position").setValue([960 - 321, 540 + 192.5]);
    PointMaskLayer.enabled = false;

    RankTextLayer = Part3.layers.addText(RankCN[rank - 1]);
    RankTextLayer.startTime = Globaloffset;
    RankTextLayer.outPoint = Globaloffset + 5;
    RankTextLayer.trackMatteType = TrackMatteType.ALPHA;
    RankTextDocument = RankTextLayer.property("Source Text").value;
    RankTextDocument.resetCharStyle();
    RankTextDocument.resetParagraphStyle();
    RankTextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    RankTextDocument.applyFill = true;
    RankTextDocument.applyStroke = false;
    RankTextLayer.property("Source Text").setValue(RankTextDocument);
    RankTextLayer.property("Source Text").expression =
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC").setFillColor(hexToRgb("9049C6")).setFontSize(118).setLeading(243);';
    RankTextLayer.property("Source Text").expression.enabled = false;
    RankTextLayer.property("Position").setValue([-438, 681.8]);

    t_fps = 67;
    dest_y1 = -438.7;
    dest_y2 = 366.3;
    dest = dest_y2 - dest_y1;
    c1 = 59 / 67;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankTextLayer.property("Position").setValueAtTime(Globaloffset + (x + 18) / 60, [dest_y1 + y, 681.8]);
    }
    c1 = 1;
    c2 = 7 / 67;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankTextLayer.property("Position").setValueAtTime(Globaloffset + (x + 214) / 60, [dest_y1 + y, 681.8]);
    }
    RankMaskLayer = Part3.layers.addSolid([0, 0, 0], "Rank", 893, 128, 1, 5);
    RankMaskLayer.startTime = Globaloffset;
    RankMaskLayer.property("Position").setValue([960 - 152.5, 540 + 93]);
    RankMaskLayer.enabled = false;

    Globaloffset += 5;

    RankVideoLayer = AddLayer(Part3, rank + "_V", SingleLength, Globaloffset - OffsetData[rank]);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= VideoSize[0] / VideoSize[1]) {
        RankVideoLayer.property("Scale").setValue([
            (CompSize[0] / VideoItemSize.width) * 100,
            (CompSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property("Scale").setValue([
            (CompSize[1] / VideoItemSize.height) * 100,
            (CompSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property("Position").setValue([960, 540]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset, [-Infinity, -Infinity]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + 1, [0, 0]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + SingleLength - 1, [0, 0]);
    //RankVideoLayer.property("Audio Levels").setValueAtTime(Globaloffset + SingleLength, [-Infinity, -Infinity]);
    AddProgressBar(Part3, CompSize[0], [960, 1076], SingleLength, Globaloffset, 0)
    MaskDuratrion = app.project.items[ResourceID["mask_3"]].duration
    RankVideoMask = AddLayer(Part3, "mask_3", MaskDuratrion, Globaloffset);
    RankDataLayer = AddLayer(Part3, rank + "_T", MaskDuratrion, Globaloffset);

    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + 0.5, 0);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + 1, 100);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + MaskDuratrion - 1, 100);
    RankDataLayer.property("Opacity").setValueAtTime(Globaloffset + MaskDuratrion - 0.5, 0);

    Globaloffset += SingleLength;
}
BlackLayer.outPoint = Part3.duration;
Part3.openInViewer();