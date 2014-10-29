import json
import sys

def artist_counts(weeks, artist):
    res = []
    for week in weeks:
        if week['list'] != None:
            week_names = [a['name'] for a in week['list'] if type(a) == dict]
            if artist in week_names:
                info = week['list'][week_names.index(artist)]
                res.append({'count': int(info['playcount']), 'time': week['time']})
            else:
                res.append({'count': 0, 'time': week['time']})
    return res

def insignificant(count_list):
    return max(c['count'] for c in count_list) < 5

if __name__ == '__main__':
    with open(sys.argv[1], 'r') as f:
        weeks = json.loads(f.read())
    #artists = set([r['name'] for w in weeks for r in w['list']])
    chart_artists = [w['list'] for w in weeks if w['list'] != None]
    artists = list(set(a['name'] for w in chart_artists for a in w if type(a) == dict))
    res = [{'name': name, 'counts': artist_counts(weeks, name)} for name in artists]
    filtered = filter(lambda a: not insignificant(a['counts']), res)
    print json.dumps(filtered)
