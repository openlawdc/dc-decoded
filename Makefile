json: xml
	mkdir -p json
	node parse.js

xml: html
	mkdir -p xml
	python xmlize.py

html: docs/dc_code_unofficial_2012-12-11
	mkdir -p html
	textutil -convert html docs/dc_code_unofficial_2012-12-11/*.doc
	mv docs/dc_code_unofficial_2012-12-11/*.html html

docs/dc_code_unofficial_2012-12-11: code.zip
	unzip code.zip -d docs

code.zip:
	wget http://dccouncil.us/files/user_uploads/event_testimony/dc_code_unofficial_2012-12-11.zip -O code.zip

docs:
	mkdir docs
