import requests
import json
import time

API_KEY = ''
SERVER = 'http://ws.audioscrobbler.com/2.0/'
USER = 'galeonnoelag'

def get_valid_times():
    req = requests.get(
        '%s?method=user.getweeklychartlist&user=%s&api_key=%s&format=json' % (
            SERVER, USER, API_KEY))
    valid_times_json = json.loads(req.text)
    return valid_times_json['weeklychartlist']['chart']


def get_weekly_chart(start, end):
    req = requests.get(
        '%s?method=user.getweeklyartistchart&user=%s&api_key=%s&format=json&from=%s&to=%s' % (
            SERVER, USER, API_KEY, start, end))
    try:
        return json.loads(req.text)['weeklyartistchart']['artist']
    except KeyError:
        print req.text


def chunks(a_list, n):
    for i in xrange(0, len(a_list), n):
        yield a_list[i:i+n]


def rate_limit(func, args, burst_num, sleep_time):
    for arg_group in chunks(args, burst_num):
        for a in arg_group:
            if type(a) != tuple:
                yield func((a))
            else:
                yield func(*a)
        time.sleep(sleep_time)


if __name__ == '__main__':
    valid_times = get_valid_times()
    args = [(v['from'], v['to']) for v in valid_times]
    charts = list(rate_limit(get_weekly_chart, args, 5, 1))
    print json.dumps([{'time': t, 'list': c} for t, c in zip(args, charts)])
