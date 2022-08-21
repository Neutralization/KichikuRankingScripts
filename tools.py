import requests
import json

def get_reso(aid):
    try:
        resp = requests.get(
            'http://api.bilibili.com/x/web-interface/view?aid=%d' % aid)
        info = json.loads(resp.text)['data']
        reso = info['dimension']['width']/info['dimension']['height']
        return round(reso,3)
    except:
        return None
