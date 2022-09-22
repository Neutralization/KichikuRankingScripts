# -*- coding: utf-8 -*-

import http.cookiejar
import json

import requests
import time
import arrow

PAST = arrow.get("2021-11-08 00:00:00", "YYYY-MM-DD HH:mm:ss")
NOW = arrow.now()
WEEKS = int((NOW.timestamp() - PAST.timestamp()) / 3600 / 24 / 7) + 1
session = requests.session()
jar = http.cookiejar.MozillaCookieJar("./cookies.txt")
jar.load(ignore_discard=True, ignore_expires=True)
session.cookies = jar

headers = {
    "authority": "api.bilibili.com",
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "dnt": "1",
    "origin": "https://www.bilibili.com",
    "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
}


def post_reply(oid, message, root, parent):
    data = {
        "csrf": session.cookies._cookies[".bilibili.com"]["/"]["bili_jct"].value,
        "message": message,
        "oid": oid,
        "parent": parent,
        "plat": "1",
        "root": root,
        "type": "1",
    }

    response = session.post(
        "https://api.bilibili.com/x/v2/reply/add",
        headers=headers,
        data=data,
    )

    result = json.loads(response.content)
    print(
        message,
        result.get("code"),
        result.get("data").get("rpid"),
        result.get("data").get("success_toast"),
    )
    return result.get("data").get("rpid")


params = (
    ("mid", "14498772"),
    ("ps", "30"),
    ("tid", "0"),
    ("pn", "1"),
    ("keyword", WEEKS),
    ("order", "pubdate"),
    ("jsonp", "jsonp"),
)
response = session.get("https://api.bilibili.com/x/space/arc/search", params=params)
result = json.loads(response.content)
bvid = result["data"]["list"]["vlist"][0]["bvid"]
print(bvid)

params = (("bvid", bvid),)
response = session.get("https://api.bilibili.com/x/web-interface/view", params=params)
result = json.loads(response.content)
aid = result["data"]["aid"]
print(aid)

stack = ""
replys = []
for line in open(f"{WEEKS:03d}期节目单.csv", "r", encoding="utf-8-sig"):
    k, v = line.strip("\n").split(",")
    if len(v) == 0:
        stack = k
    else:
        newline = f"{stack}\t{k}\t{v}" if len(k) > 0 else f"{stack}\t{v}"
        replys.append(newline)
# print(replys)

root = parent = post_reply(aid, f"{WEEKS:03d}期节目单", 0, 0)
time.sleep(10)
for reply in replys:
    post_reply(aid, reply, root, parent)
    time.sleep(10)
input("\n\t现在可以退出...")
