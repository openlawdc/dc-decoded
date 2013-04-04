import glob
from xml.dom.minidom import parse

for f in glob.glob('html/*.xml'):
    dom = parse(f)
    for p in dom.getElementsByTagName('p'):
        print p
