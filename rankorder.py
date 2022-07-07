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
weeks = int((NOW.timestamp() - PAST.timestamp()) / 3600 / 24 / 7) + 1
weekday = int(NOW.format("d"))
last_date = NOW.shift(days=-(weekday + 13)).format("YYYY-MM-DD")
this_date = NOW.shift(days=-(weekday + 6)).format("YYYY-MM-DD")
end_date = NOW.shift(days=-(weekday - 1)).format("YYYY-MM-DD")


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
    print(f"\n加载文件\n\t{abspath(filename)}")
    df = read_csv(filename)
    df.sort_values(by="总分", inplace=True, ascending=False)
    df = df.reset_index(drop=True)
    print(f"\n加载文件\n\t{abspath('周刊除外.csv')}")
    ex_aids = [int(line.strip("\n")) for line in open("周刊除外.csv", "r")]
    for aid in ex_aids:
        exclude = df.loc[df["aid"] == aid].index
        df = df.drop(exclude)
        df = df.sort_index().reset_index(drop=True)
    columns = df.columns.to_list()
    df.insert(columns.index("mid") + 1, "up主", [i + 1 for i in range(len(df.index))])
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
    df1 = readExcel(file1)
    df2 = readExcel(file2)
    print(f"\n加载文件\n\t{abspath('周刊长期.xlsx')}")
    df3 = read_excel("周刊长期.xlsx")
    long_array = []
    for i in range(len(df1.index)):
        # 新稿件
        if df2.loc[df2["aid"] == df1.at[i, "aid"]].empty:
            df1.at[i, "评语"] = "New"
            continue
        # 旧稿件
        lastrank = df2.loc[df2["aid"] == df1.at[i, "aid"]]["排名"].array[0]
        # 副榜外
        if lastrank > 125:
            df1.at[i, "评语"] = "New"
            continue
        # 主榜三期连续在榜
        if df1.at[i, "排名"] <= 20 + len(long_array):
            long_status = [
                bool(not df3.loc[df3[weeks - 5] == df1.at[i, "aid"]].empty),
                bool(not df3.loc[df3[weeks - 4] == df1.at[i, "aid"]].empty),
                bool(not df3.loc[df3[weeks - 3] == df1.at[i, "aid"]].empty),
                bool(not df3.loc[df3[weeks - 2] == df1.at[i, "aid"]].empty),
                bool(not df3.loc[df3[weeks - 1] == df1.at[i, "aid"]].empty),
                bool(df1.at[i, "排名"] <= 20),
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
        df1.at[i, "评语"] = f"上周{lastrank}"

    print("\n获取UP主昵称...")
    nametasks = [
        asyncio.ensure_future(getusername(int(df1.at[x, "mid"])))
        for x in df1[0:150].index
    ]
    nameloop = asyncio.get_event_loop()
    usernames = nameloop.run_until_complete(asyncio.gather(*nametasks))
    usernames = reduce(lambda x, y: {**x, **y}, usernames)
    for x in df1[0:150].index:
        df1.at[x, "up主"] = usernames[df1.at[x, "mid"]]

    onrank = df1.loc[df1["排名"] <= 20 + len(long_array)]["aid"].to_list()
    df3[weeks] = Series(onrank)
    df3.to_excel("周刊长期.xlsx", index=False)

    if len(long_array) > 0:
        long = df1.iloc[long_array, :]
        onarray = long.loc[long["排名"] > 20 + len(long_array)].index
        long = long.drop(onarray)
        long.to_excel(f"{weeks:03d}期连续在榜.xlsx", index=False)
        df1.drop(long_array, inplace=True)
    df1 = df1.sort_index().reset_index(drop=True)

    df1.loc[2.5] = df1.columns.to_list()
    df1.loc[9.5] = df1.columns.to_list()
    df1.loc[19.5] = df1.columns.to_list()
    df1 = df1.sort_index().reset_index(drop=True)

    print("\n获取视频封面...")
    covertasks = [
        asyncio.ensure_future(getcover(int(df1.at[x, "aid"])))
        for x in df1[0:128].index
        if df1.at[x, "aid"] != "aid"
    ]
    coverloop = asyncio.get_event_loop()
    covers = coverloop.run_until_complete(asyncio.gather(*covertasks))
    covers = reduce(lambda x, y: {**x, **y}, covers)
    list(
        map(
            downcover,
            [int(df1.at[x, "排名"]) for x in df1[0:128].index if df1.at[x, "排名"] != "排名"],
            [
                int(df1.at[x, "aid"])
                for x in df1[0:128].index
                if df1.at[x, "aid"] != "aid"
            ],
            [
                covers[int(df1.at[x, "aid"])]
                for x in df1[0:128].index
                if df1.at[x, "aid"] != "aid"
            ],
        )
    )

    df1[0:128].to_excel(f"{weeks:03d}期主榜.xlsx", index=False)
    print(
        df1.loc[
            :21,
            ["排名", "aid", "bvid", "up主", "title"],
        ]
    )


def main():
    this_excel = f"./统计数据/{this_date}_to_{end_date}.csv"
    past_excel = f"./统计数据/{last_date}_to_{this_date}.csv"
    diffExcel(this_excel, past_excel)
    input("\n执行完毕，可以退出\n")


if __name__ == "__main__":
    main()
