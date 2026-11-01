import json,sys,subprocess
# usage: w6round.py <tag> <hp json file: {"51":hp,...}> [armor override for drone]
tag=sys.argv[1]; hp=json.load(open(sys.argv[2])); P=7
AP={"ricAny":1,"ricMul":0.5,"burnBoss":0,"pounce":2.0,"cres":1.3}
J=[]
for L,h in hp.items():
    fn=f'ovr-w6-{tag}-{L}.json'; json.dump({L:{'hpMul':h}},open(fn,'w'))
    J.append(dict(dir='g6',prof='prof-w6.json',tr=36,spt=15,L=int(L),abil='ric,burn,pounce,cres,static',ap=AP,ovr=fn,out=f'out/w6-{tag}-{L}.json'))
json.dump(J,open(f'jobs-w6-{tag}.json','w'))
