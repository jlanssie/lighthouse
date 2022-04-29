#!/bin/zsh
# FUNCTION: Run lighthouse on a set of URLs
# ARGUMENTS: /
# REQUIRES: zsh, lighthouse

urls="./urls.txt"
output_directory="./output/"
echo ...
while ifs= read -r url
do
	filename=$(echo $url | sed s'/https\:\/\///'g)
	lighthouse "$url" --only-categories=performance --chrome-flags="--headless" --form-factor=mobile --screenEmulation.mobile --output=json --output-path="$output_directory""$filename"-mobile-results-.json;
done <<< $(cat "$urls")
echo done
exit 0