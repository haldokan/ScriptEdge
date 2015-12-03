#!/usr/bin/awk -f

# find out number of files owned by each user in arr.txt.
# call this exec awk script as cat arr.txt|asso_arr1.awk

BEGIN { uname[""] = 0 }

{ uname[$3]++ }

END {
   for (i in uname) {
      if (i != "") {
         print i, uname[i]
      }
   }
}
