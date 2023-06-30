if [ $# -eq 0 ] ; then
    echo "need to provide folder name"
    exit 1
fi

shopt -s extglob

git branch -D gh-pages

git checkout -b gh-pages

cp -r $1 _temp

rm -r !(_temp)

mv _temp/* .

rmdir _temp

git add .

git commit -m "publish $1"

git push -u origin gh-pages

git switch master

shopt -u extglob