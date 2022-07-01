// @include "json2.js"

app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
app.newProject();
Part1 = app.project.items.addComp('主榜20-11', 1920, 1080, 1, 259, 60);
Part2 = app.project.items.addComp('主榜10-4', 1920, 1080, 1, 181, 60);
Part3 = app.project.items.addComp('主榜3-1', 1920, 1080, 1, 150, 60);

VideoSize = [1352, 760];
CompSize = [1920, 1080];
CompFPS = 60;

StaticFolder = app.project.items.addFolder('StaticResource');
StaticResource = {
    mask_20: './绿幕抠图/!主榜 20-11绿幕.mp4',
    mask_10: './绿幕抠图/!主榜 10-4绿幕.mp4',
    next_20: './绿幕抠图/!NEXT 主榜 20-11.mp4',
    next_10: './绿幕抠图/!NEXT 主榜 10-4.mp4',
    next_3: './绿幕抠图/!NEXT 主榜.mp4',
    next: './绿幕抠图/!NEXT.mp4',
    bf: './绿幕抠图/播放量.png',
    dm: './绿幕抠图/弹幕.png',
    dz: './绿幕抠图/点赞.png',
    pl: './绿幕抠图/评论.png',
    sc: './绿幕抠图/收藏.png',
    tb: './绿幕抠图/投币.png',
    effect: './绿幕抠图/弥散渐变 紫.mp4',
};

// LOAD DATA
jsondata = new File('data.json');
jsondata.open('r');
content = jsondata.read();
jsondata.close();
AllData = JSON.parse(content);

OffsetData = {};
PointData = {};
TrueRankData = {};
for (key = 0; key < AllData.length; key++) {
    rank = AllData[key]['rank'];
    StaticResource[rank + '_V'] = AllData[key]['video'];
    StaticResource[rank + '_T'] = AllData[key]['text'];
    OffsetData[rank] = AllData[key]['offset'];
    PointData[rank] = AllData[key]['delta'];
    TrueRankData[rank] = AllData[key]['true_rank'];
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
TrueDuration = 0;
BlackLayer = Part1.layers.addSolid([0, 0, 0], '黑底', CompSize[0], CompSize[1], 1, 1);

NextLayer = AddLayer(Part1, 'next_20', 5, Globaloffset);
// NextLayer.timeRemapEnabled = true;
// NextLayer.property('ADBE Time Remapping').setValueAtTime(4 + 59 / 60, 4 + 59 / 60);
// NextLayer.property('ADBE Time Remapping').setValueAtTime(9 + 59 / 60, 4 + 59 / 60);
// NextLayer.outPoint = Globaloffset + 5 + SingleLength;
RankTextLayer = Part1.layers.addText('主榜 ' + TrueRankData[20] + ' - ' + TrueRankData[11] + ' 名');
RankTextLayer.startTime = Globaloffset;
RankTextLayer.outPoint = Globaloffset + 5;
RankTextLayer.trackMatteType = TrackMatteType.ALPHA;
RankTextDocument = RankTextLayer.property('Source Text').value;
RankTextDocument.resetCharStyle();
RankTextDocument.resetParagraphStyle();
RankTextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
RankTextDocument.applyFill = true;
RankTextDocument.applyStroke = false;
RankTextLayer.property('Source Text').setValue(RankTextDocument);
RankTextLayer.property('Source Text').expression =
    'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC")' +
    '.setFillColor(hexToRgb("006AF5")).setFontSize(118).setLeading(243);';
RankTextLayer.property('Source Text').expression.enabled = true;
RankTextLayer.property('Position').setValue([-438, 681.8]);

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
    RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 18) / 60, [dest_y1 + y, 681.8]);
}
c1 = 1;
c2 = 7 / 67;
P1 = [0, dest];
P2 = [c1 * t_fps, dest];
P3 = [c2 * t_fps, 0];
P4 = [t_fps, 0];
for (x = 0; x <= t_fps; x += 1) {
    y = BezierCurve(P1, P2, P3, P4, x);
    RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 214) / 60, [dest_y1 + y, 681.8]);
}
RankMaskLayer = Part1.layers.addSolid([0, 0, 0], 'Rank', 893, 128, 1, 5);
RankMaskLayer.startTime = Globaloffset;
RankMaskLayer.property('Position').setValue([960 - 152.5, 540 + 93]);
RankMaskLayer.enabled = false;

Globaloffset += 5;
TrueDuration += 5;

for (rank = 30; rank > 10; rank -= 1) {
    if (!(rank + '_V' in ResourceID)) {
        continue;
    }
    app.project.items[ResourceID[rank + '_V']].mainSource.loop = 2;
    RankVideoLayer = AddLayer(Part1, rank + '_V', SingleLength, Globaloffset - OffsetData[rank] + SingleLength);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= VideoSize[0] / VideoSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (VideoSize[0] / VideoItemSize.width) * 100,
            (VideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (VideoSize[1] / VideoItemSize.height) * 100,
            (VideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([1200, 421]);
    AddAudioProperty(RankVideoLayer, 2, 2, Globaloffset, 1, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    AddProgressBar(Part1, VideoSize[0], [1200, 796], SingleLength, Globaloffset, 0.7);

    RankVideoMask = AddLayer(Part1, 'mask_20', SingleLength, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue([0.2, 1, 0]);
    GreenMask.property('Alpha Bias').setValue([0.5, 0.5, 0.5]);
    GreenMask.property('Despill Bias').setValue([0.5, 0.5, 0.5]);
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part1, 'mask_20', SingleLength, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';

    RankDataLayer = AddLayer(Part1, rank + '_T', SingleLength, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 1, 0);

    if (rank == 11) {
        addNext = 0;
        TrueDuration += SingleLength;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part1, 'next', 1, Globaloffset + SingleLength);
        TrueDuration += SingleLength + 1;
    }
    Globaloffset += SingleLength + addNext;
}
Part1.duration = TrueDuration;
BlackLayer.outPoint = Part1.duration;
Part1.openInViewer();

// Part 2
Globaloffset = 0;
SingleLength = 25;
TrueDuration = 0;
BlackLayer = Part2.layers.addSolid([0, 0, 0], '黑底', CompSize[0], CompSize[1], 1, 1);

NextLayer = AddLayer(Part2, 'next_10', 5, Globaloffset);
// NextLayer.timeRemapEnabled = true;
// NextLayer.property('ADBE Time Remapping').setValueAtTime(4 + 59 / 60, 4 + 59 / 60);
// NextLayer.property('ADBE Time Remapping').setValueAtTime(9 + 59 / 60, 4 + 59 / 60);
// NextLayer.outPoint = Globaloffset + 5 + SingleLength;
RankTextLayer = Part2.layers.addText('主榜 ' + TrueRankData[10] + ' - ' + TrueRankData[4] + ' 名');
RankTextLayer.startTime = Globaloffset;
RankTextLayer.outPoint = Globaloffset + 5;
RankTextLayer.trackMatteType = TrackMatteType.ALPHA;
RankTextDocument = RankTextLayer.property('Source Text').value;
RankTextDocument.resetCharStyle();
RankTextDocument.resetParagraphStyle();
RankTextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
RankTextDocument.applyFill = true;
RankTextDocument.applyStroke = false;
RankTextLayer.property('Source Text').setValue(RankTextDocument);
RankTextLayer.property('Source Text').expression =
    'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC")' +
    '.setFillColor(hexToRgb("F38B2E")).setFontSize(118).setLeading(243);';
RankTextLayer.property('Source Text').expression.enabled = true;
RankTextLayer.property('Position').setValue([-438, 681.8]);

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
    RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 18) / 60, [dest_y1 + y, 681.8]);
}
c1 = 1;
c2 = 7 / 67;
P1 = [0, dest];
P2 = [c1 * t_fps, dest];
P3 = [c2 * t_fps, 0];
P4 = [t_fps, 0];
for (x = 0; x <= t_fps; x += 1) {
    y = BezierCurve(P1, P2, P3, P4, x);
    RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 214) / 60, [dest_y1 + y, 681.8]);
}
RankMaskLayer = Part2.layers.addSolid([0, 0, 0], 'Rank', 893, 128, 1, 5);
RankMaskLayer.startTime = Globaloffset;
RankMaskLayer.property('Position').setValue([960 - 152.5, 540 + 93]);
RankMaskLayer.enabled = false;

Globaloffset += 5;
TrueDuration += 5;

for (rank = 10; rank > 3; rank -= 1) {
    if (!(rank + '_V' in ResourceID)) {
        continue;
    }
    app.project.items[ResourceID[rank + '_V']].mainSource.loop = 2;
    RankVideoLayer = AddLayer(Part2, rank + '_V', SingleLength, Globaloffset - OffsetData[rank] + SingleLength);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= VideoSize[0] / VideoSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (VideoSize[0] / VideoItemSize.width) * 100,
            (VideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (VideoSize[1] / VideoItemSize.height) * 100,
            (VideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([1200, 421]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    AddProgressBar(Part2, VideoSize[0], [1200, 796], SingleLength, Globaloffset, 0.7);

    RankVideoMask = AddLayer(Part2, 'mask_10', SingleLength, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue([0.2, 1, 0]);
    GreenMask.property('Alpha Bias').setValue([0.5, 0.5, 0.5]);
    GreenMask.property('Despill Bias').setValue([0.5, 0.5, 0.5]);
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part2, 'mask_10', SingleLength, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part2, rank + '_T', SingleLength, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 1, 0);

    if (rank == 4) {
        addNext = 0;
        TrueDuration += SingleLength;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part2, 'next', 1, Globaloffset + SingleLength);
        TrueDuration += SingleLength + 1;
    }
    Globaloffset += SingleLength + addNext;
}
Part2.duration = TrueDuration;
BlackLayer.outPoint = Part2.duration;
Part2.openInViewer();

// Part 3

//app.project.items[ResourceID["next_3"]].mainSource.loop = 2;
//RankCN = ['主榜 第一名', '主榜 第二名', '主榜 第三名'];
Globaloffset = 0;
SingleLength = 45;
TrueDuration = 0;
BlackLayer = Part3.layers.addSolid([0, 0, 0], '黑底', CompSize[0], CompSize[1], 1, 1);
for (rank = 3; rank > 0; rank -= 1) {
    if (!(rank + '_V' in ResourceID)) {
        continue;
    }
    app.project.items[ResourceID[rank + '_V']].mainSource.loop = 2;
    NextLayer = AddLayer(Part3, 'next_3', 5, Globaloffset);
    NextLayer.timeRemapEnabled = true;
    NextLayer.property('ADBE Time Remapping').setValueAtTime(4 + 59 / 60, 4 + 59 / 60);
    NextLayer.property('ADBE Time Remapping').setValueAtTime(9 + 59 / 60, 4 + 59 / 60);
    NextLayer.outPoint = Globaloffset + 5 + SingleLength;
    PointTextLayer = Part3.layers.addText(PointData[rank] + ' POINTS');
    PointTextLayer.startTime = Globaloffset;
    PointTextLayer.outPoint = Globaloffset + 5;
    PointTextLayer.trackMatteType = TrackMatteType.ALPHA;
    PointTextDocument = PointTextLayer.property('Source Text').value;
    PointTextDocument.resetCharStyle();
    PointTextDocument.resetParagraphStyle();
    PointTextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    PointTextDocument.applyFill = true;
    PointTextDocument.applyStroke = false;
    PointTextLayer.property('Source Text').setValue(PointTextDocument);
    PointTextLayer.property('Source Text').expression =
        'text.sourceText.createStyle().setFont("Montserrat-SemiBold")' +
        '.setFillColor(hexToRgb("9049C6")).setFontSize(44).setLeading(260);';
    PointTextLayer.property('Source Text').expression.enabled = true;
    PointTextLayer.property('Position').setValue([-105, 749]);

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
        PointTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 44) / 60, [dest_y1 + y, 749]);
    }

    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        PointTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 199) / 60, [dest_y1 + y, 749]);
    }

    PointMaskLayer = Part3.layers.addSolid([0, 0, 0], 'Points', 556, 49, 1, 5);
    PointMaskLayer.startTime = Globaloffset;
    PointMaskLayer.property('Position').setValue([960 - 321, 540 + 192.5]);
    PointMaskLayer.enabled = false;

    RankTextLayer = Part3.layers.addText(TrueRankData[rank]);
    RankTextLayer.startTime = Globaloffset;
    RankTextLayer.outPoint = Globaloffset + 5;
    RankTextLayer.trackMatteType = TrackMatteType.ALPHA;
    RankTextDocument = RankTextLayer.property('Source Text').value;
    RankTextDocument.resetCharStyle();
    RankTextDocument.resetParagraphStyle();
    RankTextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    RankTextDocument.applyFill = true;
    RankTextDocument.applyStroke = false;
    RankTextLayer.property('Source Text').setValue(RankTextDocument);
    RankTextLayer.property('Source Text').expression =
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC")' +
        '.setFillColor(hexToRgb("9049C6")).setFontSize(118).setLeading(243);';
    RankTextLayer.property('Source Text').expression.enabled = true;
    RankTextLayer.property('Position').setValue([-438, 681.8]);

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
        RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 18) / 60, [dest_y1 + y, 681.8]);
    }
    c1 = 1;
    c2 = 7 / 67;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 214) / 60, [dest_y1 + y, 681.8]);
    }
    RankMaskLayer = Part3.layers.addSolid([0, 0, 0], 'Rank', 893, 128, 1, 5);
    RankMaskLayer.startTime = Globaloffset;
    RankMaskLayer.property('Position').setValue([960 - 152.5, 540 + 93]);
    RankMaskLayer.enabled = false;

    Globaloffset += 5;

    PreComp = app.project.items.addComp('Pre' + rank + '_V', 1920, 1080, 1, SingleLength, 60);
    ReCountResource();

    RankVideoLayer = AddLayer(PreComp, rank + '_V', SingleLength, 0 - OffsetData[rank] + SingleLength);
    RankVideoLayer.inPoint = 0;
    RankVideoLayer.outPoint = SingleLength;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= VideoSize[0] / VideoSize[1]) {
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
    AddAudioProperty(RankVideoLayer, 2, 1, 0, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, SingleLength - 1, 2);
    AddProgressBar(PreComp, CompSize[0], [960, 1076], SingleLength, 0, 0);
    MaskDuratrion = 10;

    MP4layer = AddLayer(PreComp, 'effect', MaskDuratrion, 2);
    MP4layer.property('Position').setValue([1000, 148]);
    MP4layer.property('Scale').setValue([188, 188]);

    BottomLayer = PreComp.layers.addShape();
    BottomLayer.name = '底部文本框';
    BottomGroup = BottomLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    BottomVector = BottomGroup.addProperty('ADBE Vectors Group');
    BottomVector.addProperty('ADBE Vector Shape - Rect');
    BottomVector.addProperty('ADBE Vector Graphic - G-Fill');
    BottomVector.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 378;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        BottomVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 45]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        BottomVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 45]);
    }
    BottomVector.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    BottomVector.property('ADBE Vector Graphic - G-Fill').property('ADBE Vector Grad Start Pt').setValue([-306, 67]);
    BottomVector.property('ADBE Vector Graphic - G-Fill').property('ADBE Vector Grad End Pt').setValue([70, 5]);
    BottomVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    BottomVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').setValue([0, 0, 0, 1]);
    BottomGroup.property('ADBE Vector Transform Group').property('ADBE Vector Position').setValue([755, 502.5]);
    BottomLayer.property('Position').setValue([84 + 870, 1041 - 506]);

    BottomGroup2 = BottomLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    BottomVector2 = BottomGroup2.addProperty('ADBE Vectors Group');
    BottomVector2.addProperty('ADBE Vector Shape - Rect');
    BottomVector2.addProperty('ADBE Vector Graphic - G-Fill');
    BottomVector2.addProperty('ADBE Vector Filter - Repeater');
    BottomVector2.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 282;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        BottomVector2.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 45]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        BottomVector2.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 45]);
    }
    BottomVector2.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    BottomVector2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Copies').setValue(4);
    BottomVector2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Transform')
        .property('ADBE Vector Repeater Position').setValue([-328, 0]);
    BottomVector2.property('ADBE Vector Graphic - G-Fill').property('ADBE Vector Grad Start Pt').setValue([-306, 67]);
    BottomVector2.property('ADBE Vector Graphic - G-Fill').property('ADBE Vector Grad End Pt').setValue([70, 5]);
    BottomVector2.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    BottomVector2.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').setValue([0, 0, 0, 1]);
    BottomGroup2.property('ADBE Vector Transform Group').property('ADBE Vector Position').setValue([283, 502.5]);
    MP4layer.trackMatteType = TrackMatteType.ALPHA;

    MP4layer2 = AddLayer(PreComp, 'effect', MaskDuratrion, 2);
    MP4layer2.property('Position').setValue([1072, -628]);
    MP4layer2.property('Scale').setValue([188, 188]);

    TopLayer = PreComp.layers.addShape();
    TopLayer.name = '顶部文本框';
    TopGroup = TopLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    TopVector = TopGroup.addProperty('ADBE Vectors Group');
    TopVector.addProperty('ADBE Vector Shape - Rect');
    TopVector.addProperty('ADBE Vector Graphic - G-Fill');
    TopVector.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 1590;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        TopVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 72]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        TopVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 72]);
    }
    TopVector.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    TopVector.property('ADBE Vector Graphic - G-Fill').property('ADBE Vector Grad Start Pt').setValue([-306, 67]);
    TopVector.property('ADBE Vector Graphic - G-Fill').property('ADBE Vector Grad End Pt').setValue([70, 5]);
    TopVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    TopVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').setValue([0, 0, 0, 1]);
    TopGroup.property('ADBE Vector Transform Group').property('ADBE Vector Position').setValue([21, 538.5]);
    TopLayer.property('Position').setValue([296 + 776, 75 - 544]);
    MP4layer2.trackMatteType = TrackMatteType.ALPHA;

    BlurLayer = PreComp.layers.addSolid([1, 1, 1], 'BlurLayer', 1920, 1080, 1, 10);
    BlurLayer.property('Effects').addProperty('ADBE HUE SATURATION');
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0004').setValue(-30);
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0005').setValue(9);
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0006').setValue(-7);
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0007').setValue(1);
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0008').setValue(-80);
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0009').setValue(13);
    BlurLayer.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0010').setValue(21);
    BlurLayer.property('Effects').addProperty('ADBE Fractal Noise');
    BlurLayer.property('Effects').property('ADBE Fractal Noise').property('ADBE Fractal Noise-0010').setValue(1);
    BlurLayer.property('Effects').property('ADBE Fractal Noise').property('ADBE Fractal Noise-0029').setValue(30);
    BlurLayer.property('Effects').property('ADBE Fractal Noise').property('ADBE Fractal Noise-0030').setValue(7);
    BlurLayer.property('Effects').addProperty('ADBE Gaussian Blur 2');
    BlurLayer.property('Effects').property('ADBE Gaussian Blur 2').property('ADBE Gaussian Blur 2-0001').setValue(40);
    BlurLayer.property('Effects').property('ADBE Gaussian Blur 2').property('ADBE Gaussian Blur 2-0003').setValue(1);
    BlurLayer.adjustmentLayer = true;

    DataLayer = PreComp.layers.addShape();
    DataLayer.name = '数据文本框';
    DataGroup = DataLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    DataVector = DataGroup.addProperty('ADBE Vectors Group');
    DataVector.addProperty('ADBE Vector Shape - Rect');
    DataVector.addProperty('ADBE Vector Graphic - Fill');
    DataVector.addProperty('ADBE Vector Filter - Repeater');
    DataVector.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 282;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 45]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 45]);
    }
    DataVector.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(19);
    DataVector.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color')
        .setValue([230 / 255, 230 / 255, 230 / 255, 1]);
    DataVector.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Copies').setValue(4);
    DataVector.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Transform')
        .property('ADBE Vector Repeater Position').setValue([315, 0]);
    DataVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(1);
    DataLayer.property('Position').setValue([802, 151]);

    DataGroup2 = DataLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    DataVector2 = DataGroup2.addProperty('ADBE Vectors Group');
    DataVector2.addProperty('ADBE Vector Shape - Rect');
    DataVector2.addProperty('ADBE Vector Graphic - Fill');
    DataVector2.addProperty('ADBE Vector Filter - Repeater');
    DataVector2.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 282;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataVector2.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 45]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataVector2.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 45]);
    }
    DataVector2.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(19);
    DataVector2.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color')
        .setValue([230 / 255, 230 / 255, 230 / 255, 1]);
    DataVector2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Copies').setValue(4);
    DataVector2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Transform')
        .property('ADBE Vector Repeater Position').setValue([315, 0]);
    DataVector2.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(1);
    DataGroup2.property('ADBE Vector Transform Group').property('ADBE Vector Position').setValue([0, 70]);

    DataCircleLayer = PreComp.layers.addShape();
    DataCircleLayer.name = '数据文本框';
    DataCircleGroup = DataCircleLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    DataCircleVector = DataCircleGroup.addProperty('ADBE Vectors Group');
    DataCircleVector.addProperty('ADBE Vector Shape - Rect');
    DataCircleVector.addProperty('ADBE Vector Filter - Repeater');
    DataCircleVector.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 282;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataCircleVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 45]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataCircleVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 45]);
    }
    DataCircleVector.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(19);
    DataCircleVector.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Copies').setValue(4);
    DataCircleVector.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Transform')
        .property('ADBE Vector Repeater Position').setValue([315, 0]);
    DataCircleVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(1);
    DataCircleLayer.property('Position').setValue([802, 151]);

    DataCircleGroup2 = DataCircleLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    DataCircleVector2 = DataCircleGroup2.addProperty('ADBE Vectors Group');
    DataCircleVector2.addProperty('ADBE Vector Shape - Rect');
    DataCircleVector2.addProperty('ADBE Vector Filter - Repeater');
    DataCircleVector2.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 282;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataCircleVector2.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 45]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        DataCircleVector2.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 45]);
    }
    DataCircleVector2.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(19);
    DataCircleVector2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Copies').setValue(4);
    DataCircleVector2.property('ADBE Vector Filter - Repeater').property('ADBE Vector Repeater Transform')
        .property('ADBE Vector Repeater Position').setValue([315, 0]);
    DataCircleVector2.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(1);
    DataCircleGroup2.property('ADBE Vector Transform Group').property('ADBE Vector Position').setValue([0, 70]);
    BlurLayer.trackMatteType = TrackMatteType.ALPHA;

    BlurLayer2 = PreComp.layers.addSolid([1, 1, 1], 'BlurLayer', 1920, 1080, 1, 10);
    BlurLayer2.property('Effects').addProperty('ADBE HUE SATURATION');
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0004').setValue(-30);
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0005').setValue(9);
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0006').setValue(-7);
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0007').setValue(1);
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0008').setValue(-80);
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0009').setValue(13);
    BlurLayer2.property('Effects').property('ADBE HUE SATURATION').property('ADBE HUE SATURATION-0010').setValue(21);
    BlurLayer2.property('Effects').addProperty('ADBE Fractal Noise');
    BlurLayer2.property('Effects').property('ADBE Fractal Noise').property('ADBE Fractal Noise-0010').setValue(1);
    BlurLayer2.property('Effects').property('ADBE Fractal Noise').property('ADBE Fractal Noise-0029').setValue(30);
    BlurLayer2.property('Effects').property('ADBE Fractal Noise').property('ADBE Fractal Noise-0030').setValue(7);
    BlurLayer2.property('Effects').addProperty('ADBE Gaussian Blur 2');
    BlurLayer2.property('Effects').property('ADBE Gaussian Blur 2').property('ADBE Gaussian Blur 2-0001').setValue(40);
    BlurLayer2.property('Effects').property('ADBE Gaussian Blur 2').property('ADBE Gaussian Blur 2-0003').setValue(1);
    BlurLayer2.adjustmentLayer = true;

    ScoreLayer = PreComp.layers.addShape();
    ScoreLayer.name = '数据文本框';
    ScoreGroup = ScoreLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    ScoreVector = ScoreGroup.addProperty('ADBE Vectors Group');
    ScoreVector.addProperty('ADBE Vector Shape - Rect');
    ScoreVector.addProperty('ADBE Vector Graphic - Fill');
    ScoreVector.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 334;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        ScoreVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 117]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        ScoreVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 117]);
    }
    ScoreVector.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    ScoreVector.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue([1, 1, 1, 1]);
    ScoreVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(0);
    ScoreLayer.property('Position').setValue([-178 + 645, -353 + 542.5]);

    ScoreCircleLayer = PreComp.layers.addShape();
    ScoreCircleLayer.name = '数据文本框';
    ScoreCircleGroup = ScoreCircleLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    ScoreCircleVector = ScoreCircleGroup.addProperty('ADBE Vectors Group');
    ScoreCircleVector.addProperty('ADBE Vector Shape - Rect');
    ScoreCircleVector.addProperty('ADBE Vector Graphic - Stroke');
    t_fps = 60;
    dest_y1 = 0;
    dest_y2 = 334;
    dest = dest_y2 - dest_y1;
    c1 = 1 / 3;
    c2 = 0;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        ScoreCircleVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(x / 60, [dest_y1 + y, 117]);
    }
    c1 = 1;
    c2 = 2 / 3;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        ScoreCircleVector.property('ADBE Vector Shape - Rect')
            .property('ADBE Vector Rect Size')
            .setValueAtTime(10 - 1 + x / 60, [dest_y1 + y, 117]);
    }
    ScoreCircleVector.property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness').setValue(20);
    ScoreCircleVector.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').setValue(1);
    ScoreCircleLayer.property('Position').setValue([-178 + 645, -353 + 542.5]);
    BlurLayer2.trackMatteType = TrackMatteType.ALPHA;

    BFLayer = AddLayer(PreComp, 'bf', MaskDuratrion, 2);
    DMLayer = AddLayer(PreComp, 'dm', MaskDuratrion, 2);
    DZLayer = AddLayer(PreComp, 'dz', MaskDuratrion, 2);
    PLLayer = AddLayer(PreComp, 'pl', MaskDuratrion, 2);
    SCLayer = AddLayer(PreComp, 'sc', MaskDuratrion, 2);
    TBLayer = AddLayer(PreComp, 'tb', MaskDuratrion, 2);
    LastRankLayer = PreComp.layers.addText('上期排名');
    LastRankDocument = LastRankLayer.property('Source Text').value;
    LastRankDocument.resetCharStyle();
    LastRankDocument.resetParagraphStyle();
    LastRankDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    LastRankDocument.applyFill = true;
    LastRankDocument.applyStroke = false;
    LastRankLayer.property('Source Text').setValue(LastRankDocument);
    LastRankLayer.property('Source Text').expression =
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC")' +
        '.setFillColor(hexToRgb("FFFFFF")).setFontSize(35).setLeading(99);';
    LastRankLayer.property('Source Text').expression.enabled = true;
    LastRankLayer.property('Position').setValue([760.5 - 70, 165.5]);

    TotalScoreLayer = PreComp.layers.addText('总分');
    TotalScoreDocument = TotalScoreLayer.property('Source Text').value;
    TotalScoreDocument.resetCharStyle();
    TotalScoreDocument.resetParagraphStyle();
    TotalScoreDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
    TotalScoreDocument.applyFill = true;
    TotalScoreDocument.applyStroke = false;
    TotalScoreLayer.property('Source Text').setValue(TotalScoreDocument);
    TotalScoreLayer.property('Source Text').expression =
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC")' +
        '.setFillColor(hexToRgb("FFFFFF")).setFontSize(56).setLeading(99);';
    TotalScoreLayer.property('Source Text').expression.enabled = true;
    TotalScoreLayer.property('Position').setValue([470 - 56, 188]);

    BottomLayer.startTime = 2;
    TopLayer.startTime = 2;
    BlurLayer.startTime = 2;
    BlurLayer2.startTime = 2;
    DataLayer.startTime = 2;
    DataCircleLayer.startTime = 2;
    ScoreLayer.startTime = 2;
    ScoreCircleLayer.startTime = 2;
    LastRankLayer.startTime = 2;
    TotalScoreLayer.startTime = 2;
    BottomLayer.outPoint = 2 + MaskDuratrion;
    TopLayer.outPoint = 2 + MaskDuratrion;
    BlurLayer.outPoint = 2 + MaskDuratrion;
    BlurLayer2.outPoint = 2 + MaskDuratrion;
    DataLayer.outPoint = 2 + MaskDuratrion;
    DataCircleLayer.outPoint = 2 + MaskDuratrion;
    ScoreLayer.outPoint = 2 + MaskDuratrion;
    ScoreCircleLayer.outPoint = 2 + MaskDuratrion;
    LastRankLayer.outPoint = 2 + MaskDuratrion;
    TotalScoreLayer.outPoint = 2 + MaskDuratrion;

    BFLayer.property('Scale').setValue([19.3333, 19.3333]);
    BFLayer.property('Position').setValue([1010.25, 151.5]);
    DMLayer.property('Scale').setValue([23.6667, 23.6667]);
    DMLayer.property('Position').setValue([1010.5, 222.5]);
    DZLayer.property('Scale').setValue([17.6667, 17.6667]);
    DZLayer.property('Position').setValue([1321, 151]);
    PLLayer.property('Scale').setValue([21.6667, 21.6667]);
    PLLayer.property('Position').setValue([1321.5, 222.5]);
    SCLayer.property('Scale').setValue([15.3333, 15.3333]);
    SCLayer.property('Position').setValue([1636, 221]);
    TBLayer.property('Scale').setValue([14, 14]);
    TBLayer.property('Position').setValue([1635.5, 150.5]);

    BFLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    BFLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    BFLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    BFLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    DMLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    DMLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    DMLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    DMLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    DZLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    DZLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    DZLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    DZLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    PLLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    PLLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    PLLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    PLLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    SCLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    SCLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    SCLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    SCLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    TBLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    TBLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    TBLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    TBLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    LastRankLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    LastRankLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    LastRankLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    LastRankLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    TotalScoreLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    TotalScoreLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    TotalScoreLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    TotalScoreLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);

    RankDataLayer = AddLayer(PreComp, rank + '_T', MaskDuratrion, 2);

    RankDataLayer.property('Opacity').setValueAtTime(2 + 0.5, 0);
    RankDataLayer.property('Opacity').setValueAtTime(2 + 1, 100);
    RankDataLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
    RankDataLayer.property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);

    PreRankLayer = AddLayer(Part3, 'Pre' + rank + '_V', SingleLength, Globaloffset);
    Shadow = PreRankLayer.property('Effects').addProperty('ADBE Drop Shadow');
    Shadow.property('ADBE Drop Shadow-0001').setValue([0, 0, 0]);
    Shadow.property('ADBE Drop Shadow-0002').setValue(255);
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
    TrueDuration += SingleLength + 5;
    Globaloffset += SingleLength;
}
Part3.duration = TrueDuration;
BlackLayer.outPoint = Part3.duration;
Part3.openInViewer();