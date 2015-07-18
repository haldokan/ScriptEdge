#!/bin/bash
#set -x
#       ___
#   oo  // \\
#  (_,\/ \_/ \
#    \ \_/_\_/>
#    /_/   \_\
#
# haldokan
#
# The turtle has no bearing on the
# script functioning. However removing the turtle may bring bad luck!
#
# This script is a build and deployment engine.
# It is designed in such a way that it can be deployed on a build and
# deployment server. Applications wishing to use the engine can provide
# their own profile similar to what sample_app did in ./profile/sample_app.p.
#
# This script should never be called directly. Rather is should be called
# from app-specific scripts with provided profiles. An example is the
# ./sample_app.sh with ./profile/sample_app.p. Notice that the name of the
# app-specific script and profile name should match and the profile file
# name extension should be 'p'.
#
# Deploying a webapp to a server may need custom steps: Tomcat, for instance,
# does not deploy the app if it was not running. This custom steps are carried
# out by a script named [module_name]-custdep.sh located where the war file is
# dropped on the server.
#|||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||F U N C S|||||||||||||||||||||||
#|||||||||||||||||||||||||||||||||||||||||||||||||||||||

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||
#FUNC show script usage

function usage() {
   echo -e "   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\
   XXXXXXXXXXXXXXXXXXXXXXXXX U S A G A XXXXXXXXXXXXXXXXXXXXXXX\n\
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\
   >print to stdout script usage\n\
   $script_file_name
   >package project head\n\
   $script_file_name pkg project\n\
   >package project tag\n\
   $script_file_name pkgt project tag_name\n\
   >deploy project head or tag to environment\n\
   $script_file_name dep project env (prd or dev) [tag_name]\n\
   >rollback project to previous deployment\n\
   $script_file_name rollb project env (prd or dev) [bkup_pkg_name]\n\
   >list svn projects matching search string\n\
   $script_file_name listp proj_name_srch_str\n\
   >list project tags\n\
   $script_file_name listt project\n\
   >tag project in svn\n\
   $script_file_name tag project tag_name [tag_msg]\n\
   >delete project tag from svn\n\
   $script_file_name delt project tag_name [tag_msg]\n\
   >unix-diff 2 src directories of project deployed tags\n\
   $script_file_name diff project tag1(or head) tag2(or head) [dir or file]\n\
   >quiet unix-diff 2 src directories of project deployed tags\n\
   $script_file_name diffq project tag1(or head) tag2(or head) [dir or file]\n\
   >commit deployment scripts\n\
   $script_file_name cdep dep_name env [commit_msg]\n\
   >commit project scripts\n\
   $script_file_name cps project env [commit_msg]\n\
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n"
}

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||
#FUNC called b4 dep to prd to make sure user is awake
function are_you_awake() {
   local dep_env=$1
   if [[ $dep_env == prd ]];
   then
      num1=`expr $(($RANDOM % 30)) + 7`
      num2=`expr $(($RANDOM % 20)) + 3`
      sum=`expr $num1+$num2`

      echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      echo "Your are about to alter apps in PRODUCTION."
      echo "Prove you are awake by providing the sum of $num1 + $num2"
      read entry

     entry_check=$(echo "$entry" | tr -d 0-9)
     if [[ -n "$entry_check" ]];
     then
  echo "Wrong. Exiting."
         exit 1
     fi

      if [[ "$entry" -ne $sum ]];
      then
  echo "Wrong. Exiting."
  exit 1
      else
  echo "smart!"
      fi
      echo -e "\nType the project name again:"
      read entry
      if [[ ! "$entry" == "$project" ]];
      then
         echo "Wrong. Exiting."
         exit 1
      fi
   fi
}

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||
#FUNC setup dirs and files for dep and rollback
#it calls the overwritten funcs in the team specific profile

function setup_dep() {
   project_p=$1
   env_p=$2
   #dep name can be a tag to dep, or a pkg or war name to rollback
   tag_p=$3
   if [ -z $project_p ] || [ -z $env_p ] || [ -z $tag_p ];then
      usage
      exit 1
   fi

   #if build dir has a war file then it is a web dep
   pkg_file_ptrn="$checkout_dir/$tag_p/target/*.$webapp_file_ext"
   pkg_count=`ls $( echo $pkg_file_ptrn ) 2>/dev/null|wc -l` 
   if [[ $pkg_count -eq 1 ]];
   then
      webapp=1
      pkg_file_ext=$webapp_file_ext
      dep_pkg_type=webapp
   else
      webapp=0
      pkg_file_ext=$pkg_app_file_ext
      dep_pkg_type="standalone-app"
   fi

   if [[ $env_p == dev ]];
   then
      machines=$dev_machines
      service_acct=$service_acct_dev
   elif [[ $env_p == qa ]];
   then
      machines=$qa_machines
      service_acct=$service_acct_qa
   elif [[ $env_p == prd ]];
   then
      machines=$prd_machines
      service_acct=$service_acct_prd
   else
      usage
      exit 1
   fi

   #if machines share NAS dep dir no need to deploy on all of them
   dep_dir_shared_by_machines $env_p $webapp
   shared_dep_dir=$?
   if [[ shared_dep_dir -eq 1 ]];
   then
      machines_tmp=($machines) 
      machines=${machines_tmp[0]}
   fi

   #dir where the new dep go
   dep_dir=$(get_app_dep_dir $service_acct $module_name $webapp)

   #dir where old dep is archived
   dep_archive="../$service_acct/apps/dep_archive"
}

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||S C R I P T|||||||||||||||||||||
#|||||||||||||||||||||||||||||||||||||||||||||||||||||||

#source the team specific profile file
. ./profile/"$script_file_name".p

if [[ $# -lt 2 ]];
then
   usage
   exit 1
fi
username=`logname`
action=$1
project=$2
module_name=$(get_dep_module_name $project)
checkout_dir=~/deploy/projects/$username/$project

head_tag="head"
today=`date +%Y%m%d`
timestamp="`date +%Y%m%d_%H%M%S`"

#||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||P K G  H E A D|||||||||||||||||||||||

if [[ $action == pkg ]];
then
   if [[ -n $3 ]];
   then
     usage
     exit 1
   fi
   proj_checkout_dir="$checkout_dir/$head_tag"
   if [[ -d "$proj_checkout_dir" ]];
   then
      rm -rf "$proj_checkout_dir"
   fi

   $svn_home/bin/svn co --username $username $svn_repo/$project/trunk "$proj_checkout_dir"
   pom_file="$proj_checkout_dir"/pom.xml
   #some project are not Java
   if [[ -e "$pom_file" ]];
   then
      $mvn_home/bin/mvn -f "$pom_file" clean package
   fi
   exit 0
fi

#||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||P K G  T A G|||||||||||||||||||||||

if [[ $action == pkgt ]];
then
   tag=$3
   if [[ -z $tag ]];
   then
     usage
     exit 1
   fi
   proj_checkout_dir="$checkout_dir/$tag"
   if [[ -d "$proj_checkout_dir" ]];
   then
      rm -rf "$proj_checkout_dir"
   fi

   $svn_home/bin/svn co --username $username $svn_repo/$project/tags/$tag "$proj_checkout_dir"

   pom_file="$proj_checkout_dir"/pom.xml
   #some project are not Java
   if [[ -e "$pom_file" ]];
   then
      $mvn_home/bin/mvn -f "$pom_file" clean package
   fi
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||D E P|||||||||||||||||||||||

# deploy webapps and stand-alone apps

if [[ $action == dep ]];
then
   #dev or prd for now
   env=$3
   are_you_awake $env

   tag=$4
   #if tag is not passed to script then deploy head
   if [[ -z $tag ]];then
      tag=$head_tag
   fi
   #only tagged apps can be dep to prd
   if [[ $tag == $head_tag ]] && [[ $env == prd ]];
   then
      echo -e "\n>>>FAILED. Only tags can be deployed to production"
      exit 1
   fi
   #call func to setup the dep env
   setup_dep $project $env $tag
   echo -e "\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\nDEPLOYING project $project_p, tag $tag to environment $env_p on machine(s) $machines - project is a $dep_pkg_type so a package of extention $pkg_file_ext will be copied to dir $dep_dir\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n"

   #make sure only one dep pkg exist in build dir
   pkg_file_ptrn="$checkout_dir/$tag/target/*.$pkg_file_ext"
   pkg_count=`ls $( echo $pkg_file_ptrn )|wc -l` 
   if [[ $pkg_count -ne 1 ]];
   then
      echo -e "\n|||FAILED. There must exist only one package with extenstion $pkg_file_ext in the packaging directory\n"
      ls -ltr $pkg_file_ptrn
      exit 1
   fi

   #the name of the tar.gz or war file without path
   pkg_file=`ls $( echo $pkg_file_ptrn )|xargs basename`
   #the name of the tar.gz or war file with path
   pkg_file_path=`ls $( echo $pkg_file_ptrn )`

   #dep on machines by ssh with trusted public key
   first_machine=1
   for machine in $machines
   do
      #create archive dirs if it is the 1st dep on machine
      ssh "$service_acct@$machine" "mkdir -p $dep_archive/in; mkdir -p $dep_archive/out; mkdir -p $dep_archive/last mkdir -p $dep_archive/log"

      #cp dep pkg file to dir 'in' under the archive dir on machine.
      #machines share same NAS share so 2nd cp not needed
      if [[ "$first_machine" -eq 1 ]];
      then
         echo "scp dep pkg: $pkg_file"
         scp $pkg_file_path "$service_acct@$machine":"$dep_archive"/in
      fi
#--------------------------------------------------------------------------
#             W E B  A P P
#--------------------------------------------------------------------------
      if [[ webapp -eq 1 ]];
      then
         #ssh to the machines where webapps are deployed
         ssh "$service_acct@$machine" "pkg_file_p=$pkg_file dep_dir_p=$dep_dir dep_archive_p=$dep_archive module_name_p=$module_name first_machine_p=$first_machine timestamp_p=$timestamp" 'bash -s' << 'RMT_DPL_WEB'
        
         #if proj is being redep then mv the old war to archive with stamp
         #shared NAS so we need to backup once
         if [[ -e "$dep_dir_p/$pkg_file_p" ]] && [[ "$first_machine_p" -eq 1 ]];
         then 
            #keep last dep if rollback is needed
            cp -p "$dep_dir_p/$pkg_file_p" "$dep_archive_p/last/"
            mv "$dep_dir_p/$pkg_file_p" "$dep_archive_p/out/$pkg_file_p"_"$timestamp_p"
         fi
         #cp the proj new war to dep dir
         cp "$dep_archive_p/in/$pkg_file_p" "$dep_dir_p"
         #carry out any custom dep by calling script $module_name.custdep.sh
         cust_dep_scr="$dep_dir_p/$module_name_p"-custdep.sh
         if [[ -f "$cust_dep_scr" ]];
         then
            $cust_dep_scr
         fi
#end of input block HAS to start at the begining of the line
RMT_DPL_WEB
#--------------------------------------------------------------------------
#             S T A N D  A L O N E  A P P
#--------------------------------------------------------------------------
      else
         #ssh to dep machine and pass all required params
         ssh "$service_acct@$machine" "pkg_file_p=$pkg_file dep_dir_p=$dep_dir module_name_p=$module_name dep_archive_p=$dep_archive timestamp_p=$timestamp scripts_dir_name_p=$scripts_dir_name" 'bash -s' << 'RMT_DPL'
         #create the dep dir in case it is the proj 1st dep
         mkdir -p "$dep_dir_p"

         #keep last dep if rollback is needed
         if [[ -e "$dep_archive_p/last/$module_name_p" ]];
         then
            #old last dep must be removed
            rm -rf "$dep_archive_p/last/$module_name_p"
         fi
         cp -rp "$dep_dir_p" "$dep_archive_p/last/"

         #back up (by moving) the current dep dir to archive with stamp
         dep_dir_arch_name="$module_name_p"_"$timestamp_p"
         mv "$dep_dir_p" "$dep_archive_p/out/$dep_dir_arch_name"

         #make dep dir again since we moved it
         mkdir "$dep_dir_p"
         #archive scripts dir will be copied back to new dep
         scripts_dir="$dep_archive_p/out/$dep_dir_arch_name/$scripts_dir_name_p"
         #scripts dir does not exist if proj is dep for 1st time
         if [[ -d "$scripts_dir" ]];
         then
            cp -rp "$scripts_dir" "$dep_dir_p"
         fi

         #copy the new dep tar.gz file to the new dep dir and extract contents
         cp "$dep_archive_p/in/$pkg_file_p" "$dep_dir_p"
         tar -xf "$dep_dir_p"/"$pkg_file_p" -C "$dep_dir_p"
         #rmv the new dep gz file
         rm -f "$dep_dir_p"/"$pkg_file_p"
#end of input block HAS to start at the begining of the line
RMT_DPL
      fi
      first_machine=0
   done
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||R O L L B A C K|||||||||||||||||||||||

#roll back last or a specified war or dep dir.
if [[ $action == rollb ]];
then
   #dev or prd for now
   env=$3
   are_you_awake $env

   #call func to setup the dep env
   #at least one head build must exist for a proj that we want to rollback
   setup_dep $project $env $head_tag

   #rollback war file or stand-alone pkg dir
   if [[ webapp -eq 1 ]];
   then
      rollb_pkg_name="$module_name"."$webapp_file_ext"
      curr_dep="$dep_dir/$rollb_pkg_name"
   else
      rollb_pkg_name="$module_name"
      curr_dep="$dep_dir"
   fi

   #_ip means in-param
   rollb_pkg_ip=$4
   #if rollback pkg name is not passed to script rollback to last pkg
   if [[ -z "$rollb_pkg_ip" ]];then
      rollb_pkg="$dep_archive"/last/"$rollb_pkg_name"
   else
      rollb_pkg="$dep_archive"/out/"$rollb_pkg_ip"
   fi
   echo -e "\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\nROLLING BACK project $project_p, to deployment $rollb_pkg in environment $env on machine(s) $machines - project is a $dep_pkg_type\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n"

   #rollback on all machines
   for machine in $machines
   do
      #ssh to dep machine and pass all required params
      ssh "$service_acct@$machine" "curr_dep_p=$curr_dep dep_archive_p=$dep_archive rollb_pkg_p=$rollb_pkg" 'bash -s' << 'RMT_ROLLB'

      #check if rollback archive exist since it can be passed by user
      if [[ ! -e "$rollb_pkg_p" ]];
      then
  echo "archive specified for rollback does not exist: $rollb_pkg_p"
  exit 1
      fi
      #rmv the curr stand-alone dep we want to rollback
      #no need to rm war file since we can overwrite it
      if [[ "$webapp" -ne 1 ]];
      then
         rm -rf "$curr_dep_p"
      fi 
      #move back the archived dep to active dep
      mv "$rollb_pkg_p" "$curr_dep_p"
RMT_ROLLB
   done
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#||||||||||||||||||||||C O M M I T  D E P|||||||||||||||||||||

#commit a deployment common files and scripts and perhaps ddls
if [[ $action == cdep ]];
then
   env=$3
   commit_msg="Commiting Deployment - $4"

   #call func to setup the dep env
   #at least one head build must exist for dep we want to commit
   setup_dep $project $env $head_tag

   echo -e "\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\nCommitting deployment $project_p from environment $env_p on machine(s) $machines using script ~/$module_name.sh\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n"

   #pull dep files from  machines by ssh with trusted public key
   first_machine=1
   for machine in $machines
   do
      #execute remote func to collect the dep files in one dir
      if [[ "$first_machine" -eq 1 ]];
      then
         ssh "$service_acct@$machine" "dep_script_p=$module_name.sh dep_stg_dir_p=$project_p" 'bash -s' << 'CMT_DPL'
         #gather the dep files and scripts by calling script
         mkdir -p ~/"$dep_stg_dir_p"
         ~/"$dep_script_p"
CMT_DPL

         #copy the gathered files to the dep svn dir
         proj_checkout_dir="$checkout_dir/$head_tag"
         scp -r "$service_acct@$machine":"~/$project_p/*" "$proj_checkout_dir"

         #have to cd to dep svn dir
         cd "$proj_checkout_dir"
         #add to svn - force supresses warnings of file already in svn
         $svn_home/bin/svn add --force --username $username *
         #commit to svn
         $svn_home/bin/svn ci --username $username * -m "$commit_msg"
      fi
      first_machine=0
   done
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#||||||||||||||C O M M I T  P R O J  S C R I P T S||||||||||||

#commit project scripts
if [[ $action == cps ]];
then
   env=$3
   commit_msg="Commiting project scripts - $4"

   #call func to setup the dep env
   #at least one head build must exist for dep we want to commit
   setup_dep $project $env $head_tag

   echo -e "\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\nCommitting scripts for project $project_p from environment $env_p on machine(s) $machines\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n"

   #pull dep scripts from machines by ssh with trusted public key
   first_machine=1
   for machine in $machines
   do
      #execute remote func to collect the dep files in one dir
      if [[ "$first_machine" -eq 1 ]];
      then
         #scripts dir for webapps is in the dep parent dir
         if [[ "$webapp" -eq 1 ]];
         then
            parent_dir=".." 
         fi

         #copy scripts to the dep svn dir
         proj_checkout_scripts_dir="$checkout_dir/$head_tag/src/main/$scripts_dir_name"
         scp "$service_acct@$machine":"$dep_dir/$parent_dir/$scripts_dir_name/*" "$proj_checkout_scripts_dir"

         #have to cd to dep svn dir
         cd "$proj_checkout_scripts_dir"
         #add to svn - force supresses warnings of file already in svn
         $svn_home/bin/svn add --force --username $username *
         #commit to svn
         $svn_home/bin/svn ci --username $username * -m "$commit_msg"
      fi
      first_machine=0
   done
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||T A G|||||||||||||||||||||||

if [[ $action == tag ]];
then
   tag=$3
   msg="TAG@$today--$4"
   if [[ -z $tag ]];
   then
     usage
     exit 1
   fi
   #check if tag already used by looking under the checkout dir
   if [[ -d "$checkout_dir/$tag" ]];
   then
      echo "Project $project is already checked out under tag $tag. Exiting."
      exit 1
   fi
   $svn_home/bin/svn copy --username $username "$svn_repo/$project/trunk" "$svn_repo/$project/tags/$tag" -m "$msg"
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||L I S T   P R O J S|||||||||||||||||||||||

if [[ $action == listp ]];
then
   $svn_home/bin/svn --username $username list $svn_repo -v|grep -i $project
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||L I S T   T A G S|||||||||||||||||||||||

if [[ $action == listt ]];
then
   $svn_home/bin/svn --username $username list -v $svn_repo/$project/tags
   exit 0
fi

#|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||D E L  T A G||||||||||||||||||||||||

if [[ $action == delt ]];
then
   tag=$3
   if [[ -z $tag ]];
   then
     usage
     exit 1
   fi
   msg="TAG@$today--$4"
  $svn_home/bin/svn delete --username $username $svn_repo/$project/tags/$tag -m "$msg"
   exit 0
fi

#||||||||||||||||||||||||||||||||||||||||||||||||||||||
#|||||||||||||||||||||||D I F F||||||||||||||||||||||||
#list differences b/w 2 tag dirs of files  - normally the
#1st tag is the one in prd and the 2nd is the one we want to deploy
#the implication is that the prd tag is kept in the build dir or checked
#out for comparison. All dirs of files are assumed to exist the src dir.

#diff quiet lists the files that are different but not the differences
if [[ $action == diffq ]];
then
   #let it fall to the normal diff below it but set the quiet option
   action=diff
   quiet=q
   #not exit here bcz we want it to fall to the next diff
fi

if [[ $action == diff ]];
then
   #normally prd tag
   tag1=$3
   #normally the new dep tag
   tag2=$4

   comp_dir=$5
   #files or dirs must exist in the src/main dir - maven starndard
   tag1_dir="$checkout_dir/$tag1/src/main/$comp_dir"
   tag2_dir="$checkout_dir/$tag2/src/main/$comp_dir"

   if [[ -z $tag1 ]] || [[ -z tag2 ]];
   then
      usage
      exit 1
   fi

   #diff recursively ignoring line endings
   diff -wr"$quiet" "$tag1_dir" "$tag2_dir"
   exit 0
fi

usage
exit 0