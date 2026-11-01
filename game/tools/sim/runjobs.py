import subprocess,json,sys,os
from concurrent.futures import ThreadPoolExecutor
jobs=json.load(open(sys.argv[1])); P=int(sys.argv[2]) if len(sys.argv)>2 else 7
def run(j):
    env=dict(os.environ); env.update({'ANTOVR':json.dumps(j.get('antovr',{})) if j.get('antovr') else '','ABIL':j.get('abil',''),'AP':json.dumps(j.get('ap',{})),'MODE':'bot','TR':str(j['tr']),'SPT':str(j['spt']),'LEVELS':f"{j['L']}-{j['L']}"})
    if 'ovr' in j: env['OVR']=j['ovr']
    if not j.get('antovr'): env.pop('ANTOVR',None)
    r=subprocess.run(['node',j.get('mx','modexp.mjs'),j['dir'],j['prof'],j['out']],env=env,capture_output=True,text=True)
    if r.returncode: print('FAIL',j['out'],r.stderr[:300])
with ThreadPoolExecutor(P) as ex: list(ex.map(run,jobs))
print('done',len(jobs))
