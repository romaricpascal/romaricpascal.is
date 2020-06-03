SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
SITE_PATH=site

deploy_id=romaricpascal.is-`date '+%y%m%d%H%M%S'`
workdir="/tmp/deploy/$deploy_id"
archive_path=$workdir.tar.gz
branch=master

: ${1?"The script needs to know which host to deploy to. './deploy.sh <host> <target>'"}
host=$1

: ${2?"The script needs to know in which folder to deploy. './deploy.sh <host> <target>'"}
target=$2

branch=$3

echo "Packaging project before upload"

echo " - Creating tarball"
(cd $SITE_PATH && tar -cvzf $archive_path *)

echo "Archive ready for upload at $archive_path"

echo "Uploading"
scp $archive_path $host:.

# # RESTART HERE: Extract archive on remote server, copy resources & swap folders
./deploy__remote.sh $host $target $deploy_id

# # echo "Cleaning up local files"
# # rm -rf "$workdir*"
