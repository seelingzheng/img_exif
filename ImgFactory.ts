const ExifImage = require('exif').ExifImage;
const SA = require('superagent');
export class ImgFactory {


    private bdUrl = 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&output=json&pois=1&ak=73hSBu59p40Nl2IkfDgPFPZ6GEpiTe4u'
    //&location=30.641869444444445,103.65866111111112
    constructor() {

    }

    public getGPSObj(imgurl?: String) {
        let that = this;
        return new Promise(function (resolve, reject) {
            try {
                new ExifImage({image: imgurl}, function (error, exifData) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    }
                    else {

                        let gps: Array<number> = [];
                        let imgGPSObj = exifData.gps;
                        if (imgGPSObj && imgGPSObj['GPSLatitude']) {
                            let latitude: number = that.convert(imgGPSObj['GPSLatitude']);
                            let longitude: number = that.convert(imgGPSObj['GPSLongitude']);
                            let altitude: number = imgGPSObj['GPSAltitude'] * 1;
                            gps.push(latitude, longitude, altitude);

                            resolve(gps);
                        } else {
                            resolve([]);
                        }


                    }
                });
            } catch (error) {
                console.log('Error: ' + error.message);
                reject(error);
            }
        })
    }

    private convert(obj: Array<number>): number {
        let newObj: number = 0;
        if (obj.length > 0) {
            obj.forEach(function (item, i) {
                newObj = newObj + item / Math.pow(60, i);
            })
        }
        return newObj
    }


    public async  getAddressByImg(imgUrl: string, file: string) {
        let lngLat: any = await this.getGPSObj(imgUrl);
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
                        } else {
                            let data = res.text;
                            let formatData = data.replace('renderReverse&&renderReverse(', '');
                            formatData = formatData.substring(0, formatData.length - 1);

                            let address = JSON.parse(formatData).result['formatted_address'];

                            obj[file] = {
                                lngLat,
                                address,
                                imgUrl,
                            }
                            resolve(obj);
                        }
                    })
            }
        })

    }

}
