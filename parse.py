# -*- coding: utf-8 -*-
import glob, re
from xml.dom.minidom import parse

def getText(nodelist):
    rc = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc.append(node.data)
    return ''.join(rc)

# heading = re.compile(r'§ (\d+)\-(\d+)\.', re.U)
heading = re.compile(r'§', re.U)

for f in glob.glob('xml/*.xml'):
    print f
    dom = parse(f)
    for p in dom.getElementsByTagName('p'):
        t = getText(p.childNodes);
        m = heading.match(t)
        if m:
            print m
    print "Done with %s" % f
