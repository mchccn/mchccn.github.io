if [ $# -eq 0 ] ; then
    echo "need to provide folder name"
    exit 1
fi

shopt -s extglob

git branch -D gh-pages

git checkout -b gh-pages

mv $1/* .

rmdir $1

git add .

git commit -m "publish $1"

git push -u origin gh-pages --force

git switch master

shopt -u extglob