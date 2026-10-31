# compose.py <oldDir> <newDir> <outDir>: before/after pairs into v081-fix-*.png (labels top-left)
import sys,os
from PIL import Image,ImageDraw
old,new,out=sys.argv[1:4]; os.makedirs(out,exist_ok=True)
def pair(names,fn,sc=0.5,lab=('v0.8.0','v0.8.1')):
    ims=[]
    for d,l in zip((old,new),lab):
        row=[Image.open(f'{d}/{n}.png').convert('RGB') for n in names]
        row=[r.resize((int(r.width*sc),int(r.height*sc))) for r in row]
        W=sum(r.width for r in row); H=max(r.height for r in row); im=Image.new('RGB',(W,H+22),(255,255,255)); x=0
        for r in row: im.paste(r,(x,22)); x+=r.width
        ImageDraw.Draw(im).text((6,4),l+' '+', '.join(names),fill=(0,0,0)); ims.append(im)
    s=Image.new('RGB',(ims[0].width+ims[1].width+8,max(i.height for i in ims)),(120,120,120)); s.paste(ims[0],(0,0)); s.paste(ims[1],(ims[0].width+8,0)); s.save(f'{out}/{fn}.png')
def single(names,fn,sc=0.5):
    row=[Image.open(f'{new}/{n}.png').convert('RGB') for n in names]; row=[r.resize((int(r.width*sc),int(r.height*sc))) for r in row]
    im=Image.new('RGB',(sum(r.width for r in row),max(r.height for r in row))); x=0
    for r in row: im.paste(r,(x,0)); x+=r.width
    im.save(f'{out}/{fn}.png')
def art(k,fn,a='/tmp/art-old',b='/tmp/art-new'):
    A=Image.open(f'{a}/{k}.png').convert('RGB'); B=Image.open(f'{b}/{k}.png').convert('RGB')
    s=Image.new('RGB',(A.width,A.height*2+6),(90,90,90)); s.paste(A,(0,0)); s.paste(B,(0,A.height+6)); s.save(f'{out}/{fn}.png')
pair(['prep','cards'],'v081-fix-F1')
pair(['calendar'],'v081-fix-F2')
single(['result-loss-t08','result-loss-t12','result-loss-t18'],'v081-fix-F3')
single(['result3-t34','result2-t12','result1-t12'],'v081-fix-F4')
pair(['result3-t12'],'v081-fix-F5')
pair(['prep','battle-tray','result2-t26'],'v081-fix-F7',0.45)
single(['shop-hit','tower-info-hit'],'v081-fix-F8')
single(['settings'],'v081-J12-settings')
art('F6','v081-fix-F6'); art('F9','v081-fix-F9'); art('P3','v081-fix-P3')
