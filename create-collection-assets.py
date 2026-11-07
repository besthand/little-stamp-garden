from pathlib import Path
from PIL import Image,ImageDraw
import random,math
out=Path(__file__).parent/'dist/assets';random.seed(20261107)
# Original raster paper and stickers, generated without SVG or external assets.
im=Image.new('RGBA',(960,640));d=ImageDraw.Draw(im)
d.rounded_rectangle((0,0,959,639),radius=34,fill='#fffdf3',outline='#e5d8b5',width=3)
d.rounded_rectangle((13,13,946,626),radius=27,outline='#f0e8d4',width=2)
for _ in range(16000):
 x=random.randrange(18,942);y=random.randrange(18,622)
 d.point((x,y),fill=random.choice(['#f5f0df','#faf5e7','#f8f2e2']))
for x,y in [(36,36),(924,36),(36,604),(924,604)]:
 d.ellipse((x-4,y-4,x+4,y+4),fill='#ddd0ad')
im.save(out/'card-paper.png')
for name in ['complete','growing']:
 im=Image.new('RGBA',(360,360));d=ImageDraw.Draw(im)
 if name=='complete':
  d.polygon([(94,215),(63,329),(121,305),(153,345),(186,229)],fill='#c3ac70')
  d.polygon([(174,227),(207,345),(239,305),(297,329),(266,214)],fill='#d3bd85')
  for i in range(24):
   a=i*math.pi/12;x=180+121*math.cos(a);y=151+121*math.sin(a)
   d.ellipse((x-23,y-23,x+23,y+23),fill='#d9bf79')
  d.ellipse((64,35,296,267),fill='#edda9b',outline='#bda05b',width=4)
  d.ellipse((80,51,280,251),outline='#fff3c6',width=5)
  points=[(180+(81 if i%2==0 else 40)*math.cos(-math.pi/2+i*math.pi/5),150+(81 if i%2==0 else 40)*math.sin(-math.pi/2+i*math.pi/5)) for i in range(10)]
  d.polygon(points,fill='#fff5d6')
  d.line([(137,150),(168,181),(220,123)],fill='#8c9a65',width=14,joint='curve')
 else:
  d.ellipse((35,31,325,321),fill='#edf1df',outline='#c0cda3',width=6)
  d.ellipse((57,53,303,299),outline='#fffef4',width=5)
  d.ellipse((97,237,265,264),fill='#d3c5a0')
  d.line([(181,244),(181,140)],fill='#90a275',width=12)
  d.ellipse((99,106,182,175),fill='#abc08b');d.ellipse((179,81,268,160),fill='#94ac76')
  d.line([(178,170),(130,133)],fill='#e0e7c9',width=4);d.line([(186,149),(239,110)],fill='#d7e2be',width=4)
  d.ellipse((150,201,158,209),fill='#778462');d.ellipse((210,201,218,209),fill='#778462')
  d.arc((169,202,200,226),0,180,fill='#778462',width=4)
 im.resize((180,180),Image.Resampling.LANCZOS).save(out/('card-badge-'+name+'.png'))
print('Created 3 collection PNG assets')
