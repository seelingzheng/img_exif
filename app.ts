const fs = require('fs');
const path = require('path');

import {ImgFactory} from './ImgFactory';

var imgF = new ImgFactory();

function getImgUrl(url: string) {
    fs.readdir(url, function (err, files) {
        if (files && files.length > 0) {
            files.forEach(function (file) {
                let fileP = path.join('./', url, file)
                let stat = fs.lstatSync(fileP)
                if (stat.isDirectory()) {
                    getImgUrl(fileP);
                } else {
                    //console.log(fileP);
                    getGPS(fileP, file);
                }
            })
        } else {
            console.error(err)
        }
    })
}


async function getGPS(imgUrl: string, file: string) {
    let result = await imgF.getAddressByImg(imgUrl, file);
    console.log(result);
}

getImgUrl('./img');
module.exports = getImgUrl;
