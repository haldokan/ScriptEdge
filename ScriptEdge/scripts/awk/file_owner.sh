#!/usr/bin/env bash

awk '
    BEGIN { print "-- File Owner --" }
    { print $9, "\t", $3 }
    END { print "-- DONE --" }
'