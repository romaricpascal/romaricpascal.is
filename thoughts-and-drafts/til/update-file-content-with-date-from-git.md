Update front-matter with date from Git
===

```sh
for post in content/posts/*.md
do
# Needs a recentish version of Git for '%as' to work
# based on https://stackoverflow.com/a/19708217
date=`git log --pretty="%as" --follow -- $post | tail -1`
# https://stackoverflow.com/a/148473
sed -i "0,/---/{s//---\ndate: $date/}" $post
done
```
