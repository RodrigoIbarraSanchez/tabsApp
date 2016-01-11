'use strict';

angular.module('slangAdventure.uploadService', ['ngFileUpload', 'slangAdventure.userFactory'])

.service('uploadService', ['Upload', 'userFactory',
function(                   Upload,   userFactory) {

	this.upload = function(file, callback){
		Upload.upload({
            //url: 'http://localhost:8888/slangbackend/web/app_dev.php/api/users/525514103867/profilepictures?access_token=YjI1MGZjZmJlMTFjZmI2OWE3Y2NlZWI0NWVmYjc2M2MzMjJjOGE5YTc2OWJiYzdiZTk3NTZmMDg0YzUyOWM3MQ',
            url: 'https://slangbackend.herokuapp.com/api/users/'+userFactory.getNumber()+'/profilepictures?access_token='+userFactory.getAccessToken(),
            data: {file: file}
        }).then(function (resp) {
            callback(resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
	};

}]); 