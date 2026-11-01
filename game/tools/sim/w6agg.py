import json,sys,glob,math
tag=sys.argv[1]
tgt={51:98,52:96,53:91,54:88,55:82,56:93,57:82,58:80,59:78,60:60}
hp=json.load(open(sys.argv[2])) if len(sys.argv)>2 else {}
for L in range(51,61):
    try: r=json.load(open(f'out/w6-{tag}-{L}.json'))
    except Exception: continue
    n=len(r); w=sum(x['win'] for x in r); p=100*w/n; se=100*math.sqrt(p/100*(1-p/100)/n)
    st=sum(x['stars'] for x in r if x['win'])/max(1,w)
    print(L,'hp',hp.get(str(L)),'win %.1f ± %.1f'%(p,se),'target',tgt[L],'★/win %.2f'%st,'time %d'%(sum(x['time'] for x in r)/n))
