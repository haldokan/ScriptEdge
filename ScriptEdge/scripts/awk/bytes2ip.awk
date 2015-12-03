#!/usr/bin/awk -f

# recommended to init arrays in awk
BEGIN {
   bytes_by_ip[""] = 0
}

{ bytes_by_ip[$1] += $NF }

END {
   for (i in bytes_by_ip) {
      if (i != "") { print i, bytes_by_ip[i] }
   }
}