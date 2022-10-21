// @include "json2/json2.js"

WEEK_NUM = Math.floor((Date.now() / 1000 - 1635609600) / 3600 / 24 / 7);

app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
app.newProject();

CompSize = [1920, 1080];
OutVideoSize = [1412, 794];
RankVideoSize = [1352, 760];
NewVideoSize = [1306, 734];
CompFPS = 60;

Part_Classic = app.project.items.addComp('经典推荐', 1920, 1080, 1, 30, 60);
Part_Continuity = app.project.items.addComp('连续在榜', 1920, 1080, 1, 1, 60);
Part_Main20 = app.project.items.addComp('主榜20-11', 1920, 1080, 1, 5, CompFPS);
Part_Newbie = app.project.items.addComp('新人自荐', 1920, 1080, 1, 5, CompFPS);
Part_Suggest = app.project.items.addComp('榜外推荐', 1920, 1080, 1, 5, CompFPS);
Part_Main10 = app.project.items.addComp('主榜10-4', 1920, 1080, 1, 5, CompFPS);
Part_Old = app.project.items.addComp('旧稿回顾', 1920, 1080, 1, 25, 60);
Part_Main3 = app.project.items.addComp('主榜3-1', 1920, 1080, 1, 5, CompFPS);
Part_Extra = app.project.items.addComp('副榜', 1920, 1080, 1, 5 * 36, CompFPS);
Final = app.project.items.addComp('哔哩哔哩鬼畜周刊排行榜#' + ('000' + WEEK_NUM).slice(-3), 1920, 1080, 1, 34, CompFPS); //OP

// LOAD DATA
jsondata = new File('周刊数据.json');
jsondata.open('r');
content = jsondata.read();
jsondata.close();
FootageData = JSON.parse(content);

FootageFile = {};
OffsetData = {};
PointData = {};
TrueRankData = {};

for (key = 0; key < FootageData.length; key++) {
    RankList = FootageData[key].type;
    Rank = FootageData[key].rank;
    FileName = 'Rank_' + Rank;
    FootageFile[RankList + FileName + '_Video'] = FootageData[key].video;
    if (FootageData[key].image != '') {
        FootageFile[RankList + FileName + '_Image'] = FootageData[key].image;
    }
    OffsetData[RankList + Rank] = FootageData[key].offset;
    PointData[RankList + Rank] = FootageData[key].point;
    TrueRankData[RankList + Rank] = FootageData[key].true_rank;
}

// LOAD FOOTAGE
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
    mask_classic: './绿幕抠图/!经典推荐2.mp4',
    mask_continuity: './绿幕抠图/!连续在榜.mp4',
    mask_newbie: './绿幕抠图/!新人自荐.mp4',
    mask_suggest: './绿幕抠图/!榜外推荐2.mp4',
    mask_extra: './绿幕抠图/!副榜背景.mp4',
    mask_20: './绿幕抠图/!主榜 20-11绿幕.mp4',
    mask_10: './绿幕抠图/!主榜 10-4绿幕.mp4',
    next_classic: './绿幕抠图/!NEXT 经典推荐.mp4',
    next_continuity: './绿幕抠图/!NEXT 连续在榜.mp4',
    next_newbie: './绿幕抠图/!NEXT 新人自荐.mp4',
    next_suggest: './绿幕抠图/!NEXT 榜外推荐.mp4',
    next_old: './绿幕抠图/!NEXT 旧稿回顾.mp4',
    next_extra: './绿幕抠图/!NEXT 副榜.mp4',
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

// ITEM INDEX
ResourceID = {};

function ReCountResource() {
    for (n = 1; n <= app.project.items.length; n++) {
        ResourceID[app.project.items[n].name] = n;
    }
}

// FUNCTION
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

// 经典回顾
Globaloffset = 0;
SingleLength = 25;
BlackLayer = Part_Classic.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1, 1);
BlackLayer.outPoint = Part_Classic.duration;
ChangeLayer = AddLayer(Part_Classic, 'next_classic', 5, 0);
Globaloffset += 5;
RankVideoLayer = AddLayer(Part_Classic, '经典Rank_0_Video', SingleLength, Globaloffset - OffsetData['经典0']);
RankVideoLayer.inPoint = Globaloffset;
RankVideoLayer.outPoint = Globaloffset + SingleLength;
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
RankVideoLayer.property('Position').setValue([1148, 540]);
// AddAudioProperty(RankVideoLayer, 2, 2, Globaloffset, 1, 1);
// AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
AddProgressBar(Part_Classic, OutVideoSize[0], [1148, 932], SingleLength - 0.5, Globaloffset, 0.75);
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
    RankVideoLayer.property('Audio Levels').setValueAtTime(Globaloffset + x / 60, [dest_y1 + y, dest_y1 + y]);
}
for (x = t_fps; x >= 0; x -= 1) {
    y = BezierCurve(P1, P2, P3, P4, x);
    RankVideoLayer.property('Audio Levels').setValueAtTime(Globaloffset + SingleLength - 2 + (t_fps - x) / 60, [
        dest_y1 + y,
        dest_y1 + y,
    ]);
}
RankVideoMask = AddLayer(Part_Classic, 'mask_classic', SingleLength, Globaloffset);
GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
GreenMask.property('Screen Colour').setValue(hexToRgb('33FF00'));
GreenMask.property('Alpha Bias').setValue(hexToRgb('808080'));
GreenMask.property('Despill Bias').setValue(hexToRgb('808080'));
GreenMask.property('Unpremultiply Result').setValue(null);

RankDataLayer = AddLayer(Part_Classic, '经典Rank_0_Image', SingleLength, Globaloffset);
RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 2, 100);
RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 1, 0);
Part_Classic.openInViewer();


// 连续在榜
Globaloffset = 0;
SingleLength = 25;
LastRank = 0;

for (key = 0; key < FootageData.length; key++) {
    if (FootageData[key].type == '连续'){
        if (FootageData[key].rank > LastRank) {
            LastRank = FootageData[key].rank;
        }
    }
}

Part_Continuity.duration = LastRank * SingleLength + LastRank + 4;
BlackLayer = Part_Continuity.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1, 1);
BlackLayer.outPoint = Part_Continuity.duration;
ChangeLayer = AddLayer(Part_Continuity, 'next_continuity', 5, 0);
Globaloffset += 5;

for (rank = LastRank; rank >= 1; rank -= 1) {
    VideoFile = '连续Rank_' + rank + '_Video';
    ImageFile = '连续Rank_' + rank + '_Image';
    RankVideoLayer = AddLayer(Part_Continuity, VideoFile, SingleLength, Globaloffset - OffsetData['连续' + rank]);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
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
    RankVideoLayer.property('Position').setValue([1200, 421]);
    // AddAudioProperty(RankVideoLayer, 2, 2, Globaloffset, 1, 1);
    // AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    AddProgressBar(Part_Continuity, RankVideoSize[0], [1200, 796], SingleLength - 0.5, Globaloffset, 0.75);
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
        RankVideoLayer.property('Audio Levels').setValueAtTime(Globaloffset + x / 60, [dest_y1 + y, dest_y1 + y]);
    }
    for (x = t_fps; x >= 0; x -= 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankVideoLayer.property('Audio Levels').setValueAtTime(Globaloffset + SingleLength - 2 + (t_fps - x) / 60, [
            dest_y1 + y,
            dest_y1 + y,
        ]);
    }
    RankVideoMask = AddLayer(Part_Continuity, 'mask_continuity', SingleLength, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('0000FF'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part_Continuity, 'mask_continuity', SingleLength, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part_Continuity, ImageFile, SingleLength, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 1, 0);
    if (rank == 1) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part_Continuity, 'next', 1, Globaloffset + SingleLength);
    }
    Globaloffset += SingleLength + addNext;
}
Part_Continuity.openInViewer();


// 主榜 20-11
Globaloffset = 0;
SingleLength = 25;
TrueDuration = 0;
BlackLayer = Part_Main20.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
NextLayer = AddLayer(Part_Main20, 'next_20', 5, Globaloffset);
RankTextLayer = Part_Main20.layers.addText('主榜 ' + TrueRankData['主榜' + 20] + ' - ' + TrueRankData['主榜' + 11] + ' 名');
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
cc1 = 1;
cc2 = 7 / 67;
PP1 = [0, dest];
PP2 = [c1 * t_fps, dest];
PP3 = [c2 * t_fps, 0];
PP4 = [t_fps, 0];
for (x = 0; x <= t_fps; x += 1) {
    y = BezierCurve(P1, P2, P3, P4, x);
    RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 18) / 60, [dest_y1 + y, 681.8]);
}
for (x = 0; x <= t_fps; x += 1) {
    yy = BezierCurve(PP1, PP2, PP3, PP4, x);
    RankTextLayer.property('Position').setValueAtTime(Globaloffset + (x + 214) / 60, [dest_y1 + yy, 681.8]);
}


RankMaskLayer = Part_Main20.layers.addSolid(hexToRgb('000000'), 'Rank', 893, 128, 1, 5);
RankMaskLayer.startTime = Globaloffset;
RankMaskLayer.property('Position').setValue([960 - 152.5, 540 + 93]);
RankMaskLayer.enabled = false;

Globaloffset += 5;

for (rank = 20; rank >= 11; rank -= 1) {
    VideoFile = '主榜Rank_' + rank + '_Video';
    ImageFile = '主榜Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['主榜' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part_Main20, VideoFile, VideoDuration, Globaloffset - OffsetData['主榜' + rank]);
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
    RankVideoLayer.property('Position').setValue([1200, 421]);
    AddProgressBar(
        Part_Main20, RankVideoSize[0], [1200, 796], VideoDuration, Globaloffset, 0.7, false);
    RankVideoMask = AddLayer(Part_Main20, 'mask_20', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('33FF00'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part_Main20, 'mask_20', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part_Main20, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    if (rank == 11) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part_Main20, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part_Main20.duration = BlackLayer.outPoint = Globaloffset;
Part_Main20.openInViewer();


// 新人自荐
Globaloffset = 0;
SingleLength = 25;
LastRank = 0;
for (key = 0; key < FootageData.length; key++) {
    if (FootageData[key].type == '新人'){
        if (FootageData[key].rank > LastRank) {
            LastRank = FootageData[key].rank;
        }
    }
}
Part_Newbie.duration = LastRank * SingleLength + LastRank + 4;
BlackLayer = Part_Newbie.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1, 1);
BlackLayer.outPoint = Part_Newbie.duration;
ChangeLayer = AddLayer(Part_Newbie, 'next_newbie', 5, 0);
Globaloffset += 5;

for (rank = LastRank; rank >= 1; rank -= 1) {
    VideoFile = '新人Rank_' + rank + '_Video';
    ImageFile = '新人Rank_' + rank + '_Image';
    RankVideoLayer = AddLayer(Part_Newbie, VideoFile, SingleLength, Globaloffset - OffsetData['新人' + rank]);
    RankVideoLayer.inPoint = Globaloffset;
    RankVideoLayer.outPoint = Globaloffset + SingleLength;
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
    RankVideoLayer.property('Position').setValue([1150, 542]);
    // AddAudioProperty(RankVideoLayer, 2, 2, Globaloffset, 1, 1);
    // AddAudioProperty(RankVideoLayer, 2, 1, Globaloffset + SingleLength - 1, 2);
    AddProgressBar(Part_Newbie, OutVideoSize[0], [1150, 932], SingleLength - 0.5, Globaloffset, 0.75);
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
        RankVideoLayer.property('Audio Levels').setValueAtTime(Globaloffset + x / 60, [dest_y1 + y, dest_y1 + y]);
    }
    for (x = t_fps; x >= 0; x -= 1) {
        y = BezierCurve(P1, P2, P3, P4, x);
        RankVideoLayer.property('Audio Levels').setValueAtTime(Globaloffset + SingleLength - 2 + (t_fps - x) / 60, [
            dest_y1 + y,
            dest_y1 + y,
        ]);
    }
    RankVideoMask = AddLayer(Part_Newbie, 'mask_newbie', SingleLength, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('33FF00'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part_Newbie, 'mask_newbie', SingleLength, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[445,140], [1855,140], [1855,940], [445,940]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part_Newbie, ImageFile, SingleLength, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + SingleLength - 1, 0);
    if (rank == 1) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part_Newbie, 'next', 1, Globaloffset + SingleLength);
    }
    Globaloffset += SingleLength + addNext;
}
Part_Newbie.openInViewer();


// 榜外推荐
Globaloffset = 5;
SingleLength = 25;
BlackLayer = Part_Suggest.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
AddLayer(Part_Suggest, 'next_suggest', 5, 0);
for (rank = 10; rank >= 1; rank -= 1) {
    VideoFile = '榜外Rank_' + rank + '_Video';
    ImageFile = '榜外Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['榜外' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part_Suggest, VideoFile, VideoDuration, Globaloffset - OffsetData['榜外' + rank]);
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
    RankVideoLayer.property('Position').setValue([1148, 540]);
    AddProgressBar(Part_Suggest, OutVideoSize[0], [1148, 932], VideoDuration, Globaloffset, 0.75, false);
    RankVideoMask = AddLayer(Part_Suggest, 'mask_suggest', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('33FF00'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part_Suggest, 'mask_suggest', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[440,140], [1855,140], [1855,940], [440,940]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part_Suggest, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    if (rank == 1) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part_Suggest, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part_Suggest.duration = BlackLayer.outPoint = Globaloffset;
Part_Suggest.openInViewer();

// 主榜 10-4
Globaloffset = 0;
SingleLength = 25;
BlackLayer = Part_Main10.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1);
AddLayer(Part_Main10, 'next_10', 5, 0);
RankTextLayer = Part_Main10.layers.addText('主榜 ' + TrueRankData['主榜' + 10] + ' - ' + TrueRankData['主榜' + 4] + ' 名');
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
RankMaskLayer = Part_Main10.layers.addSolid(hexToRgb('000000'), 'Rank', 893, 128, 1, 5);
RankMaskLayer.startTime = Globaloffset;
RankMaskLayer.property('Position').setValue([960 - 152.5, 540 + 93]);
RankMaskLayer.enabled = false;
Globaloffset += 5;
for (rank = 10; rank >= 4; rank -= 1) {
    VideoFile = '主榜Rank_' + rank + '_Video';
    ImageFile = '主榜Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['主榜' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    RankVideoLayer = AddLayer(Part_Main10, VideoFile, VideoDuration, Globaloffset - OffsetData['主榜' + rank]);
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
    RankVideoLayer.property('Position').setValue([1200, 421]);
    AddProgressBar(
        Part_Main10, RankVideoSize[0], [1200, 796], VideoDuration, Globaloffset, 0.75, false);
    RankVideoMask = AddLayer(Part_Main10, 'mask_10', VideoDuration, Globaloffset);
    GreenMask = RankVideoMask.property('Effects').addProperty('Keylight 906');
    GreenMask.property('Screen Colour').setValue(hexToRgb('33FF00'));
    GreenMask.property('Alpha Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Despill Bias').setValue(hexToRgb('808080'));
    GreenMask.property('Unpremultiply Result').setValue(null);
    RankVideoMask2 = AddLayer(Part_Main10, 'mask_10', VideoDuration, Globaloffset);
    RankVideoMask2.mask.addProperty('Mask');
    RankVideoMask2.mask(1).maskMode = MaskMode.ADD;
    RankVideoMask2.mask(1).inverted = true;
    RankVideoMask2.mask(1).property(1).expression =
        'mask(1).maskPath = createPath(points=[[525,40], [1875,40], [1875,805], [525,805]], ' +
        'inTangents=[], outTangents=[], is_closed=true)';
    RankDataLayer = AddLayer(Part_Main10, ImageFile, VideoDuration, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + VideoDuration - 1, 0);
    RankDataLayer.property('Effects').addProperty('ADBE HUE SATURATION');
    if (rank == 4) {
        addNext = 0;
    } else {
        addNext = 1;
        NextLayer = AddLayer(Part_Main10, 'next', 1, Globaloffset + VideoDuration);
    }
    Globaloffset += VideoDuration + addNext;
}

Part_Main10.duration = BlackLayer.outPoint = Globaloffset;
Part_Main10.openInViewer();


// 旧稿回顾
Globaloffset = 0;
SingleLength = 25;
LastRank = 3;

Part_Old.duration = LastRank * SingleLength + LastRank + 4;
// BlackLayer = Part_Old.layers.addSolid(hexToRgb('000000'), "黑底", CompSize[0], CompSize[1], 1, 1);
// BlackLayer.outPoint = Part_Old.duration;
ChangeLayer = AddLayer(Part_Old, 'next_old', 5, 0);
ChangeLayer.timeRemapEnabled = true;
ChangeLayer.property('ADBE Time Remapping').setValueAtTime(4 + 59 / 60, 4 + 59 / 60);
ChangeLayer.property('ADBE Time Remapping').setValueAtTime(9 + 59 / 60, 4 + 59 / 60);
ChangeLayer.outPoint = Part_Old.duration;
Globaloffset += 5;

for (rank = 1; rank <= LastRank; rank += 1) {
    VideoFile = '旧稿Rank_' + rank + '_Video';
    ImageFile = '旧稿Rank_' + rank + '_Image';
    PreComp = app.project.items.addComp('Old' + rank + '_V', 1920, 1080, 1, SingleLength, 60);
    PreComp.parentFolder = Footage;
    ReCountResource();
    BlackLayer = PreComp.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1, 1);
    BlackLayer.outPoint = PreComp.duration;

    RankVideoLayer = AddLayer(PreComp, VideoFile, SingleLength, 0 - OffsetData['旧稿' + rank]);
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
    Shadow.property('ADBE Drop Shadow-0001').setValue(hexToRgb('000000'));
    Shadow.property('ADBE Drop Shadow-0002').setValue(255);
    Shadow.property('ADBE Drop Shadow-0003').setValue(120);
    Shadow.property('ADBE Drop Shadow-0004').setValue(5);
    Shadow.property('ADBE Drop Shadow-0005').setValue(7);

    RankDataLayer = AddLayer(PreComp, ImageFile, SingleLength, 0);
    RankDataLayer.property('Opacity').setValueAtTime(1 + 2, 0);
    RankDataLayer.property('Opacity').setValueAtTime(1.5 + 2, 100);
    RankDataLayer.property('Opacity').setValueAtTime(SingleLength - 1.5, 100);
    RankDataLayer.property('Opacity').setValueAtTime(SingleLength - 1, 0);
    PreRankLayer = AddLayer(Part_Old, 'Old' + rank + '_V', SingleLength, Globaloffset);
    Shadow = PreRankLayer.property('Effects').addProperty('ADBE Drop Shadow');
    Shadow.property('ADBE Drop Shadow-0001').setValue(hexToRgb('000000'));
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
        NextLayer = AddLayer(Part_Old, 'next', 1, Globaloffset + SingleLength);
        // NextLayer.timeRemapEnabled = true
        // NextLayer.property("ADBE Time Remapping").setValueAtTime(59 / 60, 59 / 60)
        // NextLayer.property("ADBE Time Remapping").setValueAtTime(1 + 59 / 60, 59 / 60)
        // NextLayer.outPoint = Globaloffset + SingleLength * 2 + 1
    }
    Globaloffset += SingleLength + addNext;
}
Part_Old.openInViewer();


// 主榜 3-1
Globaloffset = 0;
SingleLength = 45;
BlackLayer = Part_Main3.layers.addSolid(hexToRgb('000000'), '黑底', CompSize[0], CompSize[1], 1, 1);
for (rank = 3; rank > 0; rank -= 1) {
    VideoFile = '主榜Rank_' + rank + '_Video';
    ImageFile = '主榜Rank_' + rank + '_Image';
    TrueDuration = app.project.items[ResourceID[VideoFile]].duration;
    if (TrueDuration < SingleLength) {
        VideoDuration = TrueDuration - OffsetData['主榜' + rank];
    } else {
        VideoDuration = SingleLength;
    }
    NextLayer = AddLayer(Part_Main3, 'next_3', 5, Globaloffset);
    NextLayer.timeRemapEnabled = true;
    NextLayer.property('ADBE Time Remapping').setValueAtTime(4 + 59 / 60, 4 + 59 / 60);
    NextLayer.property('ADBE Time Remapping').setValueAtTime(9 + 59 / 60, 4 + 59 / 60);
    NextLayer.outPoint = Globaloffset + 5 + VideoDuration;
    PointTextLayer = Part_Main3.layers.addText(PointData['主榜' + rank] + ' POINTS');
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

    PointMaskLayer = Part_Main3.layers.addSolid(hexToRgb('000000'), 'Points', 556, 49, 1, 5);
    PointMaskLayer.startTime = Globaloffset;
    PointMaskLayer.property('Position').setValue([960 - 321, 540 + 192.5]);
    PointMaskLayer.enabled = false;

    RankTextLayer = Part_Main3.layers.addText(TrueRankData['主榜' + rank]);
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
    RankMaskLayer = Part_Main3.layers.addSolid(hexToRgb('000000'), 'Rank', 893, 128, 1, 5);
    RankMaskLayer.startTime = Globaloffset;
    RankMaskLayer.property('Position').setValue([960 - 152.5, 540 + 93]);
    RankMaskLayer.enabled = false;

    Globaloffset += 5;

    PreComp = app.project.items.addComp('Top' + rank + '_V', 1920, 1080, 1, VideoDuration, 60);
    PreComp.parentFolder = Footage;
    ReCountResource();

    RankVideoLayer = AddLayer(PreComp, VideoFile, VideoDuration, 0 - OffsetData['主榜' + rank]);
    RankVideoLayer.inPoint = 0;
    RankVideoLayer.outPoint = VideoDuration;
    VideoItemSize = RankVideoLayer.sourceRectAtTime(RankVideoLayer.inPoint, false);
    if (VideoItemSize.width / VideoItemSize.height >= RankVideoSize[0] / RankVideoSize[1]) {
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
    AddAudioProperty(RankVideoLayer, 2, 1, VideoDuration - 1, 2);
    AddProgressBar(PreComp, CompSize[0], [960, 1076], VideoDuration, 0, 0);
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

    TempArray = [BottomLayer, TopLayer, BlurLayer, BlurLayer2, DataLayer, DataCircleLayer, ScoreLayer, ScoreCircleLayer, LastRankLayer, TotalScoreLayer];
    for (i = 0; i < TempArray.length; i++) {
        TempArray[i].startTime = 2;
        TempArray[i].outPoint = 2 + MaskDuratrion;
    }

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

    RankDataLayer = AddLayer(PreComp, ImageFile, MaskDuratrion, 2);

    TempArray = [BFLayer, DMLayer, DZLayer, PLLayer, SCLayer, TBLayer, LastRankLayer, TotalScoreLayer, RankDataLayer];
    for (i = 0; i < TempArray.length; i++) {
        TempArray[i].property('Opacity').setValueAtTime(2 + 0.5, 0);
        TempArray[i].property('Opacity').setValueAtTime(2 + 1, 100);
        TempArray[i].property('Opacity').setValueAtTime(2 + MaskDuratrion - 1, 100);
        TempArray[i].property('Opacity').setValueAtTime(2 + MaskDuratrion - 0.5, 0);
    }

    PreRankLayer = AddLayer(Part_Main3, 'Top' + rank + '_V', VideoDuration, Globaloffset);
    Shadow = PreRankLayer.property('Effects').addProperty('ADBE Drop Shadow');
    Shadow.property('ADBE Drop Shadow-0001').setValue(hexToRgb('000000'));
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
            .setValueAtTime(Globaloffset + VideoDuration - 1 + x / 60, [dest_y1 + y, dest_y1 + y]);
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
            .setValueAtTime(Globaloffset + VideoDuration - 0.5 + (x - 1) / 60, [960, dest_y1 + y]);
    }
    TrueDuration += VideoDuration + 5;
    Globaloffset += VideoDuration;
}
Part_Main3.duration = Globaloffset;
BlackLayer.outPoint = Part_Main3.duration;
Part_Main3.openInViewer();


// 副榜
Globaloffset = 5;
AddLayer(Part_Extra, 'next_extra', 5, 0);
app.project.items[ResourceID.mask_extra].mainSource.loop = 1;
Bgm = AddLayer(Part_Extra, '副榜Rank_0_Video', 5 * 35, Globaloffset - OffsetData['副榜0']);
Bgm.inPoint = Globaloffset;
Bgm.outPoint = Globaloffset + 5 * 35;
Bgm.property('Opacity').setValue(0);
AddAudioProperty(Bgm, 2, 1, Bgm.inPoint, 1);
AddAudioProperty(Bgm, 2, 2, Bgm.outPoint - 2, 2);
SubRankLayer = AddLayer(Part_Extra, 'mask_extra', 5 * 35, Globaloffset);
SubRankLayer.property('Opacity').setValueAtTime(Globaloffset, 0);
SubRankLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 100);
SubRankLayer.property('Opacity').setValueAtTime(Globaloffset + 5 * 35 - 1, 100);
SubRankLayer.property('Opacity').setValueAtTime(Globaloffset + 5 * 35, 0);
for (n = 1; n <= 35; n += 1) {
    RankDataLayer = AddLayer(Part_Extra, n, 5, Globaloffset);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset, 0);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 1, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 4, 100);
    RankDataLayer.property('Opacity').setValueAtTime(Globaloffset + 5, 0);
    Globaloffset += 5;
}
Part_Extra.openInViewer();


ReCountResource();
Comps = [Part_Classic, Part_Continuity, Part_Main20, Part_Newbie, Part_Suggest, Part_Main10, Part_Old, Part_Main3, Part_Extra];
for (n = 0; n < Comps.length; n++) {
    TempLayer = AddLayer(Final, Comps[n].name, Comps[n].duration, Final.duration);
    if (Comps[n].duration < 6) {
        TempLayer.audioEnabled = false;
        TempLayer.property('Opacity').setValue(0);
        continue;
    }
    Final.duration += Comps[n].duration;
}

Final.duration += 18; //ED
Final.openInViewer();
