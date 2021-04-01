#!/bin/bash
FNAME="rms-open-letter-sigs.user.js"
cat header.txt > $FNAME
cat hardcodedRequests.js >> $FNAME
cat parser.js >> $FNAME
cat data.js >> $FNAME
cat main.js >> $FNAME
