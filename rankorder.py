# -*- coding: utf-8 -*-

import arrow
import pandas as pd

PAST = arrow.get("2021-11-08 00:00:00", "YYYY-MM-DD HH:mm:ss")
NOW = arrow.now()
weeks = int((NOW.timestamp() - PAST.timestamp()) / 3600 / 24 / 7) + 1
weekday = int(NOW.format("d"))
# long_date = NOW.shift(days=-(weekday + 20)).format("YYYY-MM-DD")
last_date = NOW.shift(days=-(weekday + 13)).format("YYYY-MM-DD")
this_date = NOW.shift(days=-(weekday + 6)).format("YYYY-MM-DD")
end_date = NOW.shift(days=-(weekday - 1)).format("YYYY-MM-DD")


def readExcel(filename):
    print(filename)
    df = pd.read_csv(filename)
    df.sort_values(by="总分", inplace=True, ascending=False)
    df = df.reset_index(drop=True)
    df.insert(0, "排名", [i + 1 for i in range(len(df.index))])
    df.insert(0, "评语", ["" for i in range(len(df.index))])
    return df[0:1000]


def diffExcel(file1, file2):
    df1 = readExcel(file1)
    df2 = readExcel(file2)
    df3 = pd.read_excel("long.xlsx")
    long_array = []
    mainrank = []
    longrank = []
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
        # if (
        #     not df3.loc[df3[weeks - 1] == df1.at[i, "aid"]].empty
        #     and not df3.loc[df3[weeks - 2] == df1.at[i, "aid"]].empty
        # ):
        long_status = [
            bool(
                not df3.loc[df3[w + 1] == df1.at[i, "aid"]].empty
                and not df3.loc[df3[w + 2] == df1.at[i, "aid"]].empty
                and not df3.loc[df3[w + 3] == df1.at[i, "aid"]].empty
            )
            for w in range(weeks - 2)
        ]
        if True in long_status and lastrank <= 20 + len(long_array):
            long_array.append(i)
        # 副榜内三期连续在榜
        df1.at[i, "评语"] = f"上周{lastrank}"

    print(long_array)
    if len(long_array) > 0:
        long = df1.iloc[long_array, :]
        longrank = long.loc[long["排名"] <= 20 + len(long_array)]["aid"].to_list()
        onarray = long.loc[long["排名"] > 20 + len(long_array)].index
        long = long.drop(onarray)
        long.to_excel(f"{weeks:03d}期连续在榜.xlsx", index=False)
        df1.drop(long_array, inplace=True)
    df1 = df1.sort_index().reset_index(drop=True)

    print(df1[0:50])
    mainrank = df1.loc[df1.index < 20]["aid"].to_list()
    df3[weeks] = pd.Series(mainrank + longrank)
    df3.to_excel("long.xlsx", index=False)
    df1.loc[2.5] = df1.columns.to_list()
    df1.loc[9.5] = df1.columns.to_list()
    df1.loc[19.5] = df1.columns.to_list()
    df1 = df1.sort_index().reset_index(drop=True)
    # print(df1[0:23])

    df1[0:128].to_excel(f"{this_date}_to_{end_date}.xlsx", index=False)


def main():
    this_excel = f"{this_date}_to_{end_date}.csv"
    past_excel = f"{last_date}_to_{this_date}.csv"
    diffExcel(this_excel, past_excel)


if __name__ == "__main__":
    main()
