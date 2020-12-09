SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
SITE_PATH=dist
WORK_DIR=/tmp/deploy
DEPLOY_ID=romaricpascal.is-`date '+%y%m%d%H%M%S'`
ARCHIVE_PATH="$WORK_DIR/$DEPLOY_ID.tar.gz"
branch=master

: ${1?"The script needs to know which host to deploy to. './deploy.sh <host> <target>'"}
host=$1

: ${2?"The script needs to know in which folder to deploy. './deploy.sh <host> <target>'"}
target=$2

branch=$3

echo "Packaging project before upload"

echo " - Creating temp directory"
mkdir -p $WORK_DIR

echo " - Creating tarball"
(cd $SITE_PATH && tar -cvzf $ARCHIVE_PATH *)

echo "Archive ready for upload at $ARCHIVE_PATH"

echo "Uploading"
scp $ARCHIVE_PATH $host:.

# # RESTART HERE: Extract archive on remote server, copy resources & swap folders
./deploy__remote.sh $host $target $DEPLOY_ID

# # echo "Cleaning up local files"
# # rm -rf "$WORK_DIR/*"
