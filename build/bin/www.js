const program = require('commander');
const img_exif = require('../app');
program.allowUnknownOption()
    .version('1.0.0')
    .usage('exif [input]');
program.command('url')
    .description('文件夹路径')
    .action(function (url) {
    img_exif(url);
});
if (!process.argv[2]) {
    program.help();
    console.log();
}
program.parse(process.argv);
