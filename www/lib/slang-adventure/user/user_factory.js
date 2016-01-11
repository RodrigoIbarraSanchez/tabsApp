'use strict';

angular.module('slangAdventure.userFactory', [])

.factory('userFactory', [function(){

    var user = {};

    var number = null;
    var uid = null;
    var name = '';
    var lastname = '';
    var status = '';
    var profile_picture = null;
    var access_token = null;
    var firebase_token = null;

    user.reset = function(){
        number = null;
        uid = null;
        name = '';
        lastname = '';
        status = '';
        access_token = null;
        firebase_token = null;
    };

    user.setNumber = function(newNum){
        number = newNum;
    };

    user.setName = function(newName){
        name = newName;
    };

    user.setLastname = function(newLastname){
        lastname = newLastname;
    };

    user.setStatus = function(newStatus){
        status = newStatus;
    };

    user.getStatus = function(){
        return status;
    };

    user.setProfilePicture = function(newProfilePicture){
        profile_picture = newProfilePicture;
    };

    user.getProfilePicture = function(){
        return profile_picture;
    };

    user.saveLoginInfo = function(data){
        uid = data.uid;
        number = data.number;
        name = data.name;
        if (data.lastname != null) {lastname = data.lastname}
        profile_picture = data.profile_picture;
        access_token = data.access_token;
        firebase_token = data.firebase_token;
        status = data.status;
    };

    user.getNumber = function(){
        return number;
    };

    user.getFullName = function(){
        if (lastname == null) {
            return name;
        }else{
            return name+' '+lastname;
        }
    }

    user.getName = function(){
        return name;
    };

    user.getLastname = function(){
        return lastname;
    };

    user.getAccessToken = function(){
        return access_token;
    }

    user.getUserId = function(){
        return uid;
    };

    user.getFirebaseToken = function(){
        return firebase_token;
    };

    return user;
}]);