"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const ImgFactory_1 = require("./ImgFactory");
var imgF = new ImgFactory_1.ImgFactory();
function getImgUrl(url) {
    fs.readdir(url, function (err, files) {
        if (files && files.length > 0) {
            files.forEach(function (file) {
                let fileP = path.join('./', url, file);
                let stat = fs.lstatSync(fileP);
                if (stat.isDirectory()) {
                    getImgUrl(fileP);
                }
                else {
                    //console.log(fileP);
                    getGPS(fileP, file);
                }
            });
        }
        else {
            console.error(err);
        }
    });
}
function getGPS(imgUrl, file) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield imgF.getAddressByImg(imgUrl, file);
        console.log(result);
    });
}
getImgUrl('./img');
module.exports = getImgUrl;
