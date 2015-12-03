#!/usr/bin/env bash

file="$1"

awk '

BEGIN {
    # init arrays since they are used in "for" loops
    ip_req_count[""] = 0;
    ip_response_size[""] = 0;
}

{
    #--- Field names ---#
    ip = $1;
    uid = $2;
    response_size = $NF;

    #--- Req counts ---#

    # req count 4 all ips
    ip_req_count["* *"]++;
    # req count per ip
    ip_req_count[ip " *"]++;
    # req count per user
    ip_req_count["* " uid]++;
    # req count per ip/user combination
    ip_req_count[ip " " uid]++;

    #--- Response sizes ---#

    ip_response_size["* *"] += response_size;
    ip_response_size[ip " *"] += response_size;
    ip_response_size["* " uid] += response_size;
    ip_response_size[ip " " uid] += response_size;
}

END {
    for (i in ip_req_count) {
        if (i != "") {
            print i, ip_req_count[i], ip_response_size[i]
        }
    }
}

' "$file" | \
sort -k 4,4rn -k 3,3rn -k 1,2d | \
(echo "ip user req_count res_size"; cat -)

