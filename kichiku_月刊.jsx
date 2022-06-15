// @include "json2/json2.js"

app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
app.newProject();

CompSize = [1920, 1080];
OutVideoSize = CompSize * 0.745;
RankVideoSize = CompSize * 0.705;
NewVideoSize = CompSize * 0.680;
CompFPS = 25;

Part1 = app.project.items.addComp('主榜20-11', 1920, 1080, 1, 5, CompFPS);
Part2 = app.project.items.addComp('榜外推荐', 1920, 1080, 1, 5, CompFPS);
Part3 = app.project.items.addComp('主榜10-4', 1920, 1080, 1, 5, CompFPS);
Part4 = app.project.items.addComp('新人自荐', 1920, 1080, 1, 5, CompFPS);
Next3 = app.project.items.addComp('Next3', 1920, 1080, 1, 5, CompFPS);
Next2 = app.project.items.addComp('Next2', 1920, 1080, 1, 5, CompFPS);
Next1 = app.project.items.addComp('Next1', 1920, 1080, 1, 5, CompFPS);
Part5 = app.project.items.addComp('主榜3-1', 1920, 1080, 1, 5, CompFPS);
Part6 = app.project.items.addComp('副榜', 1920, 1080, 1, 5 * 36, CompFPS);
Final = app.project.items.addComp('总合成', 1920, 1080, 1, 27, CompFPS);

jsondata = new File('月刊数据.json');
jsondata.open('r');
content = jsondata.read();
jsondata.close();
FootageData = JSON.parse(content);

FootageFile = {};
OffsetData = {};
PointData = {};

for (key = 0; key < FootageData.length; key++) {
    RankList = FootageData[key]['type'];
    Rank = FootageData[key]['rank'];
    FileName = 'Rank_' + Rank;
    FootageFile[RankList + FileName + '_Video'] = FootageData[key]['video'];
    if (FootageData[key]['image'] != '') {
        FootageFile[RankList + FileName + '_Image'] = FootageData[key]['image'];
    }
    OffsetData[RankList + Rank] = FootageData[key]['offset'];
    PointData[RankList + Rank] = FootageData[key]['point'];
}

Footage = app.project.items.addFolder('Footage');
for (key in FootageFile) {
    if (typeof FootageFile[key] != 'undefined') {
        ResourceFile = new ImportOptions(File(FootageFile[key]));
        ResourceFile.ImportAs = ImportAsType.FOOTAGE;
        FileItem = app.project.importFile(ResourceFile);
        FileItem.name = key;
        FileItem.parentFolder = Footage;
    }
}


Template = app.project.items.addFolder('Template');
TemplateFile = {
    mask_new: './绿幕抠图/! 新人自荐.mp4',
    mask_out: './绿幕抠图/! 榜外推荐.mp4',
    mask_sub: './绿幕抠图/! 副榜 21-125.mp4',
    mask_20: './绿幕抠图/! 主榜20-11.mp4',
    mask_10: './绿幕抠图/! 主榜10-4.mp4',
    mask_3: './绿幕抠图/! 主榜3-1.mov',
    next_new: './绿幕抠图/! next 新人自荐.mp4',
    next_out: './绿幕抠图/! next 榜外推荐.mp4',
    next_sub: './绿幕抠图/! next 副榜21-125.mp4',
    next_20: './绿幕抠图/! next 主榜20-11.mp4',
    next_10: './绿幕抠图/! next 主榜10-4.mp4',
    next_3: './绿幕抠图/! next 主榜3-1.mp4',
    next: './绿幕抠图/! next.mp4',
    1: './副榜21-125/Rank_1-3.png',
    2: './副榜21-125/Rank_4-6.png',
    3: './副榜21-125/Rank_7-9.png',
    4: './副榜21-125/Rank_10-12.png',
    5: './副榜21-125/Rank_13-15.png',
    6: './副榜21-125/Rank_16-18.png',
    7: './副榜21-125/Rank_19-21.png',
    8: './副榜21-125/Rank_22-24.png',
    9: './副榜21-125/Rank_25-27.png',
    10: './副榜21-125/Rank_28-30.png',
    11: './副榜21-125/Rank_31-33.png',
    12: './副榜21-125/Rank_34-36.png',
    13: './副榜21-125/Rank_37-39.png',
    14: './副榜21-125/Rank_40-42.png',
    15: './副榜21-125/Rank_43-45.png',
    16: './副榜21-125/Rank_46-48.png',
    17: './副榜21-125/Rank_49-51.png',
    18: './副榜21-125/Rank_52-54.png',
    19: './副榜21-125/Rank_55-57.png',
    20: './副榜21-125/Rank_58-60.png',
    21: './副榜21-125/Rank_61-63.png',
    22: './副榜21-125/Rank_64-66.png',
    23: './副榜21-125/Rank_67-69.png',
    24: './副榜21-125/Rank_70-72.png',
    25: './副榜21-125/Rank_73-75.png',
    26: './副榜21-125/Rank_76-78.png',
    27: './副榜21-125/Rank_79-81.png',
    28: './副榜21-125/Rank_82-84.png',
    29: './副榜21-125/Rank_85-87.png',
    30: './副榜21-125/Rank_88-90.png',
    31: './副榜21-125/Rank_91-93.png',
    32: './副榜21-125/Rank_94-96.png',
    33: './副榜21-125/Rank_97-99.png',
    34: './副榜21-125/Rank_100-102.png',
    35: './副榜21-125/Rank_103-105.png',
};

for (key in TemplateFile) {
    if (typeof TemplateFile[key] != 'undefined') {
        ResourceFile = new ImportOptions(File(TemplateFile[key]));
        ResourceFile.ImportAs = ImportAsType.FOOTAGE;
        FileItem = app.project.importFile(ResourceFile);
        FileItem.name = key;
        FileItem.parentFolder = Template;
    }
}

ResourceID = {};

function ReCountResource() {
    for (n = 1; n <= app.project.items.length; n++) {
        ResourceID[app.project.items[n].name] = n;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : null;
}

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

function AddProgressBar(Target, Length, Position, Duration, Offset, Delay, Reverse) {
    NewLayer = Target.layers.addShape();
    NewLayer.startTime = Offset;
    NewLayer.outPoint = Duration + Offset;
    NewLayer.name = 'Progress';
    if (Reverse) {
        start = [8, 0];
        end = [8, Length];

    } else {
        start = [0, 8];
        end = [Length, 8];
    }
    VectorGroup = NewLayer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group')
        .addProperty('ADBE Vectors Group');
    VectorGroup.addProperty('ADBE Vector Shape - Rect');
    VectorGroup.addProperty('ADBE Vector Graphic - Fill');
    VectorGroup.addProperty('ADBE Vector Graphic - Stroke');
    VectorGroup.property('ADBE Vector Shape - Rect')
        .property('ADBE Vector Rect Size')
        .setValueAtTime(Offset + Delay, start);
    VectorGroup.property('ADBE Vector Shape - Rect')
        .property('ADBE Vector Rect Size')
        .setValueAtTime(Offset + 0.5 + Delay, end);
    VectorGroup.property('ADBE Vector Shape - Rect')
        .property('ADBE Vector Rect Size')
        .setValueAtTime(Offset + Duration, start);
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

// 主榜 20-11
Globaloffset = 5;
SingleLength = 25;
BlackLayer = Part1.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
AddLayer(Part1, 'next_20', 5, 0);
for (rank = 20; rank >= 11; rank -= 1) {
    VideoFile = '主榜Rank_' + rank + '_Video';
    ImageFile = '主榜Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['主榜' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part1, VideoFile, VideoDuration, Globaloffset - OffsetData['主榜' + rank]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + VideoDuration - 1, 2);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + VideoDuration;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= RankVideoSize[0] / RankVideoSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (RankVideoSize[0] / VideoItemSize.width) * 100,
            (RankVideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (RankVideoSize[1] / VideoItemSize.height) * 100,
            (RankVideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([756, 600]);
    AddProgressBar(
        Part1, RankVideoSize[1], [(RankVideoSize[0] - 8) / 2 + 756, 600], VideoDuration, Globaloffset, 0.75, true);
    RankVideoMask = AddLayer(Part1, 'mask_20', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('FFFFFF'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part1, 'mask_20', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[78,218], [1434,218], [1434,982], [78,982]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part1, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    if (rank == 11) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part1, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part1.duration = BlackLayer.outPoint = Globaloffset;

// 榜外推荐
Globaloffset = 5;
SingleLength = 25;
BlackLayer = Part2.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
AddLayer(Part2, 'next_out', 5, 0);
for (rank = 10; rank >= 1; rank -= 1) {
    VideoFile = '榜外Rank_' + rank + '_Video';
    ImageFile = '榜外Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['榜外' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part2, VideoFile, VideoDuration, Globaloffset - OffsetData['榜外' + rank]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + VideoDuration - 1, 2);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + VideoDuration;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= OutVideoSize[0] / OutVideoSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (OutVideoSize[0] / VideoItemSize.width) * 100,
            (OutVideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (OutVideoSize[1] / VideoItemSize.height) * 100,
            (OutVideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([1132, 606]);
    AddProgressBar(
        Part2, OutVideoSize[1], [(OutVideoSize[0] - 8) / 2 + 1132, 606], VideoDuration, Globaloffset, 0.75, true);
    RankVideoMask = AddLayer(Part2, 'mask_out', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('FFFFFF'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part2, 'mask_out', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[416,203], [1848,203], [1848,1009], [416,1009]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part2, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    if (rank == 1) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part2, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part2.duration = BlackLayer.outPoint = Globaloffset;

// 主榜 10-4
Globaloffset = 5;
SingleLength = 25;
BlackLayer = Part3.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
AddLayer(Part3, 'next_10', 5, 0);
for (rank = 10; rank >= 4; rank -= 1) {
    VideoFile = '主榜Rank_' + rank + '_Video';
    ImageFile = '主榜Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['主榜' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part3, VideoFile, VideoDuration, Globaloffset - OffsetData['主榜' + rank]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + VideoDuration - 1, 2);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + VideoDuration;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= RankVideoSize[0] / RankVideoSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (RankVideoSize[0] / VideoItemSize.width) * 100,
            (RankVideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (RankVideoSize[1] / VideoItemSize.height) * 100,
            (RankVideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([756, 600]);
    AddProgressBar(
        Part3, RankVideoSize[1], [(RankVideoSize[0] - 8) / 2 + 756, 600], VideoDuration, Globaloffset, 0.75, true);
    RankVideoMask = AddLayer(Part3, 'mask_10', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('FFFFFF'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part3, 'mask_10', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[78,218], [1434,218], [1434,982], [78,982]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part3, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    RankDataLayer.property('Effects').addProperty('ADBE HUE SATURATION');
    RankDataEffect = RankDataLayer.property('Effects').property('ADBE HUE SATURATION');
    RankDataEffect.property('ADBE HUE SATURATION-0004').setValue(289);
    RankDataEffect.property('ADBE HUE SATURATION-0005').setValue(0);
    RankDataEffect.property('ADBE HUE SATURATION-0006').setValue(0);
    RankDataEffect.property('ADBE HUE SATURATION-0007').setValue(0);
    RankDataEffect.property('ADBE HUE SATURATION-0008').setValue(0);
    RankDataEffect.property('ADBE HUE SATURATION-0009').setValue(25);
    RankDataEffect.property('ADBE HUE SATURATION-0010').setValue(0);
    if (rank == 4) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part3, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part3.duration = BlackLayer.outPoint = Globaloffset;

// 新人自荐
Globaloffset = 5;
SingleLength = 25;
BlackLayer = Part4.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
AddLayer(Part4, 'next_new', 5, 0);
for (rank = 10; rank >= 1; rank -= 1) {
    VideoFile = '新人Rank_' + rank + '_Video';
    ImageFile = '新人Rank_' + rank + '_Image';
    if (!(VideoFile in ResourceID)) {
        continue;
    }
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['新人' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part4, VideoFile, VideoDuration, Globaloffset - OffsetData['新人' + rank]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + VideoDuration - 1, 2);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + VideoDuration;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= NewVideoSize[0] / NewVideoSize[1]) {
        RankVideoLayer.property('Scale').setValue([
            (NewVideoSize[0] / VideoItemSize.width) * 100,
            (NewVideoSize[0] / VideoItemSize.width) * 100,
        ]);
    } else {
        RankVideoLayer.property('Scale').setValue([
            (NewVideoSize[1] / VideoItemSize.height) * 100,
            (NewVideoSize[1] / VideoItemSize.height) * 100,
        ]);
    }
    RankVideoLayer.property('Position').setValue([728, 616]);
    AddProgressBar(
        Part4, NewVideoSize[1], [(NewVideoSize[0] - 8) / 2 + 728, 616], VideoDuration, Globaloffset, 0.75, true);
    RankVideoMask = AddLayer(Part4, 'mask_new', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('FFFFFF'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('000001'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part4, 'mask_new', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[74,248], [1382,248], [1382,984], [74,984]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part4, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    if (rank == 1) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part4, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part4.duration = BlackLayer.outPoint = Globaloffset;

// Next 3-1
NextList = [Next1, Next2, Next3];
for (rank = 3; rank >= 1; rank -= 1) {
    Globaloffset = 0;
    Comp = NextList[rank - 1];
    AddLayer(Comp, 'next_3', 5, Globaloffset);
    PointTextLayer = Comp.layers.addText('比上一名高' + PointData['主榜' + rank] + '分');
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
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC_Thin")' +
        '.setFillColor(hexToRgb("FFFFFF")).setFontSize(69).setLeading(0);';
    PointTextLayer.property('Source Text').expression.enabled = true;
    PointTextLayer.property('Position').setValue([-618, 698]);

    PointMaskLayer = Comp.layers.addSolid(hexToRgb('000000'), 'Points', 1728, 928, 1, 5);
    PointMaskLayer.startTime = Globaloffset;
    PointMaskLayer.property('Position').setValue([962, 558]);
    PointMaskLayer.enabled = false;

    RankTextLayer = Comp.layers.addText('主榜' + rank);
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
        'text.sourceText.createStyle().setFont("HarmonyOS_Sans_SC_Light")' +
        '.setFillColor(hexToRgb("FFFFFF")).setFontSize(137).setLeading(876);';
    RankTextLayer.property('Source Text').expression.enabled = true;
    RankTextLayer.property('Position').setValue([-274, 598]);

    RankMaskLayer = Comp.layers.addSolid(hexToRgb('000000'), 'Points', 1728, 928, 1, 5);
    RankMaskLayer.startTime = Globaloffset;
    RankMaskLayer.property('Position').setValue([962, 558]);
    RankMaskLayer.enabled = false;

    t_fps = CompFPS;
    dest_p1 = -618;
    dest_p2 = 230;
    dest_p = dest_p2 - dest_p1;
    dest_r1 = -274;
    dest_r2 = 346;
    dest_r = dest_r2 - dest_r1;
    dest_mx = 100;
    dest_my = 73.3;
    c1 = 21 / 25;
    c2 = 4 / 25;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    PP3 = [c2 * t_fps, dest_p];
    PP4 = [t_fps, dest_p];
    RP3 = [c2 * t_fps, dest_r];
    RP4 = [t_fps, dest_r];
    MXP3 = [c2 * t_fps, dest_mx];
    MXP4 = [t_fps, dest_mx];
    MYP3 = [c2 * t_fps, dest_my];
    MYP4 = [t_fps, dest_my];
    for (x = 0; x <= t_fps; x += 1) {
        py = BezierCurve(P1, P2, PP3, PP4, x);
        PointTextLayer.property('Position').setValueAtTime(Globaloffset + x / CompFPS, [dest_p1 + py, 698]);
        ry = BezierCurve(P1, P2, RP3, RP4, x);
        RankTextLayer.property('Position').setValueAtTime(Globaloffset + x / CompFPS, [dest_r1 + ry, 598]);
        mxy = BezierCurve(P1, P2, MXP3, MXP4, x);
        myy = BezierCurve(P1, P2, MYP3, MYP4, x);
        PointMaskLayer.property('Scale').setValueAtTime(Globaloffset + x / CompFPS, [mxy, myy]);
        RankMaskLayer.property('Scale').setValueAtTime(Globaloffset + x / CompFPS, [mxy, myy]);
    }
    PP1 = [0, dest_p];
    PP2 = [c1 * t_fps, dest_p];
    RP1 = [0, dest_r];
    RP2 = [c1 * t_fps, dest_r];
    MXP1 = [0, dest_mx];
    MXP2 = [c1 * t_fps, dest_mx];
    MYP1 = [0, dest_my];
    MYP2 = [c1 * t_fps, dest_my];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        py = BezierCurve(PP1, PP2, P3, P4, x);
        PointTextLayer.property('Position').setValueAtTime(Globaloffset + 4 + x / CompFPS, [dest_p1 + py, 698]);
        ry = BezierCurve(RP1, RP2, P3, P4, x);
        RankTextLayer.property('Position').setValueAtTime(Globaloffset + 4 + x / CompFPS, [dest_r1 + ry, 598]);
        mxy = BezierCurve(MXP1, MXP2, P3, P4, x);
        myy = BezierCurve(MYP1, MYP2, P3, P4, x);
        PointMaskLayer.property('Scale').setValueAtTime(Globaloffset + 4 + x / CompFPS, [mxy, myy]);
        RankMaskLayer.property('Scale').setValueAtTime(Globaloffset + 4 + x / CompFPS, [mxy, myy]);
    }
}

// 主榜 3-1
Globaloffset = 0;
SingleLength = 45;
BlackLayer = Part5.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
for (rank = 3; rank >= 1; rank -= 1) {
    AddLayer(Part5, 'Next' + rank, 5, Globaloffset);
    Globaloffset += 5;
    VideoFile = '主榜Rank_' + rank + '_Video';
    ImageFile = '主榜Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['主榜' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part5, VideoFile, VideoDuration, Globaloffset - OffsetData['主榜' + rank]);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset, 1);
    AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + VideoDuration - 1, 2);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + VideoDuration;
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
    AddProgressBar(
        Part5, CompSize[0], [960, (CompSize[1] - 8) / 2 + 540], VideoDuration, Globaloffset, 0, false);
    RankVideoMask = AddLayer(Part5, 'mask_3', VideoDuration, Globaloffset);
    RankDataLayer = AddLayer(Part5, ImageFile, VideoDuration, Globaloffset);
    t_fps = CompFPS;
    dest = 100;
    c1 = 21 / 25;
    c2 = 4 / 25;
    P1 = [0, 0];
    P2 = [c1 * t_fps, 0];
    P3 = [c2 * t_fps, dest];
    P4 = [t_fps, dest];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 3 / 4 + x / CompFPS, y);
        RankVideoLayer.property('Opacity').setValueAtTime(Globaloffset + x / CompFPS, y);
    }
    t_fps = CompFPS * 0.68;
    P1 = [0, dest];
    P2 = [c1 * t_fps, dest];
    P3 = [c2 * t_fps, 0];
    P4 = [t_fps, 0];
    for (x = 0; x <= t_fps; x += 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 5 + 17 / 25 + x / CompFPS, y);
        RankVideoLayer.property('Opacity')
            .setValueAtTime(Globaloffset + VideoDuration - 0.68 + x / CompFPS, y);
    }
    Globaloffset += VideoDuration;
}

Part5.duration = BlackLayer.outPoint = Globaloffset;

// 副榜
Globaloffset = 5;
AddLayer(Part6, 'next_sub', 5, 0);
app.project.items[ResourceID['mask_sub']].mainSource.loop = 35;
Bgm = AddLayer(Part6, '副榜Rank_0_Video', 5 * 35, Globaloffset - OffsetData['副榜0']);
Bgm.inPoint = Globaloffset;
Bgm.outPoint = Globaloffset + 5 * 35;
Bgm.property('Opacity').setValue(0);
AddAudioProperty(Bgm, 2, 1, Bgm.inPoint, 1);
AddAudioProperty(Bgm, 2, 2, Bgm.outPoint - 2, 2);
AddLayer(Part6, 'mask_sub', 5 * 35, Globaloffset);
for (n = 1; n <= 35; n += 1) {
    RankDataLayer = AddLayer(Part6, n, 5, Globaloffset);
    NewProperty = RankDataLayer.property('Effects').addProperty('ADBE Linear Wipe');
    NewProperty.property('ADBE Linear Wipe-0001').setValueAtTime(Globaloffset, 100);
    NewProperty.property('ADBE Linear Wipe-0001').setValueAtTime(Globaloffset + 1, 0);
    NewProperty.property('ADBE Linear Wipe-0001').setValueAtTime(Globaloffset + 4, 0);
    NewProperty.property('ADBE Linear Wipe-0001').setValueAtTime(Globaloffset + 5, 100);
    NewProperty.property('ADBE Linear Wipe-0002').setValue(0);
    NewProperty.property('ADBE Linear Wipe-0003').setValue(200);
    Globaloffset += 5;
}

ReCountResource();
Comps = [Part1, Part2, Part3, Part4, Part5, Part6];
for (n = 0; n < Comps.length; n++) {
    AddLayer(Final, Comps[n].name, Comps[n].duration, Final.duration);
    Final.duration += Comps[n].duration;
}
Final.duration += 16;
Final.openInViewer();