import json
import sys
TOP = '''Kanye West
Flying Lotus
Frank Ocean
Childish Gambino
Drake
Tyler, the Creator
The Roots
ScHoolboy Q
Danny Brown
Death Cab for Cutie
Isaiah Rashad
Travi$ Scott
Freddie Gibbs & Madlib
OutKast
Madvillain
A$AP Rocky
Black Milk
Bon Iver
J. Cole
Kendrick Lamar
Chance the Rapper
Radiohead
Joey Bada$$
of Montreal
Phantogram
Toro y Moi
Earl Sweatshirt
The Weeknd
Spoon
Captain Murphy
Arctic Monkeys
Ab-Soul
alt-J
Action Bronson & Party Supplies
Kid Cudi
Jai Paul
Gorillaz
Jay-Z
Belle and Sebastian
Lana Del Rey
Bloc Party
Portishead
Dawes
Vince Staples
Big K.R.I.T.
Father John Misty
sZa
Madlib
James Blake
Freddie Gibbs'''.split('\n')
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

def insignificant(count_list, name):
    return max(c['count'] for c in count_list) < 5 or name not in TOP

if __name__ == '__main__':
    with open(sys.argv[1], 'r') as f:
        weeks = json.loads(f.read())
    #artists = set([r['name'] for w in weeks for r in w['list']])
    chart_artists = [w['list'] for w in weeks if w['list'] != None]
    artists = list(set(a['name'] for w in chart_artists for a in w if type(a) == dict))
    res = [{'name': name, 'counts': artist_counts(weeks, name)} for name in artists]
    filtered = filter(lambda a: not insignificant(a['counts'], a['name']), res)
    print json.dumps(filtered)
