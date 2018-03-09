var gulp = require('gulp'),
    args = require('yargs').argv,
    exec = require('child_process').execSync,
    log = require('fancy-log');

gulp.task('BuildDockerImage',function(){
	exec('cat pwd.txt | docker login --username ellensu --password-stdin');
	exec('docker build -f Dockerfile -t ellensu/nginxweb:' + args.buildversion +' -t ellensu/nginxweb:latest --rm --no-cache .', function (err,outlog,errlog){
		console.log(outlog);
		console.log(errlog);
	});
})

gulp.task('PushImage',['BuildDockerImage'],function(){
	exec('docker push ellensu/nginxweb:' + args.buildversion, function (err,outlog,errlog){
		console.log(outlog);
		console.log(errlog);
	});
	exec('docker push ellensu/nginxweb:latest', function (err,outlog,errlog){
		console.log(outlog);
		console.log(errlog);
	});
})
//這段是for play-with-docker特別寫的 與實際server ssh不同
gulp.task('SSHServer',['PushImage'],function() {
	exec('ssh -t ip172-18-0-12-bah18mkprd20009cq2tg@direct.labs.play-with-docker.com -Y');
})

gulp.task('UpdateDockerCompose',['SSHServer'],function() {;
	exec('docker-compose pull web','docker-compose up -d --no-deps --build web');
})

gulp.task('Deploy.stg',['UpdateDockerCompose']);