#||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
# Sample app profile
# All profiles must define the same variables
# and overwrite the same functions
#||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

username=`logname`
service_acct_dev=dev
service_acct_qa=uat
service_acct_dr=dr
service_acct_prd=prd

dev_machines="machine1"
qa_machines="machine2"
prd_machines="machine3 machine4"

#some folk like to call it bin
scripts_dir_name=scripts
webapp_file_ext=war
pkg_app_file_ext=tar.gz
svn_home=/usr/local/subversion-1.7.2
svn_repo=http://subversion.repo
mvn_home=/home/haldokan/apache-maven-3.0.4

#dir name where proj is deployed or name of war or ear file
function get_dep_module_name() {
   local proj_name=$1
   echo "$(echo $proj_name|tr '[:upper:]' '[:lower:]')"
}

#full path of dep dir
function get_app_dep_dir() {
   local service_acct=$1
   local module=$2
   local webapp=$3
   if [[ webapp -eq 1 ]];
   then
      echo "/home/$service_acct/apps/tomcat/webapps"
   else
      echo "/home/$service_acct/apps/$module"
   fi
}

function dep_dir_shared_by_machines() {
   local env=$1
   local webapp=$2
   if [[ $webapp -ne 1 ]];
   then
      return 1
   else
      return 0
   fi
}
