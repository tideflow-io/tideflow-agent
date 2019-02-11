#!/bin/bash
for ((i=1;i<=$#;i++));
do

    if [ ${!i} = "-git" ] 
    then ((i++)) 
        git push origin master;

    elif [ ${!i} = "-npm" ];
    then ((i++)) 
        npm publish --access public;
    fi

done;