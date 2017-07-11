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
const ExifImage = require('exif').ExifImage;
const SA = require('superagent');
class ImgFactory {
    //&location=30.641869444444445,103.65866111111112
    constructor() {
        this.bdUrl = 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&output=json&pois=1&ak=73hSBu59p40Nl2IkfDgPFPZ6GEpiTe4u';
    }
    getGPSObj(imgurl) {
        let that = this;
        return new Promise(function (resolve, reject) {
            try {
                new ExifImage({ image: imgurl }, function (error, exifData) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    }
                    else {
                        let gps = [];
                        let imgGPSObj = exifData.gps;
                        if (imgGPSObj && imgGPSObj['GPSLatitude']) {
                            let latitude = that.convert(imgGPSObj['GPSLatitude']);
                            let longitude = that.convert(imgGPSObj['GPSLongitude']);
                            let altitude = imgGPSObj['GPSAltitude'] * 1;
                            gps.push(latitude, longitude, altitude);
                            resolve(gps);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            }
            catch (error) {
                console.log('Error: ' + error.message);
                reject(error);
            }
        });
    }
    convert(obj) {
        let newObj = 0;
        if (obj.length > 0) {
            obj.forEach(function (item, i) {
                newObj = newObj + item / Math.pow(60, i);
            });
        }
        return newObj;
    }
    getAddressByImg(imgUrl, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let lngLat = yield this.getGPSObj(imgUrl);
            //console.log(file,lngLat);
            let that = this;
            return new Promise(function (resolve, reject) {
                let obj = {};
                if (lngLat && lngLat.length > 0) {
                    SA.get(that.bdUrl)
                        .query({
                        location: lngLat.join(',')
                    })
                        .end(function (err, res) {
                        if (err) {
                            console.error('bad url request:', err);
                            reject(err);
                        }
                        else {
                            let data = res.text;
                            let formatData = data.replace('renderReverse&&renderReverse(', '');
                            formatData = formatData.substring(0, formatData.length - 1);
                            let address = JSON.parse(formatData).result['formatted_address'];
                            obj[file] = {
                                lngLat,
                                address,
                                imgUrl,
                            };
                            resolve(obj);
                        }
                    });
                }
            });
        });
    }
}
exports.ImgFactory = ImgFactory;
