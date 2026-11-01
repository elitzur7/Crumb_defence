import subprocess,os,json
from concurrent.futures import ThreadPoolExecutor
AP={"ricAny":1,"ricMul":0.5,"burnBoss":0,"pounce":2.0,"cres":1.3}
def run(L):
    env=dict(os.environ); env.update({'ABIL':'ric,burn,pounce,cres,static','AP':json.dumps(AP)})
    return subprocess.run(['node','coins.mjs','g6','prof-w6.json',str(L),str(L),'15','36'],env=env,capture_output=True,text=True).stdout.strip()
with ThreadPoolExecutor(7) as ex:
    for o in ex.map(run,range(51,61)): print(o)
