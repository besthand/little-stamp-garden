from PIL import Image,ImageDraw
import math,random
from pathlib import Path
out=Path(__file__).parent/'dist/assets'
S=3
# Everything is raster PNG, rendered large then downsampled.
def canvas(w=240,h=240):
 im=Image.new('RGBA',(w*S,h*S));return im,ImageDraw.Draw(im)
def ellipse(d,box,fill,outline=None,width=1):d.ellipse(tuple(int(x*S) for x in box),fill,outline,width*S)
def line(d,pts,fill,width=2):d.line([(int(x*S),int(y*S)) for x,y in pts],fill,width*S,joint='curve')
def poly(d,pts,fill):d.polygon([(int(x*S),int(y*S)) for x,y in pts],fill)
def save(im,name,size=None):im.resize(size or (im.width//S,im.height//S),Image.Resampling.LANCZOS).save(out/(name+'.png'))
def star(cx,cy,r,r2,n=5):return [(cx+(r if i%2==0 else r2)*math.cos(-math.pi/2+i*math.pi/n),cy+(r if i%2==0 else r2)*math.sin(-math.pi/2+i*math.pi/n)) for i in range(n*2)]
def face(d,x,y,space=17):
 ellipse(d,(x-space-3,y-3,x-space+3,y+3),'#685848');ellipse(d,(x+space-3,y-3,x+space+3,y+3),'#685848')
 d.arc(tuple(int(v*S) for v in (x-7,y+2,x+7,y+14)),0,180,fill='#685848',width=2*S)
 ellipse(d,(x-space-12,y+5,x-space+3,y+12),'#ecb6a5');ellipse(d,(x+space-3,y+5,x+space+12,y+12),'#ecb6a5')
colors={'star':'#e4af45','heart':'#d78388','clover':'#70967c','flower':'#a58bbd','bear':'#bc956f','smile':'#78a3b2'}
for kind,c in colors.items():
 im,d=canvas();ellipse(d,(12,12,228,228),c);ellipse(d,(18,18,222,222),'#fffcf3');ellipse(d,(25,25,215,215),None,c,2)
 for a in range(0,360,15):
  x,y=120+96*math.cos(a*math.pi/180),120+96*math.sin(a*math.pi/180);ellipse(d,(x-1,y-1,x+1,y+1),c)
 if kind=='star':poly(d,star(120,116,64,33),c);face(d,120,116,14)
 elif kind=='heart':
  ellipse(d,(61,67,127,132),c);ellipse(d,(112,67,178,132),c);poly(d,[(63,108),(176,108),(120,180)],c)
  face(d,120,113,14)
 elif kind=='clover':
  for x,y in [(95,90),(143,90),(95,138),(143,138)]:ellipse(d,(x-30,y-30,x+30,y+30),c)
  line(d,[(120,120),(131,177)],c,6);face(d,120,112,13)
 elif kind=='flower':
  for a in range(0,360,60):
   x,y=120+39*math.cos(a*math.pi/180),115+39*math.sin(a*math.pi/180);ellipse(d,(x-28,y-28,x+28,y+28),c)
  ellipse(d,(86,81,154,149),'#f2d485');face(d,120,110,12)
 elif kind=='bear':
  ellipse(d,(60,57,108,105),c);ellipse(d,(132,57,180,105),c);ellipse(d,(57,72,183,181),c);ellipse(d,(91,116,150,166),'#f7e9d1');face(d,120,115,21);ellipse(d,(115,134,125,141),'#685848')
 else:ellipse(d,(59,57,181,179),c);face(d,120,110,24)
 save(im,'stamp-'+kind)
for kind in ['bear','bunny','cat','fox']:
 im,d=canvas();ellipse(d,(9,9,231,231),{'bear':'#eee7d9','bunny':'#f7e7e2','cat':'#e6eaf2','fox':'#f5e6cf'}[kind])
 if kind=='bear':
  ellipse(d,(43,48,103,108),'#c39c79');ellipse(d,(137,48,197,108),'#c39c79');ellipse(d,(51,73,189,198),'#cba784');ellipse(d,(87,131,153,184),'#eee0c7')
 elif kind=='bunny':
  for x in [77,139]:ellipse(d,(x-17,26,x+25,134),'#fffaf0');ellipse(d,(x-7,39,x+15,111),'#e9b8b2')
  ellipse(d,(48,94,192,206),'#fffaf0')
 elif kind=='cat':
  poly(d,[(51,121),(49,53),(100,89),(143,86),(192,51),(187,134)],'#a8b4c6');ellipse(d,(49,89,191,207),'#a8b4c6');poly(d,[(60,94),(61,70),(80,90)],'#e9b8b2');poly(d,[(161,90),(180,68),(180,96)],'#e9b8b2')
 else:
  poly(d,[(47,126),(51,51),(99,91),(142,92),(187,50),(191,130),(120,205)],'#d4a16c');ellipse(d,(49,92,191,196),'#d4a16c');poly(d,[(55,129),(120,161),(185,128),(154,187),(120,202),(84,185)],'#fff3de')
 face(d,120,141,24);ellipse(d,(115,157,125,163),'#685848');save(im,'avatar-'+kind)
# Main illustration: a quiet little garden and friends, generous whitespace.
im,d=canvas(650,300)
ellipse(d,(85,235,610,285),'#e4e9dc')
# decorative floating sparkles
for x,y,r,c in [(58,84,10,'#d5c491'),(580,70,8,'#c5d3bd'),(310,40,8,'#d4c398'),(614,164,6,'#d4c398')]:poly(d,star(x,y,r,r/3,4),c)
# arch rainbow behind
for box,c in [((290,55,529,293),'#e7dfc9'),((306,71,513,293),'#f0e6cf'),((322,87,497,293),'#faf8ef')]:d.pieslice(tuple(int(x*S) for x in box),180,360,fill=c)
# plants
for x,y in [(96,212),(548,214),(514,244)]:
 line(d,[(x,y+40),(x,y-20)],'#8eaa86',3)
 for a,yy in [(-1,y),(1,y-16),(-1,y-24)]:ellipse(d,(x+(a<0)*-23,yy-10,x+(a>0)*23,yy+4),'#aabd9e')
# bear body
ellipse(d,(165,172,298,274),'#cba783');ellipse(d,(155,91,206,142),'#c5a17b');ellipse(d,(251,91,300,142),'#c5a17b');ellipse(d,(156,109,298,232),'#d2b18d');ellipse(d,(198,168,257,216),'#ead7b6');face(d,228,161,24);ellipse(d,(224,184,234,191),'#705d47')
# small gardening overalls
poly(d,[(184,220),(272,220),(277,271),(177,271)],'#8fa287');line(d,[(190,209),(198,236)],'#8fa287',9);line(d,[(265,209),(259,236)],'#8fa287',9)
ellipse(d,(172,252,220,278),'#b78f68');ellipse(d,(246,252,290,278),'#b78f68')
# bunny
ellipse(d,(357,163,465,273),'#fffaf0');ellipse(d,(357,46,394,164),'#fffaf0');ellipse(d,(414,38,450,159),'#fffaf0');ellipse(d,(367,61,385,137),'#e9c5ba');ellipse(d,(423,52,441,133),'#e9c5ba');ellipse(d,(340,118,469,232),'#fffaf0');face(d,405,170,21)
poly(d,[(362,222),(450,222),(461,269),(349,269)],'#d8b4a2');ellipse(d,(349,253,391,279),'#fffaf0');ellipse(d,(421,253,464,279),'#fffaf0')
# shared star between two friends
poly(d,star(323,224,45,24),'#edc96f');face(d,323,221,10)
# tiny flower
line(d,[(126,251),(126,214)],'#8eaa86',2)
for a in range(0,360,72):
 x=126+9*math.cos(a*math.pi/180);y=210+9*math.sin(a*math.pi/180);ellipse(d,(x-6,y-6,x+6,y+6),'#d7a09b')
ellipse(d,(122,206,130,214),'#eacb7a');save(im,'garden-friends')
# Reward illustrations
for kind in ['icecream','game','gift','book','park','movie']:
 im,d=canvas()
 if kind=='icecream':
  poly(d,[(81,117),(159,117),(120,211)],'#d7ad72')
  for y in [135,153,171]:line(d,[(93,y),(145,y)],'#c28e55',2)
  ellipse(d,(63,71,135,140),'#e7b6ae');ellipse(d,(105,51,178,124),'#f0dab0');ellipse(d,(76,47,145,119),'#d2dac1');ellipse(d,(80,92,160,139),'#e7b6ae');ellipse(d,(112,47,120,55),'#fff8e9')
 elif kind=='game':
  d.rounded_rectangle((42*S,78*S,198*S,172*S),30*S,fill='#cfbea8');ellipse(d,(39,113,93,186),'#cfbea8');ellipse(d,(147,113,201,186),'#cfbea8');line(d,[(70,111),(70,143)],'#796e61',10);line(d,[(54,127),(86,127)],'#796e61',10)
  ellipse(d,(145,107,161,123),'#8d9e80');ellipse(d,(166,129,182,145),'#d89f93')
 elif kind=='gift':
  d.rounded_rectangle((58*S,90*S,182*S,197*S),9*S,fill='#d6b4a4');d.rounded_rectangle((46*S,76*S,194*S,107*S),7*S,fill='#e6c6b4');d.rectangle((110*S,78*S,131*S,197*S),fill='#9daa87')
  d.arc((66*S,35*S,124*S,88*S),0,340,fill='#9daa87',width=9*S);d.arc((119*S,35*S,175*S,88*S),190,550,fill='#9daa87',width=9*S)
 elif kind=='book':
  poly(d,[(42,70),(115,86),(120,188),(49,171)],'#b2bda0');poly(d,[(198,70),(125,86),(120,188),(191,171)],'#d7dec7');line(d,[(120,90),(120,187)],'#8b9b79',4)
  for y in [104,125,146]:line(d,[(61,y),(99,y+7)],'#f9f8e8',3)
 elif kind=='park':
  line(d,[(120,99),(120,202)],'#bb9573',16);ellipse(d,(56,39,184,157),'#a5b99a');ellipse(d,(40,88,117,164),'#b3c5a5');ellipse(d,(133,84,208,163),'#b3c5a5');ellipse(d,(56,198,188,211),'#d4dec7')
 else:
  d.rounded_rectangle((37*S,58*S,203*S,176*S),12*S,fill='#9facc0');poly(d,[(102,88),(102,146),(150,117)],'#fff8e9');line(d,[(92,193),(149,193)],'#9facc0',9)
 save(im,'reward-'+kind)
print('Created',len(list(out.glob('*.png'))),'raster PNG illustrations')
