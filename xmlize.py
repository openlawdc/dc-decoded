import glob, re

# Clean up HTML so that it's proper XML
for f in glob.glob('html/*.html'):
    contents = open(f).read()
    print "xml safe: %s" % f
    open(f.replace('html', 'xml'), 'w').write(re.sub(r'<meta[^>]*>', '', contents.replace('<br>', '<br />')))
