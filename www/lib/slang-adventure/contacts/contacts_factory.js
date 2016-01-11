'use strict';

angular.module('slangAdventure.contactsFactory', [])

.factory('contactsFactory', ['userFactory', function(userFactory){

    var contacts = {
        contacts: []
    };

    contacts.getContactInfoFromNumber = function (num){
        for (var i = this.contacts.length - 1; i >= 0; i--) {
            if (this.contacts[i].number == num) {
                if (this.contacts[i].lastname == null) {
                    var fullName = this.contacts[i].name;
                }
                else{
                    var fullName = this.contacts[i].name+' '+this.contacts[i].lastname;
                }
                return{
                    picture: this.contacts[i].profile_picture,
                    fullName: fullName,
                    lastSeen: null,
                    number: num,
                    status: this.contacts[i].status
                };
            }
        }
        return{
                picture: 'https://slangbackend.herokuapp.com/img/dummy.jpg',
                fullName: num,
                lastSeen: null,
                number: num,
                status: null
            };
    };

    contacts.getNamesFromArray = function (cts, callback){
        var contactList = '';

        var count = 0;
        var limit = cts.length;

        angular.forEach(cts, function (num){
            contacts.getNameFromNumAsync(num, function(name){
                contactList += name;
                count++;
                if (count < limit) {
                    contactList+=', ';
                }
                else{
                    callback(contactList);
                }
            });
        });
    };


    contacts.getNameFromNumAsync = function (num, callback){

        if (num == userFactory.getNumber()) {
            callback('Tú');
        }
        else{
            var count = 0;
            var limit = this.contacts.length;
            angular.forEach(this.contacts, function (contact){
                if (contact.number == num) {
                    callback(contact.name);
                    limit = 99998;
                }
                count++;
                if (count >= limit) {
                    callback(num);
                };
            });
        }
    };

    contacts.getNameFromNum = function (num){

        if (num == userFactory.getNumber()) {
            return userFactory.getName();
        }

        for (var i = this.contacts.length - 1; i >= 0; i--) {
            if (this.contacts[i].number == num) {
                return this.contacts[i].name;
            }
        }

        return num;
    };

    contacts.getNameFromChat = function (chat){

        for (var i = this.contacts.length - 1; i >= 0; i--) {
            if (this.contacts[i].number == chat.chatName) {
                this.contacts[i].chatId = chat.chatId;
                if (this.contacts[i].lastname == null) {
                    return this.contacts[i].name;
                }
                else{
                    return this.contacts[i].name+' '+this.contacts[i].lastname;
                }
            }
        }

        return chat.chatName;
    };

    contacts.getPictureFromNumber = function (num){

        if(!isNumber(num)){
            return 'http://res.cloudinary.com/slangvoom/image/upload/v1451724816/lyefirraoz9veqtqaqxe.png';
        }
        else if (num == userFactory.getNumber()) {
            return userFactory.getProfilePicture();
        }
        else{
            for (var i = this.contacts.length - 1; i >= 0; i--) {
                if (this.contacts[i].number == num) {
                    return this.contacts[i].profile_picture;
                }
            }
            return 'https://slangbackend.herokuapp.com/img/dummy.jpg';
        }
    };

    contacts.messageClassColor = function (num){
        if (num == userFactory.getNumber()) {
            return 'myOwnsMessage';
        }
        else{
            return 'someBodysMessage';
        }
    };

    contacts.messageClassOrder = function (num){
        if (num == userFactory.getNumber()) {
            return 'text-right';
        }
        else{
            return 'text-left';
        }
    };

    contacts.showName = function (num){
        if (num == userFactory.getNumber()) {
            return false;
        }
        else{
            return true;
        }
    }

    return contacts;

    // Saber si el nombre del chat es número o no
    function isNumber(n){
        n = Number(n);
        return n % 1 === 0;
    }
}]);