# -*- coding: utf-8 -*-

import os

import arrow
import pandas as pd

PAST = arrow.get("2021-11-08 00:00:00", "YYYY-MM-DD HH:mm:ss")
NOW = arrow.now()
weeks = int((NOW.timestamp() - PAST.timestamp()) / 3600 / 24 / 7) + 1
# weeks = 32


def find(week, name):
    for files in os.listdir("."):
        if files.endswith(".xlsx") and week in files and name in files:
            print(f"\t找到{week}期{name}Excel 文件")
            return files
    print(f"\t未找到{week}期{name}Excel 文件")
    return None


def an2cn(num):
    a2c = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
    if num // 10 < 1:
        return a2c[num % 10]
    if num // 10 == 1:
        return "十" + a2c[num % 10] if num % 10 != 0 else "十"
    else:
        return (
            a2c[num // 10] + "十" + a2c[num % 10]
            if num % 10 != 0
            else a2c[num // 10] + "十"
        )


def readexcel(filename, index):
    df = pd.read_excel(filename)
    if index == 0:
        main = df.loc[df.index < 22, ["排名", "aid"]].iloc[::-1].values.tolist()
        main = [[x[0], f"av{x[-1]}"] for x in main]
        # main[-12] = [f"主榜{main[-11][0]}-{main[-5][0]}", ""]
        # main[-4] = [f"主榜{main[-3][0]}-{main[-1][0]}", ""]
        # main = [[f"主榜{main[-0][0]}-{main[-13][0]}", ""]] + main
        main = [["主榜", ""]] + main
        del main[-12]
        del main[-4]
        return main
    if index == 1:
        continuity = df[["排名", "aid"]].iloc[::-1].values.tolist()
        continuity = [[x[0], f"av{x[-1]}"] for x in continuity]
        continuity = [["连续在榜", ""]] + continuity
        return continuity
    if index == 2:
        old = df[["AV号"]].values.tolist()
        old = [[len(old) - n, x[0].lower()] for n, x in enumerate(old)]
        old = [["旧稿回顾", ""]] + old
        return old
    if index == 3:
        suggest = df[["AV号"]].head(10).values.tolist()
        suggest = [[len(suggest) - n, x[0].lower()] for n, x in enumerate(suggest)]
        suggest = [["榜外推荐", ""]] + suggest
        return suggest
    if index == 4:
        classic = df[["AV号"]].tail(1).values.tolist()
        classic = [[len(classic) - n, x[0].lower()] for n, x in enumerate(classic)]
        classic = [["经典推荐", ""]] + classic
        return classic
    if index == 5:
        newbie = df[["AV号"]].values.tolist()
        newbie = [[len(newbie) - n, x[0].lower()] for n, x in enumerate(newbie)]
        newbie = [["经典推荐", ""]] + newbie
        return newbie


def main():
    print("\n")
    excellist = [
        find(f"{weeks:03d}", "主榜"),
        find(f"{weeks:03d}", "连续在榜"),
        find(f"{an2cn(weeks)}", "旧稿回顾"),
        find(f"{an2cn(weeks)}", "冷门推荐"),
        find(f"{an2cn(weeks)}", "经典回顾"),
        find(f"{an2cn(weeks)}", "新人自荐"),
    ]

    ranklist = (
        [[f"{weeks:03d}期节目单", ""]]
        + readexcel(excellist[4], 4)  # 经典推荐
        + (readexcel(excellist[1], 1) if excellist[1] is not None else [])  # 连续在榜
        + (readexcel(excellist[5], 5) if excellist[5] is not None else [])  # 新人自荐
        + readexcel(excellist[3], 3)  # 榜外推荐
        + readexcel(excellist[2], 2)  # 旧稿回顾
        # + [["ED", ""], ["", "av"]]
        + readexcel(excellist[0], 0)  # 主榜
    )
    df = pd.DataFrame(ranklist)
    df.to_csv(f"{weeks:03d}期节目单.csv", index=False, header=False, encoding="utf-8-sig")
    input("\n\t现在可以退出...")


if __name__ == "__main__":
    main()
