import json,sys,math,glob
# usage: secant.py newtag tag1 hp1 tag2 hp2 ...   (fits logit(p) = a - K ln hp per level from all given rounds; K clipped to [12,40])
tgt={51:98,52:96,53:91,54:88,55:82,56:93,57:82,58:80,59:78,60:60}
args=sys.argv[2:]; rounds=[(args[i],json.load(open(args[i+1]))) for i in range(0,len(args),2)]
lg=lambda p: math.log(p/(1-p)); new={}
for L in range(51,61):
    pts=[]
    for tag,hp in rounds:
        r=json.load(open(f'out/w6-{tag}-{L}.json')); p=sum(x['win'] for x in r)/len(r); p=min(max(p,0.012),0.988); pts.append((math.log(hp[str(L)]),lg(p)))
    # use the two points closest to target logit
    t=lg(tgt[L]/100); pts.sort(key=lambda q:abs(q[1]-t)); a,b=pts[0],pts[1] if len(pts)>1 else pts[0]
    K=(b[1]-a[1])/(a[0]-b[0]) if abs(a[0]-b[0])>1e-6 else 20; K=min(max(K,12),40)
    lh=a[0]+(a[1]-t)/K; new[str(L)]=round(math.exp(lh),2); print(L,'K=%.1f'%K,'->',new[str(L)])
json.dump(new,open(f'hp-{sys.argv[1]}.json','w'))
