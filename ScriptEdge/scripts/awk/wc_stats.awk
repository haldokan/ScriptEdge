#!/usr/bin/awk -f
# call this script as wc -c *.*|wc_stats.awk
BEGIN {
# How many files
    files=0;
    total=0;
}
{
# this code is executed once for each input file
# increase the number of files
    files++;
# increase the total size, which is field #1
    total+=$1;
}
END {
# end, now output the total
    print files " files read";
    print "total is ", total;
    if (files > 0 ) {
	   print "average is ", total/files;
    } else {
	   print "average is 0";
    }
}