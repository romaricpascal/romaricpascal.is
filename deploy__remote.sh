: ${1?"The script needs to know which host to deploy to. './deploy.sh <host> <target> <deploy_id>'"}
host=$1

: ${2?"The script needs to know in which folder to deploy. './deploy.sh <host> <target> <deploy_id>'"}
target=$2

: ${3?"The script needs to know in which deployment to run. './deploy.sh <host> <target> <deploy_id>'"}
deploy_id=$3

ssh $host <<-ENDSH

  echo "Expanding archive"
  mkdir $deploy_id
  tar -xvzf $deploy_id.tar.gz -C $deploy_id

  echo "Copying current content over to new deployment"
  [ -e $target/.htaccess ] && cp -r $target/.htaccess $deploy_id
  [ -e $target/.htpasswd ] && cp -r $target/.htpasswd $deploy_id

  echo "Swapping old deployment for new one"
  [ -e "$target-old" ] && rm -r "$target-old"
  mv $target $target-old
  mv $deploy_id $target

  # echo "Cleaning up remote files"
  # rm "$deploy_id.tar.gz"

ENDSH
