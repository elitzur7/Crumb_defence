import json,copy,sys
p='g6/tuning/tuning.json'; t=json.load(open(p))
t['ants']['drone']={"hp":30,"speed":54,"armor":2,"steal":1.1,"weight":1.0,"size":"regular","crumbs":4,"rarity":"rare","flying":True}
t['ants']['queen6']={"hp":3000,"speed":15,"armor":6,"weight":0,"size":"queen","crumbs":220,"rarity":"boss","slowResist":0.6,"boss":True,"spawn":{"type":"drone","every":12,"count":1},"queenTraits":["slow"]}
t['worlds'].append({"id":6,"name":"Pancake Picnic","treat":"pancake","queen":"queen6","levels":10,"unlock":{"allLevelsWonInWorld":5,"minStarsInWorld":14},"cardLevelCap":6,"coinMul":2.0})
# slot -> (source level index in W5, substitutions {from:to}, name, hp)
S=[(40,{},'Pancake Plate',4.2,'w5_counter'),
   (41,{'glazed':'drone'},'Syrup Pitcher',4.5,'w5_stool'),
   (42,{'glazed':'drone','flyer':'flyer'},'Butter Dish',8.0,'w5_jelly'),
   (43,{'glazed':'drone'},'Fork Fence',7.0,'w5_cruller'),
   (44,{'greasy':'drone'},'Stack Alley',5.0,'w5_glaze'),
   (45,{'glazed':'drone'},'Berry Basket',8.0,'w5_coffee'),
   (46,{'flyer':'drone'},'Whipped Cream Hill',6.0,'w5_maple'),
   (47,{'flyer':'drone','glazed':'nurse'},'Waffle Iron',6.0,'w5_boston'),
   (48,{'sprinter':'drone'},'Picnic Blanket',5.0,'w5_dozen'),
   (49,{'flyer':'drone'},'Syrup Falls',0.8,'w5_diner')]
for k,(src,sub,name,hp,mp) in enumerate(S):
    L=copy.deepcopy(t['levels'][src]); L['world']=6; L['name']=name; L['hpMul']=hp; L['map']=mp
    for w in L['waves']:
        for g in w:
            if g['type'] in sub: g['type']=sub[g['type']]
    if k==9:
        for w in L['waves']:
            for g in w:
                if g['type']=='queen5': g['type']='queen6'
    t['levels'].append(L)
# types per level check
for i in range(50,60):
    L=t['levels'][i]; print(i+1,L['name'],sorted({g['type'] for w in L['waves'] for g in w}))
json.dump(t,open(p,'w'))
