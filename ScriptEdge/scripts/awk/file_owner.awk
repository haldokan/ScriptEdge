#!/usr/bin/awk -f

BEGIN { print "-- File Owner --" }
{ print $3 }
END { print "-- DONE --" }
