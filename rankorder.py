# -*- coding: utf-8 -*-

import asyncio
import json
from functools import reduce
from os.path import abspath

import aiohttp
import arrow
import requests
from pandas import Series, read_csv, read_excel, to_datetime

PAST = arrow.get("2021-11-08 00:00:00", "YYYY-MM-DD HH:mm:ss")
NOW = arrow.now()
WEEKS = int((NOW.timestamp() - PAST.timestamp()) / 3600 / 24 / 7) + 1
WEEKDAY = int(NOW.format("d"))
BEFORE = NOW.shift(days=-(WEEKDAY + 13)).format("YYYY-MM-DD")
LAST = NOW.shift(days=-(WEEKDAY + 6)).format("YYYY-MM-DD")
THIS = NOW.shift(days=-(WEEKDAY - 1)).format("YYYY-MM-DD")


async def getusername(uid):
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
    }
    params = {
        "mid": uid,
        "jsonp": "jsonp",
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(
            "https://api.bilibili.com/x/space/acc/info", params=params, headers=headers
        ) as resp:
            content = await resp.text()
            result = json.loads(content)
    if result.get("code") == 0:
        return {uid: result["data"].get("name")}
    else:
        return {uid: uid}


async def getcover(aid):
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
    }
    params = {
        "aid": aid,
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(
            "https://api.bilibili.com/x/web-interface/view",
            params=params,
            headers=headers,
        ) as resp:
            content = await resp.text()
            result = json.loads(content)
    if result.get("code") == 0:
        return {aid: result["data"].get("pic")}
    else:
        print(f"av{aid} 封面获取失败: {result.get('message')}")
        return {aid: None}


def downcover(rank, aid, link):
    try:
        response = requests.get(link)
    except requests.exceptions.MissingSchema:
        print(f"{rank}_av{aid}.jpg 下载失败\n")
        return None
    with open(f"./pic/{rank}_av{aid}.jpg", "wb") as f:
        f.write(response.content)


def readExcel(filename):
    global excluded
    print(f"\n加载文件\n\t{abspath(filename)}")
    df = read_csv(filename)
    df.sort_values(by="总分", inplace=True, ascending=False)
    df = df.reset_index(drop=True)
    for aid in excluded:
        excluded = df.loc[df["aid"] == aid].index
        df = df.drop(excluded)
        df = df.sort_index().reset_index(drop=True)
    columns = df.columns.to_list()
    df.insert(columns.index("mid") + 1, "up主", [""] * len(df.index))
    df.insert(0, "排名", [i + 1 for i in range(len(df.index))])
    df.insert(0, "评语", [""] * len(df.index))

    for i in range(1000):
        df.loc[i, "转化率"] = f"{int(df.at[i, '转化率']*100)}%"
        df.loc[i, "总分"] = int(df.at[i, "总分"])
        df.at[i, "pubdate"] = to_datetime(
            df.loc[i, "pubdate"], format="%Y-%m-%d %H:%M:%S"
        ).strftime("%Y/%m/%d %H:%M")
    return df[0:1000]


def diffExcel(file1, file2):
    new = readExcel(file1)
    old = readExcel(file2)
    print(f"\n加载文件\n\t{abspath('周刊长期.xlsx')}")
    long = read_excel("周刊长期.xlsx")
    long_array = []
    for i in range(len(new.index)):
        # 本周出现的新稿件
        if old.loc[old["aid"] == new.at[i, "aid"]].empty:
            new.at[i, "评语"] = "New"
            continue
        lastrank = old.loc[old["aid"] == new.at[i, "aid"]]["排名"].array[0]
        # 上周排名在副榜外记作新上榜
        if lastrank > 125:
            new.at[i, "评语"] = "New"
            continue
        # 六周内
        # 连续进入主榜三次记作连续在榜
        # 本周必须严格进入主榜
        # 进入连续在榜后
        # 连续掉出主榜三次退出连续在榜
        if new.at[i, "排名"] <= 20 + len(long_array):
            long_status = [
                bool(not long.loc[long[WEEKS - 5] == new.at[i, "aid"]].empty),
                bool(not long.loc[long[WEEKS - 4] == new.at[i, "aid"]].empty),
                bool(not long.loc[long[WEEKS - 3] == new.at[i, "aid"]].empty),
                bool(not long.loc[long[WEEKS - 2] == new.at[i, "aid"]].empty),
                bool(not long.loc[long[WEEKS - 1] == new.at[i, "aid"]].empty),
                bool(new.at[i, "排名"] <= 20),
            ]
            if long_status[3:6] == [True] * 3:
                long_array.append(i)
            elif long_status[2:5] == [True] * 3:
                long_array.append(i)
            elif long_status[1:4] == [True] * 3:
                long_array.append(i)
            elif long_status[0:3] == [True] * 3 and long_status[3:6] != [False] * 3:
                long_array.append(i)
            else:
                pass
        new.at[i, "评语"] = f"上周{lastrank}"

    print("\n获取UP主昵称...")
    mids = set([int(new.at[x, "mid"]) for x in new[0:150].index])
    nametasks = [asyncio.ensure_future(getusername(x)) for x in mids]
    nameloop = asyncio.get_event_loop()
    usernames = nameloop.run_until_complete(asyncio.gather(*nametasks))
    usernames = reduce(lambda x, y: {**x, **y}, usernames)
    for x in new[0:150].index:
        new.at[x, "up主"] = usernames[new.at[x, "mid"]]

    onrank = new.loc[new["排名"] <= 20 + len(long_array)]["aid"].to_list()
    long[WEEKS] = Series(onrank)
    long.to_excel("周刊长期.xlsx", index=False)

    if len(long_array) > 0:
        long = new.iloc[long_array, :]
        onarray = long.loc[long["排名"] > 20 + len(long_array)].index
        long = long.drop(onarray)
        long.to_excel(f"{WEEKS:03d}期连续在榜.xlsx", index=False)
        new.drop(long_array, inplace=True)
    new = new.sort_index().reset_index(drop=True)

    print("\n获取视频封面...")
    covertasks = [
        asyncio.ensure_future(getcover(int(new.at[x, "aid"]))) for x in new[0:125].index
    ]
    coverloop = asyncio.get_event_loop()
    covers = coverloop.run_until_complete(asyncio.gather(*covertasks))
    covers = reduce(lambda x, y: {**x, **y}, covers)
    list(
        map(
            downcover,
            [int(new.at[x, "排名"]) for x in new[0:125].index],
            [int(new.at[x, "aid"]) for x in new[0:125].index],
            [covers[int(new.at[x, "aid"])] for x in new[0:125].index],
        )
    )

    new.loc[2.5] = new.columns.to_list()
    new.loc[9.5] = new.columns.to_list()
    new.loc[19.5] = new.columns.to_list()
    new = new.sort_index().reset_index(drop=True)
    new[0:128].to_excel(f"{WEEKS:03d}期主榜.xlsx", index=False)

    print(
        new.loc[
            :21,
            ["排名", "aid", "bvid", "up主", "title"],
        ]
    )


def main():
    global excluded
    print(f"\n加载文件\n\t{abspath('周刊除外.csv')}")
    excluded = [int(line.strip("\n")) for line in open("周刊除外.csv", "r")]
    THIS_WEEK = f"./统计数据/{LAST}_to_{THIS}.csv"
    LAST_WEEK = f"./统计数据/{BEFORE}_to_{LAST}.csv"
    diffExcel(THIS_WEEK, LAST_WEEK)
    input("\n执行完毕，可以退出\n")


if __name__ == "__main__":
    main()
